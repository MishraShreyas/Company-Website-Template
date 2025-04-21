import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
type ActivityLogInsert =
	Database["public"]["Tables"]["activity_logs"]["Insert"];

// CREATE Activity Log (Internal helper or for manual logging)
export async function createActivityLog(
	logData: ActivityLogInsert
): Promise<ActivityLog> {
	// Ensure user_id and action are provided for meaningful logs
	if (!logData.user_id || !logData.action) {
		console.warn(
			"Attempted to create activity log without user_id or action."
		);
		// Decide if you want to throw an error or just skip logging
		// For now, let's skip if essential info is missing, but log a warning.
		// You might throw new Error("user_id and action are required for activity logs.");
		return logData as ActivityLog; // Return dummy data or handle differently
	}

	if (!logData.created_at) logData.created_at = new Date().toISOString(); // Ensure created_at is set

	const { data, error } = await createClient()
		.from("activity_logs")
		.insert(logData)
		.select()
		.single();

	if (error) {
		console.error("Error creating activity log:", error);
		// Don't throw here ideally, as logging failure shouldn't break the main operation
		// But log it prominently.
		return logData as ActivityLog; // Return dummy data or handle differently
	}
	// Optional: Check if data is null and handle
	return data ?? (logData as ActivityLog); // Return created data or input if insert failed silently
}

// READ Activity Logs (Useful for displaying an audit trail)
export async function getActivityLogs(options?: {
	taskId?: string;
	userId?: string;
	limit?: number;
	projectId?: string; // Maybe log project-level activity too?
}): Promise<ActivityLog[]> {
	let query = createClient()
		.from("activity_logs")
		.select("*, users(id, email)") // Fetch user info
		.order("created_at", { ascending: false }); // Show newest first

	if (options?.taskId) query = query.eq("task_id", options.taskId);
	if (options?.userId) query = query.eq("user_id", options.userId);
	// If you add project_id to activity_logs table:
	// if (options?.projectId) query = query.eq('project_id', options.projectId);
	if (options?.limit) query = query.limit(options.limit);

	const { data, error } = await query;

	if (error) {
		console.error("Error fetching activity logs:", error);
		throw error; // Okay to throw here as it's a direct read operation
	}
	return data || [];
}
