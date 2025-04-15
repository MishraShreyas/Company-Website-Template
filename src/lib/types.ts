export type UserRole = "admin" | "employee" | "manager"; // Add more roles as needed

export interface UserProfile {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL?: string | null;
	role: UserRole;
	managerId?: string | null; // Reference to manager's UID
	createdAt: Date;
	// Add other profile fields as needed
}

export type TaskStatus = "todo" | "inprogress" | "done" | "blocked";

export interface Task {
	id: string;
	project: string; // Project ID or name
	title: string;
	description?: string;
	status: TaskStatus;
	assignedTo: string; // User UID
	createdBy: string; // User UID
	dueDate: Date;
	createdAt: Date;
	updatedAt: Date;
	priority?: "low" | "medium" | "high";
	tags: string[]; // Array of tags for categorization
}

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
	id: string;
	userId: string; // User UID
	userName?: string; // Denormalized for easy display in admin panel
	startDate: Date;
	endDate: Date;
	reason: string;
	status: LeaveStatus;
	requestedAt: Date;
	reviewedBy?: string | null; // Admin/Manager UID
	reviewedAt?: Date | null;
}

export interface Interview {
	id: string;
	candidateName: string;
	candidateEmail: string;
	interviewerId: string; // User UID
	interviewerName?: string; // Denormalized
	scheduledTime: Date;
	status: "scheduled" | "completed" | "cancelled";
	notes?: string;
	createdAt: Date;
	createdBy: string; // User UID
}

export interface ActivityLog {
	id: string;
	userId: string;
	userName?: string; // Denormalized
	action: "login" | "logout";
	timestamp: Date;
	ipAddress?: string; // Consider privacy implications
}

export interface Notification {
	id: string;
	userId: string; // Recipient User UID
	message: string;
	type:
		| "task_rollover"
		| "leave_request_status"
		| "new_task"
		| "interview_reminder"
		| "generic";
	relatedDocId?: string; // e.g., task ID, leave request ID
	isRead: boolean;
	createdAt: Date;
}

// Interface for Kanban Columns
export interface KanbanColumn {
	id: TaskStatus;
	title: string;
	taskIds: string[];
}

export interface KanbanData {
	tasks: Record<string, Task>;
	columns: Record<TaskStatus, KanbanColumn>;
	columnOrder: TaskStatus[];
}
