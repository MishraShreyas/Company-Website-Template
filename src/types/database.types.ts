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
					created_at: string | null;
					details: Json | null;
					id: string;
					task_id: string | null;
					user_id: string | null;
				};
				Insert: {
					action?: string | null;
					created_at?: string | null;
					details?: Json | null;
					id?: string;
					task_id?: string | null;
					user_id?: string | null;
				};
				Update: {
					action?: string | null;
					created_at?: string | null;
					details?: Json | null;
					id?: string;
					task_id?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "activity_logs_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_summary_view";
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
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			approvals: {
				Row: {
					approval_id: string;
					approved: boolean | null;
					approved_at: string | null;
					bill_id: number | null;
					comment: string | null;
					manager_id: string | null;
				};
				Insert: {
					approval_id: string;
					approved?: boolean | null;
					approved_at?: string | null;
					bill_id?: number | null;
					comment?: string | null;
					manager_id?: string | null;
				};
				Update: {
					approval_id?: string;
					approved?: boolean | null;
					approved_at?: string | null;
					bill_id?: number | null;
					comment?: string | null;
					manager_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "approvals_bill_id_fkey";
						columns: ["bill_id"];
						isOneToOne: false;
						referencedRelation: "bills";
						referencedColumns: ["bill_id"];
					},
					{
						foreignKeyName: "approvals_manager_id_fkey";
						columns: ["manager_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			bills: {
				Row: {
					amount: number;
					bill_id: number;
					bill_type: string;
					created_at: string | null;
					description: string | null;
					due_date: string | null;
					file_url: string | null;
					status: string | null;
					title: string;
					uploaded_by: string | null;
				};
				Insert: {
					amount: number;
					bill_id?: number;
					bill_type: string;
					created_at?: string | null;
					description?: string | null;
					due_date?: string | null;
					file_url?: string | null;
					status?: string | null;
					title: string;
					uploaded_by?: string | null;
				};
				Update: {
					amount?: number;
					bill_id?: number;
					bill_type?: string;
					created_at?: string | null;
					description?: string | null;
					due_date?: string | null;
					file_url?: string | null;
					status?: string | null;
					title?: string;
					uploaded_by?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "bills_uploaded_by_fkey";
						columns: ["uploaded_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			budget_planner: {
				Row: {
					actual_spent: number | null;
					allocated_amount: number;
					attachment_url: string | null;
					budget_id: number;
					category: string;
					created_at: string | null;
					created_by: string | null;
					is_recurring: boolean | null;
					month: string | null;
					notes: string | null;
				};
				Insert: {
					actual_spent?: number | null;
					allocated_amount: number;
					attachment_url?: string | null;
					budget_id?: number;
					category: string;
					created_at?: string | null;
					created_by?: string | null;
					is_recurring?: boolean | null;
					month?: string | null;
					notes?: string | null;
				};
				Update: {
					actual_spent?: number | null;
					allocated_amount?: number;
					attachment_url?: string | null;
					budget_id?: number;
					category?: string;
					created_at?: string | null;
					created_by?: string | null;
					is_recurring?: boolean | null;
					month?: string | null;
					notes?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "budget_planner_created_by_fkey";
						columns: ["created_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			labels: {
				Row: {
					color: string | null;
					id: string;
					name: string;
					project_id: string | null;
				};
				Insert: {
					color?: string | null;
					id?: string;
					name: string;
					project_id?: string | null;
				};
				Update: {
					color?: string | null;
					id?: string;
					name?: string;
					project_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "labels_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "project_with_team_view";
						referencedColumns: ["project_id"];
					},
					{
						foreignKeyName: "labels_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					}
				];
			};
			meeting_attendance: {
				Row: {
					attending: boolean | null;
					date: string | null;
					user_id: string;
				};
				Insert: {
					attending?: boolean | null;
					date?: string | null;
					user_id?: string;
				};
				Update: {
					attending?: boolean | null;
					date?: string | null;
					user_id?: string;
				};
				Relationships: [
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
					created_at: string | null;
					id: string;
					payload: Json | null;
					read: boolean | null;
					type: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					payload?: Json | null;
					read?: boolean | null;
					type?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					payload?: Json | null;
					read?: boolean | null;
					type?: string | null;
					user_id?: string | null;
				};
				Relationships: [
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
					created_at: string | null;
					created_by: string | null;
					description: string | null;
					due_date: string | null;
					id: string;
					priority: number | null;
					status: string | null;
					team_id: string | null;
					title: string;
				};
				Insert: {
					created_at?: string | null;
					created_by?: string | null;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					priority?: number | null;
					status?: string | null;
					team_id?: string | null;
					title: string;
				};
				Update: {
					created_at?: string | null;
					created_by?: string | null;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					priority?: number | null;
					status?: string | null;
					team_id?: string | null;
					title?: string;
				};
				Relationships: [
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
					created_at: string | null;
					description: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			task_attachments: {
				Row: {
					created_at: string | null;
					id: string;
					task_id: string | null;
					uploaded_by: string | null;
					url: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					task_id?: string | null;
					uploaded_by?: string | null;
					url: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					task_id?: string | null;
					uploaded_by?: string | null;
					url?: string;
				};
				Relationships: [
					{
						foreignKeyName: "task_attachments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_summary_view";
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
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			task_comments: {
				Row: {
					content: string | null;
					created_at: string | null;
					id: string;
					task_id: string | null;
					user_id: string | null;
				};
				Insert: {
					content?: string | null;
					created_at?: string | null;
					id?: string;
					task_id?: string | null;
					user_id?: string | null;
				};
				Update: {
					content?: string | null;
					created_at?: string | null;
					id?: string;
					task_id?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "task_comments_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_summary_view";
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
						referencedRelation: "task_summary_view";
						referencedColumns: ["label_id"];
					},
					{
						foreignKeyName: "task_labels_task_id_fkey";
						columns: ["task_id"];
						isOneToOne: false;
						referencedRelation: "task_summary_view";
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
					assigned_to: string | null;
					created_at: string | null;
					created_by: string | null;
					description: string | null;
					due_date: string | null;
					id: string;
					parent_task_id: string | null;
					percent: number | null;
					priority: number | null;
					project_id: string | null;
					start_date: string | null;
					status: string | null;
					title: string;
				};
				Insert: {
					assigned_to?: string | null;
					created_at?: string | null;
					created_by?: string | null;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					parent_task_id?: string | null;
					percent?: number | null;
					priority?: number | null;
					project_id?: string | null;
					start_date?: string | null;
					status?: string | null;
					title: string;
				};
				Update: {
					assigned_to?: string | null;
					created_at?: string | null;
					created_by?: string | null;
					description?: string | null;
					due_date?: string | null;
					id?: string;
					parent_task_id?: string | null;
					percent?: number | null;
					priority?: number | null;
					project_id?: string | null;
					start_date?: string | null;
					status?: string | null;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tasks_assigned_to_fkey";
						columns: ["assigned_to"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
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
						referencedRelation: "task_summary_view";
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
						referencedRelation: "project_with_team_view";
						referencedColumns: ["project_id"];
					},
					{
						foreignKeyName: "tasks_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					}
				];
			};
			team_members: {
				Row: {
					id: string;
					joined_at: string | null;
					team_id: string | null;
					user_id: string | null;
				};
				Insert: {
					id?: string;
					joined_at?: string | null;
					team_id?: string | null;
					user_id?: string | null;
				};
				Update: {
					id?: string;
					joined_at?: string | null;
					team_id?: string | null;
					user_id?: string | null;
				};
				Relationships: [
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
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			teams: {
				Row: {
					created_at: string | null;
					description: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			user_roles: {
				Row: {
					assigned_at: string | null;
					context_id: string | null;
					context_type: string | null;
					id: string;
					role_id: string | null;
					user_id: string | null;
				};
				Insert: {
					assigned_at?: string | null;
					context_id?: string | null;
					context_type?: string | null;
					id?: string;
					role_id?: string | null;
					user_id?: string | null;
				};
				Update: {
					assigned_at?: string | null;
					context_id?: string | null;
					context_type?: string | null;
					id?: string;
					role_id?: string | null;
					user_id?: string | null;
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
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			users: {
				Row: {
					avatar_url: string | null;
					created_at: string | null;
					full_name: string | null;
					id: string;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string | null;
					full_name?: string | null;
					id: string;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string | null;
					full_name?: string | null;
					id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			project_with_team_view: {
				Row: {
					created_by: string | null;
					description: string | null;
					due_date: string | null;
					priority: number | null;
					project_created_at: string | null;
					project_id: string | null;
					status: string | null;
					team_created_at: string | null;
					team_description: string | null;
					team_id: string | null;
					team_name: string | null;
					title: string | null;
				};
				Relationships: [
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
						referencedRelation: "teams";
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
			task_summary_view: {
				Row: {
					assigned_to: string | null;
					assigned_user_avatar: string | null;
					assigned_user_name: string | null;
					description: string | null;
					due_date: string | null;
					label_color: string | null;
					label_id: string | null;
					label_name: string | null;
					parent_task_id: string | null;
					percent: number | null;
					priority: number | null;
					project_id: string | null;
					start_date: string | null;
					status: string | null;
					task_id: string | null;
					title: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "tasks_assigned_to_fkey";
						columns: ["assigned_to"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tasks_parent_task_id_fkey";
						columns: ["parent_task_id"];
						isOneToOne: false;
						referencedRelation: "task_summary_view";
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
						referencedRelation: "project_with_team_view";
						referencedColumns: ["project_id"];
					},
					{
						foreignKeyName: "tasks_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Functions: {
			is_admin: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
		};
		Enums: {
			[_ in never]: never;
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
		Enums: {},
	},
} as const;
