import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type TeamInsert = Database["public"]["Tables"]["teams"]["Insert"];
type TeamUpdate = Database["public"]["Tables"]["teams"]["Update"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"]; // Assuming user type exists

// Type for Team with Members
export type TeamWithMembers = Team & {
	team_members: (TeamMember & { users: User | null })[];
};

// CREATE Team
export async function createTeam(teamData: TeamInsert): Promise<Team> {
	const { data, error } = await createClient()
		.from("teams")
		.insert(teamData)
		.select()
		.single();

	if (error) throw error;
	if (!data) throw new Error("Team creation failed.");
	return data;
}

// READ Team by ID with Members
export async function getTeamByIdWithMembers(
	teamId: string
): Promise<TeamWithMembers | null> {
	const { data, error } = await createClient()
		.from("teams")
		.select(
			`
            *,
            team_members (
                *,
                users (id)
            )
        `
		)
		.eq("id", teamId)
		.single();

	if (error && error.code !== "PGRST116") throw error;
	return data as TeamWithMembers | null;
}

// READ All Teams
export async function getAllTeams(): Promise<TeamWithMembers[]> {
	const query = createClient()
		.from("teams")
		.select(`*, team_members(*, users(id))`)
		.order("name");

	const { data, error } = await query;

	if (error) throw error;
	return (data || []) as TeamWithMembers[];
}

// UPDATE Team
export async function updateTeam(
	teamId: string,
	teamData: TeamUpdate
): Promise<Team> {
	const { data, error } = await createClient()
		.from("teams")
		.update(teamData)
		.eq("id", teamId)
		.select()
		.single();

	if (error) throw error;
	if (!data) throw new Error("Team update failed.");
	return data;
}

// DELETE Team
export async function deleteTeam(teamId: string): Promise<void> {
	// Consider implications: What happens to projects/members linked to this team?
	// Set up 'ON DELETE SET NULL' or 'CASCADE' in your DB schema, or handle manually here.
	const { error } = await createClient()
		.from("teams")
		.delete()
		.eq("id", teamId);
	if (error) throw error;
}

// --- Team Member Management ---

/** Add a user to a team */
export async function addTeamMember(
	teamId: string,
	userId: string
): Promise<TeamMember> {
	const { data, error } = await createClient()
		.from("team_members")
		.insert({ team_id: teamId, user_id: userId })
		.select()
		.single();

	if (error) {
		if (error.code === "23505") {
			// Already a member
			console.warn(
				`User ${userId} is already a member of team ${teamId}`
			);
			// Fetch existing membership record? Or just return gracefully?
			const { data: existing } = await createClient()
				.from("team_members")
				.select()
				.match({ team_id: teamId, user_id: userId })
				.maybeSingle();
			if (existing) return existing;
			// Fallback if fetch fails but insert failed due to duplicate
			return {
				id: "unknown",
				team_id: teamId,
				user_id: userId,
				joined_at: new Date().toISOString(),
			};
		}
		console.error("Error adding team member:", error);
		throw error;
	}
	if (!data) throw new Error("Adding team member returned no data.");
	return data;
}

/** Remove a user from a team */
export async function removeTeamMember(
	teamId: string,
	userId: string
): Promise<void> {
	const { error } = await createClient()
		.from("team_members")
		.delete()
		.match({ team_id: teamId, user_id: userId });

	if (error) {
		console.error("Error removing team member:", error);
		throw error;
	}
}

/** Get members for a specific team */
export async function getTeamMembers(
	teamId: string
): Promise<(User & { joined_at: string })[]> {
	const { data, error } = await createClient()
		.from("team_members")
		.select("*, users(*)")
		.eq("team_id", teamId);

	if (error) throw error;

	const members =
		data?.map((member) => ({
			id: member.user_id!,
			full_name: member.users?.full_name || "",
			avatar_url: member.users?.avatar_url || "",
			created_at: member.users?.created_at || "",
			position: member.users?.position || "",
			joined_at: member.joined_at || "",
		})) || [];

	return members || [];
}

/** Get teams a specific user belongs to */
export async function getUserTeams(
	userId: string
): Promise<(TeamMember & { teams: Team | null })[]> {
	const { data, error } = await createClient()
		.from("team_members")
		.select("*, teams(*)")
		.eq("user_id", userId);

	if (error) throw error;
	return data || [];
}
