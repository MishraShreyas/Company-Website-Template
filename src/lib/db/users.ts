import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
type Role = Database["public"]["Tables"]["roles"]["Row"];

export type UserWithRole = User & {
	roles:
		| (Role & {
				context_id: string | null;
				context_type: string | null;
		  })
		| null;
};

export async function getUserById(userId: string): Promise<User | null> {
	const { data, error } = await createClient()
		.from("users")
		.select("*")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching user:", error);
		return null;
	}

	return data;
}

export async function updateUser(userData: UserUpdate): Promise<User | null> {
	const supabase = createClient();
	const { user } = (await supabase.auth.getUser()).data;
	if (!user) throw new Error("User not authenticated.");

	if (!userData?.id) userData.id = user.id;

	const { data, error } = await supabase
		.from("users")
		.update(userData)
		.select("*")
		.single();

	if (error) {
		console.error("Error updating user:", error);
		return null;
	}

	return data;
}

// get users
export async function getAllUsers(): Promise<User[]> {
	const { data, error } = await createClient()
		.from("users")
		.select("*")
		.order("full_name", { ascending: true });

	if (error) {
		console.error("Error fetching users:", error);
		return [];
	}

	return data || [];
}

// READ User with Role
export async function getAllUsersWithRole(): Promise<UserWithRole[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("users")
		.select(`*`)
		.order("full_name", { ascending: true });

	if (error) {
		console.error("Error fetching users:", error);
		return [];
	}

	const { data: roles, error: rolesError } = await supabase
		.from("roles")
		.select(`*`)
		.order("name", { ascending: true });

	if (rolesError) {
		console.error("Error fetching roles:", rolesError);
		return [];
	}

	const users = await Promise.all(
		data.map(async (user) => {
			const { data: userRoles, error: userRolesError } = await supabase
				.from("user_roles")
				.select(`*`)
				.eq("user_id", user.id);

			if (userRolesError) {
				console.error("Error fetching user roles:", userRolesError);
				return [];
			}

			const rolesWithContext = userRoles.map((userRole) => {
				const role = roles.find((role) => role.id === userRole.role_id);
				return {
					...role,
					context_id: userRole.context_id,
					context_type: userRole.context_type,
				};
			});

			return {
				...user,
				roles: rolesWithContext,
			};
		})
	);

	return (users as unknown as UserWithRole[]) || [];
}
