"use server";

import { Database } from "@/types/database.types";
import { createAdminClient } from "@/utils/supabase/server";

type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export async function createUser(
	name: string,
	email: string,
	password: string
) {
	const supabase = await createAdminClient();
	const { user } = (await supabase.auth.getUser()).data;
	if (!user) throw new Error("User not authenticated.");

	const { user: newUser } = (
		await supabase.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: { name },
		})
	).data;

	if (!newUser) throw new Error("Failed to create user.");

	const userData: UserInsert = {
		id: newUser.id,
		full_name: name,
		created_at: new Date().toISOString(),
	};

	const { data, error } = await supabase
		.from("users")
		.insert(userData)
		.select("*")
		.single();

	if (error) {
		console.error("Error creating user:", error);
		return null;
	}

	return JSON.parse(JSON.stringify(data));
}

export async function deleteUser(userId: string): Promise<boolean> {
	const supabase = await createAdminClient();

	const { error } = await supabase.from("users").delete().eq("id", userId);
	if (error) {
		console.error("Error deleting user from users table:", error);
		return false;
	}

	const { error: delErr } = await supabase.auth.admin.deleteUser(userId);
	if (delErr) {
		console.error("Error deleting user:", error);
		return false;
	}

	return true;
}
