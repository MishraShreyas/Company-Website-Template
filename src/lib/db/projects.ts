import { getTeamMembers } from "@/lib/db/teams";
import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
type Team = Database["public"]["Tables"]["teams"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"]; // Assuming user type exists

export type ProjectWithDetails = {
	id: string;
	created_at: string | null;
	created_by: string | null;
	description: string | null;
	due_date: string | null;
	priority: number | null;
	status: string | null;
	title: string | null;
	team: Team | null;
	team_members: (User & { joined_at: string | null })[];
};

// CREATE Project
export async function createProject(
	projectData: ProjectInsert
): Promise<Project> {
	const supabase = createClient();
	const { user } = (await supabase.auth.getUser()).data;
	if (!user) throw new Error("User not authenticated.");
	projectData.created_by = user.id;
	projectData.created_at = new Date().toISOString(); // Ensure created_at is set

	const { data, error } = await supabase
		.from("projects")
		.insert(projectData)
		.select()
		.single();

	if (error) throw error;
	if (!data) throw new Error("Project creation failed.");
	return data;
}

// READ Project Names
export async function getProjectNames(): Promise<string[]> {
	const { data, error } = await createClient()
		.from("projects")
		.select("title")
		.order("title", { ascending: true });

	if (error) throw error;
	return data.map((p) => p.title) || [];
}

// READ Project by ID with Details
export async function getProjectByIdWithDetails(
	projectId: string
): Promise<ProjectWithDetails | null> {
	const { data, error } = await createClient()
		.from("project_with_team_view")
		.select(`*`)
		.eq("id", projectId)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	return data as ProjectWithDetails | null;
}

// READ Projects with filtering and optional details
export async function getAllProjects(): Promise<ProjectWithDetails[]> {
	const { data, error } = await createClient()
		.from("project_with_team_view")
		.select(`*`)
		.order("created_at", { ascending: false });

	if (error) throw error;

	if (!data) return [] as ProjectWithDetails[];

	// group up team members by project
	const projectsWithMembers = await Promise.all(
		data.map(async (project) => {
			const team = await getTeamMembers(project.team_id!);

			return {
				id: project.project_id,
				created_at: project.project_created_at,
				created_by: project.created_by,
				description: project.description,
				due_date: project.due_date,
				priority: project.priority,
				status: project.status,
				title: project.title,
				team: {
					id: project.team_id,
					name: project.team_name,
					created_at: project.team_created_at,
					description: project.team_description,
				} as Team,
				team_members: team,
			} as ProjectWithDetails;
		})
	);

	//
	return projectsWithMembers || [];
}

// UPDATE Project
export async function updateProject(
	projectId: string,
	projectData: ProjectUpdate
): Promise<Project> {
	const { data, error } = await createClient()
		.from("projects")
		.update(projectData)
		.eq("id", projectId)
		.select()
		.single();

	if (error) throw error;
	if (!data) throw new Error("Project update failed.");
	return data;
}

// DELETE Project
export async function deleteProject(projectId: string): Promise<void> {
	// Consider implications: What happens to tasks linked to this project?
	// Set up 'ON DELETE SET NULL' or 'CASCADE' in your DB schema, or handle manually.
	const { error } = await createClient()
		.from("projects")
		.delete()
		.eq("id", projectId);
	if (error) throw error;
}
