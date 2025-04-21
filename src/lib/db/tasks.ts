import { Database, Json } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { createActivityLog } from "./activityLogs"; // Import the logging function

// --- Type Definitions for Joined Data ---

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

type Label = Database["public"]["Tables"]["labels"]["Row"];
type TaskComment = Database["public"]["Tables"]["task_comments"]["Row"];
type TaskAttachment = Database["public"]["Tables"]["task_attachments"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

// Type for a Task with its common related data
export type TaskWithDetails = Task & {
	labels: Label[]; // Direct array of Label objects
	task_comments: (TaskComment & { users: Pick<User, "id"> | null })[]; // Comments with user info
	task_attachments: (TaskAttachment & { users: Pick<User, "id"> | null })[]; // Attachments with uploader info
	assigned_user: Pick<User, "id"> | null; // Renamed for clarity
	creator_user: Pick<User, "id"> | null; // Renamed for clarity
	// Note: task_labels junction table data is implicitly handled via the labels array
};

export type TaskSummary = Omit<Task, "created_at" | "created_by"> & {
	labels: Label[]; // Direct array of Label objects
};

// --- Helper Function for Logging Changes ---

function generateChangeDetails(
	oldData: Partial<Task>,
	newData: Partial<Task>
): Json | null {
	const changes: Record<
		string,
		{
			old: string | number | null | undefined;
			new: string | number | null | undefined;
		}
	> = {};
	for (const key in newData) {
		if (
			Object.prototype.hasOwnProperty.call(newData, key) &&
			key !== "id" &&
			key !== "created_at"
		) {
			const newValue = newData[key as keyof Task];
			const oldValue = oldData[key as keyof Task];
			// Basic comparison (doesn't handle deep objects well, adjust if needed)
			if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
				changes[key] = { old: oldValue, new: newValue };
			}
		}
	}
	return Object.keys(changes).length > 0 ? { changed: changes } : null;
}

// --- CRUD Operations ---

/**
 * CREATE Task and Log Activity
 * @param taskData Data for the new task
 * @param userId ID of the user performing the action (for logging)
 */
export async function createTaskWithActivity(
	taskData: TaskInsert
): Promise<Task> {
	const supabase = createClient();
	const user = await supabase.auth.getUser(); // Get the current user session
	if (!user?.data?.user)
		throw new Error("Supabase session not found. User must be logged in.");
	if (!taskData.created_by) taskData.created_by = user.data.user.id; // Ensure created_by is set
	if (!taskData.created_at) taskData.created_at = new Date().toISOString(); // Ensure created_at is set

	const { data: newTask, error } = await supabase
		.from("tasks")
		.insert(taskData)
		.select()
		.single();

	if (error) {
		console.error("Error creating task:", error);
		throw error;
	}
	if (!newTask) {
		throw new Error("Task creation returned no data.");
	}

	// Log activity (fire-and-forget, don't let logging failure break creation)
	createActivityLog({
		action: "CREATED_TASK",
		user_id: user.data.user.id,
		task_id: newTask.id,
		details: { title: newTask.title }, // Log basic info
	}).catch((logError) =>
		console.error("Failed to log task creation:", logError)
	);

	return newTask;
}

/**
 * READ Task by ID with related details (Labels, Comments, Attachments, Users, Project)
 * @param taskId The ID of the task to fetch
 */
export async function getTaskByIdWithDetails(
	taskId: string
): Promise<TaskWithDetails | null> {
	const { data, error } = await createClient()
		.from("tasks")
		.select(
			`
            *,
            task_labels!inner(*, labels(*)),
            task_comments(*, users(id)),
            task_attachments(*, users!task_attachments_uploaded_by_fkey(id)),
            assigned_user:users!tasks_assigned_to_fkey(id),
            creator_user:users!tasks_created_by_fkey(id)
        `
		)
		.eq("id", taskId)
		.single();

	if (error && error.code !== "PGRST116") {
		// Ignore 'No rows found'
		console.error("Error fetching task with details:", error);
		throw error;
	}

	if (!data) return null;

	// Process the data to structure labels correctly
	const processedData = {
		...data,
		labels: data.task_labels?.map((tl) => tl.labels).filter(Boolean) ?? [], // Extract labels from junction
		// task_labels: undefined // Remove the junction table data if not needed directly
	};
	// delete processedData.task_labels; // Cleaner way to remove

	return processedData as unknown as TaskWithDetails; // Cast needed due to complex select + processing
}

/**
 * READ Tasks with filtering and optional related details
 * @param options Filtering and selection options
 */
export async function getTaskSummary(
	projectId: string
): Promise<TaskSummary[]> {
	// Return type depends on includeDetails

	const { data, error } = await createClient()
		.from("task_summary_view")
		.select(`*`)
		.eq("project_id", projectId)
		.order("created_at", { ascending: false }); // Default sort

	if (error) {
		console.error("Error fetching filtered tasks:", error);
		throw error;
	}

	// group labels of same task
	const groupedData = data?.reduce((acc: TaskSummary[], task) => {
		const existingTask = acc.find((t) => t.id === task.task_id);
		if (existingTask) {
			existingTask.labels.push({
				id: task.label_id || "",
				name: task.label_name || "",
				color: task.label_color || "",
				project_id: task.project_id || "",
			});
		} else {
			acc.push({
				title: task.title || "",
				id: task.task_id || "",
				description: task.description || "",
				status: task.status || "",
				priority: task.priority || 0,
				start_date: task.start_date || null,
				due_date: task.due_date || null,
				assigned_to: task.assigned_to || null,
				project_id: task.project_id || "",
				parent_task_id: task.parent_task_id || null,
				percent: task.percent || 0,
				labels: [
					{
						id: task.label_id || "",
						name: task.label_name || "",
						color: task.label_color || "",
						project_id: task.project_id || "",
					},
				],
			});
		}
		return acc;
	}, [] as TaskSummary[]);

	return groupedData || [];
}

/**
 * UPDATE Task and Log Activity
 * @param taskId ID of the task to update
 * @param taskData Data to update
 * @param userId ID of the user performing the action (for logging)
 */
export async function updateTaskWithActivity(
	taskId: string,
	taskData: Task
): Promise<Task> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	// 1. Fetch current task state for comparison (optional but good for detailed logging)
	let oldTaskData: Partial<Task> = {};
	try {
		const { data: currentTask, error: fetchError } = await supabase
			.from("tasks")
			.select("*")
			.eq("id", taskId)
			.single();
		if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
		if (currentTask) oldTaskData = currentTask;
	} catch (err) {
		console.error("Error fetching task before update for logging:", err);
		// Proceed with update even if fetch fails, logging will be less detailed
	}

	// 2. Perform the update
	const { data: updatedTask, error: updateError } = await supabase
		.from("tasks")
		.update(taskData)
		.eq("id", taskId)
		.select()
		.single();

	if (updateError) {
		console.error("Error updating task:", updateError);
		throw updateError;
	}
	if (!updatedTask) {
		throw new Error("Task update returned no data.");
	}

	// 3. Log activity
	const changes = generateChangeDetails(oldTaskData, taskData);
	if (changes) {
		createActivityLog({
			action: "UPDATED_TASK",
			user_id: user.id,
			task_id: taskId,
			details: changes,
		}).catch((logError) =>
			console.error("Failed to log task update:", logError)
		);
	}

	return updatedTask;
}

/**
 * DELETE Task and Log Activity
 * @param taskId ID of the task to delete
 */
export async function deleteTaskWithActivity(taskId: string): Promise<void> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	// Optional: Fetch task details before deleting for logging purposes
	let deletedTaskTitle = `Task ID: ${taskId}`;
	try {
		const { data: taskToDelete } = await supabase
			.from("tasks")
			.select("id, title")
			.eq("id", taskId)
			.single();
		if (taskToDelete) deletedTaskTitle = taskToDelete.title;
	} catch (err: unknown) {
		// Ignore if task not found or error fetching
		console.error("Error fetching task before deletion for logging:", err);
	}

	const { error } = await supabase.from("tasks").delete().eq("id", taskId);

	if (error) {
		console.error("Error deleting task:", error);
		// Consider if FK constraints prevent deletion (e.g., if comments/attachments exist and ON DELETE is not CASCADE)
		throw error;
	}

	// Log activity
	createActivityLog({
		action: "DELETED_TASK",
		user_id: user.id,
		task_id: taskId, // Log the ID even if task is gone
		details: { title: deletedTaskTitle }, // Log title if fetched
	}).catch((logError) =>
		console.error("Failed to log task deletion:", logError)
	);
}

// --- Task Relationship Management (Labels, Comments, Attachments) ---

/**
 * Assign a Label to a Task and Log Activity
 */
export async function assignLabelToTask(
	taskId: string,
	labelId: string
): Promise<void> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	const { error } = await supabase
		.from("task_labels")
		.insert({ task_id: taskId, label_id: labelId });

	if (error) {
		if (error.code === "23505") {
			// Handle duplicate assignment gracefully
			console.warn(`Label ${labelId} already assigned to task ${taskId}`);
			return; // Or throw a specific "already assigned" error if needed
		}
		console.error("Error assigning label to task:", error);
		throw error;
	}

	// Log activity
	createActivityLog({
		action: "ASSIGNED_LABEL",
		user_id: user.id,
		task_id: taskId,
		details: { label_id: labelId },
	}).catch((logError) =>
		console.error("Failed to log label assignment:", logError)
	);
}

/**
 * Remove a Label from a Task and Log Activity
 */
export async function removeLabelFromTask(
	taskId: string,
	labelId: string
): Promise<void> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	const { error } = await supabase
		.from("task_labels")
		.delete()
		.eq("task_id", taskId)
		.eq("label_id", labelId);

	if (error) {
		console.error("Error removing label from task:", error);
		throw error;
	}

	// Log activity
	createActivityLog({
		action: "REMOVED_LABEL",
		user_id: user.id,
		task_id: taskId,
		details: { label_id: labelId },
	}).catch((logError) =>
		console.error("Failed to log label removal:", logError)
	);
}

// --- Task Comments ---
type TaskCommentInsert =
	Database["public"]["Tables"]["task_comments"]["Insert"];
type TaskCommentUpdate =
	Database["public"]["Tables"]["task_comments"]["Update"];

export async function addTaskComment(
	commentData: Omit<TaskCommentInsert, "id" | "created_at">
): Promise<TaskComment> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	commentData.user_id = user.id; // Ensure user_id is set

	const { data, error } = await supabase
		.from("task_comments")
		.insert(commentData)
		.select("*, users(id)") // Return comment with user details
		.single();

	if (error) {
		console.error("Error adding task comment:", error);
		throw error;
	}
	if (!data) throw new Error("Comment creation returned no data.");

	// Log activity
	createActivityLog({
		action: "ADDED_COMMENT",
		user_id: user.id,
		task_id: commentData.task_id,
		details: {
			comment_id: data.id,
			content_preview: data.content?.substring(0, 50),
		}, // Log preview
	}).catch((logError) =>
		console.error("Failed to log comment addition:", logError)
	);

	return data;
}

export async function updateTaskComment(
	commentId: string,
	commentData: TaskCommentUpdate
): Promise<TaskComment> {
	// Add permission check: Ensure userId matches comment's user_id before allowing update
	// const { data: existingComment } = await createClient().from('task_comments').select('user_id').eq('id', commentId).single();
	// if (!existingComment || existingComment.user_id !== userId) throw new Error("Permission denied to update comment.");

	const { data, error } = await createClient()
		.from("task_comments")
		.update(commentData)
		.eq("id", commentId)
		.select("*, users(id)")
		.single();

	if (error) {
		console.error("Error updating task comment:", error);
		throw error;
	}
	if (!data) throw new Error("Comment update returned no data.");

	// Optionally log comment edits if needed (might be too noisy)
	// createActivityLog({...})

	return data;
}

export async function deleteTaskComment(commentId: string): Promise<void> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	// Add permission check: Ensure userId matches comment's user_id or user has admin rights
	const { data: commentInfo, error: fetchErr } = await supabase
		.from("task_comments")
		.select("id, task_id, user_id")
		.eq("id", commentId)
		.single();

	if (fetchErr || !commentInfo)
		throw new Error("Comment not found or error fetching.");
	if (commentInfo.user_id !== user.id)
		throw new Error("Permission denied to delete comment.");

	const { error } = await supabase
		.from("task_comments")
		.delete()
		.eq("id", commentId);

	if (error) {
		console.error("Error deleting task comment:", error);
		throw error;
	}

	// Log activity
	createActivityLog({
		action: "DELETED_COMMENT",
		user_id: user.id,
		task_id: commentInfo.task_id, // Need task_id from fetched comment
		details: { comment_id: commentId },
	}).catch((logError) =>
		console.error("Failed to log comment deletion:", logError)
	);
}

// --- Task Attachments ---
type TaskAttachmentInsert =
	Database["public"]["Tables"]["task_attachments"]["Insert"];

// Note: Deleting attachments often requires deleting from Storage too!
// TODO: Upload attachments to Supabase Storage and get URL for the attachment record
export async function addTaskAttachment(
	attachmentData: TaskAttachmentInsert
): Promise<TaskAttachment> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");
	if (!user.id || !attachmentData.task_id || !attachmentData.url)
		throw new Error("User ID, Task ID, and URL required for attachment.");
	attachmentData.uploaded_by = user.id;

	const { data, error } = await supabase
		.from("task_attachments")
		.insert(attachmentData)
		.select("*, users!task_attachments_uploaded_by_fkey(id)")
		.single();

	if (error) {
		console.error("Error adding task attachment record:", error);
		throw error;
	}
	if (!data) throw new Error("Attachment creation returned no data.");

	// Log activity
	createActivityLog({
		action: "ADDED_ATTACHMENT",
		user_id: user.id,
		task_id: attachmentData.task_id,
		details: { attachment_id: data.id, url: data.url },
	}).catch((logError) =>
		console.error("Failed to log attachment addition:", logError)
	);

	return data;
}

export async function deleteTaskAttachment(
	attachmentId: string
): Promise<void> {
	const supabase = createClient();
	const user = (await supabase.auth.getUser()).data.user; // Get the current user session
	if (!user)
		throw new Error("Supabase session not found. User must be logged in.");

	// 1. Fetch attachment details (including URL and task_id for logging/storage deletion)
	const { data: attachmentInfo, error: fetchErr } = await supabase
		.from("task_attachments")
		.select("*")
		.eq("id", attachmentId)
		.single();

	if (fetchErr || !attachmentInfo)
		throw new Error("Attachment not found or error fetching.");
	// Add permission check if needed (e.g., only uploader or project members can delete)
	// if (attachmentInfo.uploaded_by !== userId && !isProjectMember(userId, taskId)) throw new Error("Permission denied.");

	// 2. **IMPORTANT**: Delete the file from Supabase Storage
	try {
		const url = new URL(attachmentInfo.url);
		// Extract path after bucket name (adjust if your URL structure differs)
		const pathSegments = url.pathname.split("/");
		if (pathSegments.length >= 4) {
			// e.g., /storage/v1/object/public/bucket_name/file_path.jpg
			const bucketName = pathSegments[4];
			const filePath = pathSegments.slice(5).join("/");
			console.log(
				`Attempting to delete from storage: bucket=${bucketName}, path=${filePath}`
			);
			const { error: storageError } = await supabase.storage
				.from(bucketName)
				.remove([filePath]);
			if (storageError) {
				console.error(
					"Error deleting file from storage:",
					storageError
				);
				// Decide whether to proceed with deleting the DB record if storage deletion fails
				// throw new Error(`Failed to delete file from storage: ${storageError.message}`);
			}
		} else {
			console.warn(
				`Could not parse file path from URL: ${attachmentInfo.url}`
			);
		}
	} catch (urlError) {
		console.error(
			`Invalid attachment URL format: ${attachmentInfo.url}`,
			urlError
		);
		// Decide if you should stop or continue to delete DB record
	}

	// 3. Delete the database record
	const { error: deleteError } = await supabase
		.from("task_attachments")
		.delete()
		.eq("id", attachmentId);

	if (deleteError) {
		console.error("Error deleting task attachment record:", deleteError);
		throw deleteError;
	}

	// 4. Log activity
	createActivityLog({
		action: "DELETED_ATTACHMENT",
		user_id: user.id,
		task_id: attachmentInfo.task_id, // Need task_id from fetched attachment
		details: { attachment_id: attachmentId, url: attachmentInfo.url },
	}).catch((logError) =>
		console.error("Failed to log attachment deletion:", logError)
	);
}
