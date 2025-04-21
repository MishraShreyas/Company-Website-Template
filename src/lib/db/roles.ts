import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Role = Database["public"]["Tables"]["roles"]["Row"];
type Permission = Database["public"]["Tables"]["permissions"]["Row"];
export type RoleWithPermissions = Role & { permissions: Permission[] };

export async function getAllRoles(): Promise<RoleWithPermissions[]> {
	const { data, error } = await createClient()
		.from("role_with_permissions_view")
		.select(`*`)
		.order("role_name", { ascending: true });

	if (error) {
		console.error("Error fetching roles:", error);
		return [];
	}

	// Transform the data to include permissions directly in the role object
	const grouped: Record<string, RoleWithPermissions> = {};
	data.forEach((row) => {
		const roleId = row.role_id;
		if (!roleId) return; // Skip if role_id is null

		if (!grouped[roleId]) {
			grouped[roleId] = {
				id: roleId,
				name: row.role_name || "",
				description: row.role_description,
				permissions: [],
				created_at: row.role_created_at || new Date().toISOString(),
			};
		}

		if (row.permission_id) {
			grouped[roleId].permissions.push({
				id: row.permission_id,
				name: row.permission_name || "",
				description: row.permission_description,
			});
		}
	});

	return Object.values(grouped) || [];
}

export async function getRoleById(
	roleId: string
): Promise<RoleWithPermissions | null> {
	const { data, error } = await createClient()
		.from("role_with_permissions_view")
		.select(`*`)
		.eq("id", roleId);

	if (error) {
		console.error("Error fetching role:", error);
		return null;
	}

	if (!data || data.length === 0) return null; // No role found

	// Transform the data to include permissions directly in the role object
	return {
		id: data[0].role_id || "",
		name: data[0].role_name || "",
		description: data[0].role_description,
		permissions: data.map((row) => ({
			id: row.permission_id || "",
			name: row.permission_name || "",
			description: row.permission_description,
		})),
		created_at: data[0].role_created_at || new Date().toISOString(),
	};
}

/**
 * This function creates a new role in the database and assigns permissions to it.
 * @param role - The role data to insert.
 * @param permissions - The ID of permissions to assign to the role.
 * @returns - A promise that resolves to the ID of the created role.
 * @throws - Throws an error if the role creation fails.
 */
export async function createRole(
	name: string,
	description: string,
	permissions: string[]
): Promise<string> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("roles")
		.insert({
			name,
			description,
		})
		.select(`*`)
		.single();

	if (error) {
		console.error("Error creating role:", error);
		throw error;
	}

	const roleId = data.id;
	const rolePermissions = permissions.map((permission_id) => ({
		role_id: roleId,
		permission_id,
	}));

	const { error: insertError } = await supabase
		.from("role_permissions")
		.insert(rolePermissions);

	if (insertError) {
		console.error("Error inserting role permissions:", insertError);
		throw insertError;
	}

	return data.id;
}

/**
 * Update a role and its permissions in the database.
 * @param roleId - The ID of the role to update.
 * @param role - The role data to update.
 * @param permissions - The ID of permissions to assign to the role.
 * @returns - A promise that resolves to true if the update was successful.
 * @throws - Throws an error if the update fails.
 *
 */
export async function updateRole(
	roleId: string,
	role: Partial<Role>,
	permissions: string[]
): Promise<true> {
	const supabase = createClient();

	const { error: updateError } = await supabase
		.from("roles")
		.update(role)
		.eq("id", roleId);

	if (updateError) {
		console.error("Error updating role:", updateError);
		throw updateError;
	}

	// Remove old permissions
	const { error: deleteError } = await supabase
		.from("role_permissions")
		.delete()
		.eq("role_id", roleId);

	if (deleteError) {
		console.error("Error deleting role permissions:", deleteError);
		throw deleteError;
	}

	const rolePermissions = permissions.map((permission_id) => ({
		role_id: roleId,
		permission_id,
	}));

	const { error: insertError } = await supabase
		.from("role_permissions")
		.insert(rolePermissions)
		.select(`*, permissions(*)`);

	if (insertError) {
		console.error("Error inserting role permissions:", insertError);
		throw insertError;
	}

	return true;
}

export async function deleteRole(roleId: string): Promise<void> {
	const { error } = await createClient()
		.from("roles")
		.delete()
		.eq("id", roleId);

	if (error) {
		console.error("Error deleting role:", error);
		throw error;
	}
}
