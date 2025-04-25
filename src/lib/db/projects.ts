import { getTeamMembers } from "@/lib/db/teams";
import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
// type Team = Database["public"]["Tables"]["teams"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"]; // Assuming user type exists

type ProjectWithTeamView = Database["public"]["Views"]["projects_with_team_view"]["Row"];

export type ProjectWithDetails = ProjectWithTeamView & {
	team_members: (User & { joined_at: string | null })[];
};

// CREATE Project
export async function createProject(projectData: ProjectInsert): Promise<Project> {
	const supabase = createClient();
	const { user } = (await supabase.auth.getUser()).data;
	if (!user) throw new Error("User not authenticated.");
	projectData.created_by = user.id;
	projectData.created_at = new Date().toISOString(); // Ensure created_at is set

	const { data, error } = await supabase.from("projects").insert(projectData).select().single();

	if (error) throw error;
	if (!data) throw new Error("Project creation failed.");
	return data;
}

// READ Project Names
export async function getProjectNames(): Promise<string[]> {
	const { data, error } = await createClient().from("projects").select("title").order("title", { ascending: true });

	if (error) throw error;
	return data.map((p) => p.title) || [];
}

// READ Project by ID with Details
export async function getProjectByIdWithDetails(projectId: string): Promise<ProjectWithDetails | null> {
	const { data, error } = await createClient().from("projects_with_team_view").select(`*`).eq("project_id", projectId).single();

	if (error && error.code !== "PGRST116") throw error;

	if (!data) return null;

	// group up team members by project
	const team = await getTeamMembers(data.team_id);

	return {
		...data,
		team_members: team,
	};
}

// READ Projects with filtering and optional details
export async function getAllProjects(): Promise<ProjectWithDetails[]> {
	const { data, error } = await createClient().from("projects_with_team_view").select(`*`).order("project_created_at", { ascending: false });

	if (error) throw error;

	if (!data) return [] as ProjectWithDetails[];

	// group up team members by project
	const projectsWithMembers = await Promise.all(
		data.map(async (project) => {
			const team = await getTeamMembers(project.team_id);

			return {
				...project,
				team_members: team,
			};
		})
	);

	return projectsWithMembers;
}

// UPDATE Project
export async function updateProject(projectId: string, projectData: ProjectUpdate): Promise<Project> {
	const { data, error } = await createClient().from("projects").update(projectData).eq("id", projectId).select().single();

	if (error) throw error;
	if (!data) throw new Error("Project update failed.");
	return data;
}

// DELETE Project
export async function deleteProject(projectId: string): Promise<void> {
	// Consider implications: What happens to tasks linked to this project?
	// Set up 'ON DELETE SET NULL' or 'CASCADE' in your DB schema, or handle manually.
	const { error } = await createClient().from("projects").delete().eq("id", projectId);
	if (error) throw error;
}
