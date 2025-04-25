import { ProjectWithDetails } from "@/lib/db/projects";
import { createClient } from "@/utils/supabase/server";

// READ Project by ID with Details
export async function getProjectByIdWithDetailsServer(projectId: string): Promise<ProjectWithDetails | null> {
	const supabase = await createClient();
	const { data, error } = await supabase.from("projects_with_team_view").select(`*`).eq("project_id", projectId).single();

	if (error && error.code !== "PGRST116") throw error;

	if (!data) return null;

	// group up team members by project
	const { data: teamData, error: teamErr } = await supabase.from("team_members").select("*, users(*)").eq("team_id", data.team_id);

	if (teamErr) throw error;

	const members =
		teamData?.map((member) => ({
			id: member.user_id!,
			full_name: member.users?.full_name || "",
			avatar_url: member.users?.avatar_url || "",
			created_at: member.users?.created_at || "",
			position: member.users?.position || "",
			joined_at: member.joined_at || "",
		})) || [];

	return {
		...data,
		team_members: members,
	};
}
