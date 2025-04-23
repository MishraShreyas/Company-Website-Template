export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			activity_logs: {
				Row: {
					action: string | null;
					created_at: string;
					details: Json | null;
					id: string;
					task_id: string;
					user_id: string;
				};
				Insert: {
					action?: string | null;
					created_at?: string;
					details?: Json | null;
					id?: string;
					task_id: string;
					user_id?: string;
				};
				Update: {
					action?: string | null;
					created_at?: string;
					details?: Json | null;
					id?: string;
					task_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "activity_logs_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "activity_logs_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "activity_logs_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "activity_logs_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "activity_logs_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "activity_logs_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			bill_approval: {
				Row: {
					amount: number;
					approved_amount: number | null;
					approved_at: string | null;
					approved_by: string | null;
					description: string;
					id: string;
					receipt_url: string;
					reimbursed_at: string | null;
					status: Database["public"]["Enums"]["bill_status"];
					submitted_at: string;
					user_id: string;
				};
				Insert: {
					amount: number;
					approved_amount?: number | null;
					approved_at?: string | null;
					approved_by?: string | null;
					description: string;
					id?: string;
					receipt_url: string;
					reimbursed_at?: string | null;
					status?: Database["public"]["Enums"]["bill_status"];
					submitted_at?: string;
					user_id: string;
				};
				Update: {
					amount?: number;
					approved_amount?: number | null;
					approved_at?: string | null;
					approved_by?: string | null;
					description?: string;
					id?: string;
					receipt_url?: string;
					reimbursed_at?: string | null;
					status?: Database["public"]["Enums"]["bill_status"];
					submitted_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approved_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			budget_entries: {
				Row: {
					amount: number;
					category: string | null;
					created_at: string;
					created_by: string;
					date: string;
					description: string;
					entry_type: Database["public"]["Enums"]["budget_entry_type"];
					id: string;
					paid_by: string | null;
					receipt_url: string | null;
				};
				Insert: {
					amount: number;
					category?: string | null;
					created_at?: string;
					created_by?: string;
					date: string;
					description: string;
					entry_type: Database["public"]["Enums"]["budget_entry_type"];
					id?: string;
					paid_by?: string | null;
					receipt_url?: string | null;
				};
				Update: {
					amount?: number;
					category?: string | null;
					created_at?: string;
					created_by?: string;
					date?: string;
					description?: string;
					entry_type?: Database["public"]["Enums"]["budget_entry_type"];
					id?: string;
					paid_by?: string | null;
					receipt_url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "budget_entries_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "budget_entries_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "budget_entries_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "budget_entries_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "budget_entries_paid_by_fkey";
						columns: ["paid_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "budget_entries_paid_by_fkey";
						columns: ["paid_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "budget_entries_paid_by_fkey";
						columns: ["paid_by"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "budget_entries_paid_by_fkey";
						columns: ["paid_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			labels: {
				Row: {
					color: string;
					id: string;
					name: string;
					project_id: string;
				};
				Insert: {
					color?: string;
					id?: string;
					name: string;
					project_id: string;
				};
				Update: {
					color?: string;
					id?: string;
					name?: string;
					project_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "labels_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "labels_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects_with_team_view";
						referencedColumns: ["project_id"];
					}
				];
			};
			managers: {
				Row: {
					emp_id: string;
					manager_id: string;
				};
				Insert: {
					emp_id: string;
					manager_id: string;
				};
				Update: {
					emp_id?: string;
					manager_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "managers_emp_id_fkey";
						columns: ["emp_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "managers_emp_id_fkey";
						columns: ["emp_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "managers_emp_id_fkey";
						columns: ["emp_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "managers_emp_id_fkey";
						columns: ["emp_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "managers_manager_id_fkey";
						columns: ["manager_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "managers_manager_id_fkey";
						columns: ["manager_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "managers_manager_id_fkey";
						columns: ["manager_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "managers_manager_id_fkey";
						columns: ["manager_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			meeting_attendance: {
				Row: {
					attending: boolean;
					date: string;
					user_id: string;
				};
				Insert: {
					attending?: boolean;
					date: string;
					user_id?: string;
				};
				Update: {
					attending?: boolean;
					date?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "meeting_attendance_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "meeting_attendance_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "meeting_attendance_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "meeting_attendance_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			notifications: {
				Row: {
					created_at: string;
					id: string;
					payload: Json | null;
					read: boolean;
					type: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					id?: string;
					payload?: Json | null;
					read?: boolean;
					type?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					payload?: Json | null;
					read?: boolean;
					type?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			permissions: {
				Row: {
					description: string | null;
					id: string;
					name: string;
				};
				Insert: {
					description?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					description?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			projects: {
				Row: {
					created_at: string;
					created_by: string;
					description: string | null;
					due_date: string | null;
					id: string;
					priority: Database["public"]["Enums"]["task_priority"];
					status: Database["public"]["Enums"]["task_status"];
					team_id: string;
					title: string;
				};
				Insert: {
					created_at?: string;
					created_by?: string;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					priority?: Database["public"]["Enums"]["task_priority"];
					status?: Database["public"]["Enums"]["task_status"];
					team_id: string;
					title: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					priority?: Database["public"]["Enums"]["task_priority"];
					status?: Database["public"]["Enums"]["task_status"];
					team_id?: string;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "projects_team_id_fkey";
						columns: ["team_id"];
						isOneToOne: false;
						referencedRelation: "projects_with_team_view";
						referencedColumns: ["team_id"];
					},
					{
						foreignKeyName: "projects_team_id_fkey";
						columns: ["team_id"];
						isOneToOne: false;
						referencedRelation: "teams";
						referencedColumns: ["id"];
					}
				];
			};
			role_permissions: {
				Row: {
					permission_id: string;
					role_id: string;
				};
				Insert: {
					permission_id: string;
					role_id: string;
				};
				Update: {
					permission_id?: string;
					role_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "role_permissions_permission_id_fkey";
						columns: ["permission_id"];
						isOneToOne: false;
						referencedRelation: "permissions";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "role_permissions_permission_id_fkey";
						columns: ["permission_id"];
						isOneToOne: false;
						referencedRelation: "role_with_permissions_view";
						referencedColumns: ["permission_id"];
					},
					{
						foreignKeyName: "role_permissions_role_id_fkey";
						columns: ["role_id"];
						isOneToOne: false;
						referencedRelation: "role_with_permissions_view";
						referencedColumns: ["role_id"];
					},
					{
						foreignKeyName: "role_permissions_role_id_fkey";
						columns: ["role_id"];
						isOneToOne: false;
						referencedRelation: "roles";
						referencedColumns: ["id"];
					}
				];
			};
			roles: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			task_assignments: {
				Row: {
					task_id: string;
					user_id: string;
				};
				Insert: {
					task_id?: string;
					user_id?: string;
				};
				Update: {
					task_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "task_assignments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "task_assignments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "task_assignments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "task_assignments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "task_assignments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "task_assignments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			task_attachments: {
				Row: {
					created_at: string;
					id: string;
					task_id: string;
					uploaded_by: string;
					url: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					task_id: string;
					uploaded_by?: string;
					url: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					task_id?: string;
					uploaded_by?: string;
					url?: string;
				};
				Relationships: [
					{
						foreignKeyName: "task_attachments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "task_attachments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "task_attachments_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "task_attachments_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "task_attachments_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "task_attachments_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			task_comments: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					task_id: string;
					user_id: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					task_id: string;
					user_id?: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					task_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "task_comments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "task_comments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "task_comments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "task_comments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "task_comments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "task_comments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			task_labels: {
				Row: {
					label_id: string;
					task_id: string;
				};
				Insert: {
					label_id: string;
					task_id: string;
				};
				Update: {
					label_id?: string;
					task_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "task_labels_label_id_fkey";
						columns: ["label_id"];
						isOneToOne: false;
						referencedRelation: "labels";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "task_labels_label_id_fkey";
						columns: ["label_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["label_id"];
					},
					{
						foreignKeyName: "task_labels_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "task_labels_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					}
				];
			};
			tasks: {
				Row: {
					created_at: string;
					created_by: string;
					description: string | null;
					due_date: string | null;
					id: string;
					parent_task_id: string | null;
					percent: number | null;
					priority: Database["public"]["Enums"]["task_priority"];
					project_id: string;
					start_date: string | null;
					status: Database["public"]["Enums"]["task_status"];
					title: string;
				};
				Insert: {
					created_at?: string;
					created_by?: string;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					parent_task_id?: string | null;
					percent?: number | null;
					priority?: Database["public"]["Enums"]["task_priority"];
					project_id: string;
					start_date?: string | null;
					status?: Database["public"]["Enums"]["task_status"];
					title: string;
				};
				Update: {
					created_at?: string;
					created_by?: string;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					parent_task_id?: string | null;
					percent?: number | null;
					priority?: Database["public"]["Enums"]["task_priority"];
					project_id?: string;
					start_date?: string | null;
					status?: Database["public"]["Enums"]["task_status"];
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tasks_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "tasks_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "tasks_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "tasks_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tasks_parent_task_id_fkey";
						columns: ["parent_task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "tasks_parent_task_id_fkey";
						columns: ["parent_task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tasks_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tasks_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects_with_team_view";
						referencedColumns: ["project_id"];
					}
				];
			};
			team_members: {
				Row: {
					id: string;
					joined_at: string;
					team_id: string;
					user_id: string;
				};
				Insert: {
					id?: string;
					joined_at?: string;
					team_id: string;
					user_id: string;
				};
				Update: {
					id?: string;
					joined_at?: string;
					team_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "team_members_team_id_fkey";
						columns: ["team_id"];
						isOneToOne: false;
						referencedRelation: "projects_with_team_view";
						referencedColumns: ["team_id"];
					},
					{
						foreignKeyName: "team_members_team_id_fkey";
						columns: ["team_id"];
						isOneToOne: false;
						referencedRelation: "teams";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "team_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "team_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "team_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "team_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			teams: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			user_roles: {
				Row: {
					assigned_at: string;
					context_id: string | null;
					context_type: string;
					id: string;
					role_id: string;
					user_id: string;
				};
				Insert: {
					assigned_at?: string;
					context_id?: string | null;
					context_type?: string;
					id?: string;
					role_id: string;
					user_id: string;
				};
				Update: {
					assigned_at?: string;
					context_id?: string | null;
					context_type?: string;
					id?: string;
					role_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_roles_role_id_fkey";
						columns: ["role_id"];
						isOneToOne: false;
						referencedRelation: "role_with_permissions_view";
						referencedColumns: ["role_id"];
					},
					{
						foreignKeyName: "user_roles_role_id_fkey";
						columns: ["role_id"];
						isOneToOne: false;
						referencedRelation: "roles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "user_roles_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			users: {
				Row: {
					avatar_url: string | null;
					created_at: string;
					full_name: string;
					id: string;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string;
					full_name: string;
					id: string;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string;
					full_name?: string;
					id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			bill_approval_view: {
				Row: {
					amount: number | null;
					approved_amount: number | null;
					approved_at: string | null;
					approver_avatar: string | null;
					approver_id: string | null;
					approver_name: string | null;
					description: string | null;
					employee_avatar: string | null;
					employee_id: string | null;
					employee_name: string | null;
					id: string | null;
					receipt_url: string | null;
					reimbursed_at: string | null;
					status: Database["public"]["Enums"]["bill_status"] | null;
					submitted_at: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approver_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approver_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approver_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "bill_approval_approved_by_fkey";
						columns: ["approver_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["employee_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["employee_id"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["employee_id"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "bill_approval_user_id_fkey";
						columns: ["employee_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			budget_detailed_view: {
				Row: {
					amount: number | null;
					category: string | null;
					created_at: string | null;
					creator_avatar: string | null;
					creator_id: string | null;
					creator_name: string | null;
					date: string | null;
					description: string | null;
					entry_type:
						| Database["public"]["Enums"]["budget_entry_type"]
						| null;
					id: string | null;
					payer_avatar: string | null;
					payer_id: string | null;
					payer_name: string | null;
				};
				Relationships: [];
			};
			projects_with_team_view: {
				Row: {
					due_date: string | null;
					priority:
						| Database["public"]["Enums"]["task_priority"]
						| null;
					project_created_at: string | null;
					project_creator: string | null;
					project_descriptions: string | null;
					project_id: string | null;
					project_title: string | null;
					status: Database["public"]["Enums"]["task_status"] | null;
					team_created_at: string | null;
					team_description: string | null;
					team_id: string | null;
					team_name: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["project_creator"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["creator_id"];
					},
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["project_creator"];
						isOneToOne: false;
						referencedRelation: "budget_detailed_view";
						referencedColumns: ["payer_id"];
					},
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["project_creator"];
						isOneToOne: false;
						referencedRelation: "task_assignments_view";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "projects_created_by_fkey";
						columns: ["project_creator"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			role_with_permissions_view: {
				Row: {
					permission_description: string | null;
					permission_id: string | null;
					permission_name: string | null;
					role_created_at: string | null;
					role_description: string | null;
					role_id: string | null;
					role_name: string | null;
				};
				Relationships: [];
			};
			task_assignments_view: {
				Row: {
					assigned_user_avatar: string | null;
					assigned_user_name: string | null;
					task_id: string | null;
					user_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "task_assignments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_labels_view";
						referencedColumns: ["task_id"];
					},
					{
						foreignKeyName: "task_assignments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "tasks";
						referencedColumns: ["id"];
					}
				];
			};
			task_labels_view: {
				Row: {
					label_color: string | null;
					label_id: string | null;
					label_name: string | null;
					task_id: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			get_attendance_by_date: {
				Args: { target_date: string };
				Returns: {
					attending: Json;
					not_attending: Json;
					undecided: Json;
				}[];
			};
			is_admin: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
		};
		Enums: {
			bill_status: "uploaded" | "approved" | "reimbursed" | "rejected";
			budget_entry_type: "actual" | "planned";
			task_priority: "none" | "low" | "medium" | "high";
			task_status: "planning" | "not_started" | "in_progress" | "done";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
			DefaultSchema["Views"])
	? (DefaultSchema["Tables"] &
			DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
	? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
	? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
	? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;

export const Constants = {
	public: {
		Enums: {
			bill_status: ["uploaded", "approved", "reimbursed", "rejected"],
			budget_entry_type: ["actual", "planned"],
			task_priority: ["none", "low", "medium", "high"],
			task_status: ["planning", "not_started", "in_progress", "done"],
		},
	},
} as const;
