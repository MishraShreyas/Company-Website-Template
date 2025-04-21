import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Permission = Database["public"]["Tables"]["permissions"]["Row"];

export async function getPermissions(): Promise<Permission[]> {
	const { data, error } = await createClient()
		.from("permissions")
		.select("*")
		.order("name", { ascending: true });

	if (error) {
		console.error("Error fetching permissions:", error);
		return [];
	}

	return data || [];
}

export function permissionGrouper(s: string): string {
	return s.split(".")[0];
}
