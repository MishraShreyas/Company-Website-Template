import { getUserById } from "@/lib/db/users";
import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Attendance = Database["public"]["Tables"]["meeting_attendance"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export async function isMeetingToday() {
	const today = new Date().toISOString().split("T")[0];
	const supabase = createClient();
	const { user } = (await supabase.auth.getUser()).data;
	if (!user) return false; // User not logged in

	// match date
	const { data, error } = await supabase
		.from("meeting_attendance")
		.select("*")
		.eq("date", today)
		.eq("user_id", user.id) // Match user ID
		.single();

	if (error) {
		if (error.code !== "PGRST116") throw error; // Ignore not found error
		return false; // No meeting today
	}

	return data !== null && data.attending === true; // Meeting exists today
}

export async function updateMeetingToday(meeting: boolean) {
	const today = new Date().toISOString().split("T")[0];
	const supabase = createClient();

	// match date
	const { data, error } = await supabase
		.from("meeting_attendance")
		.upsert({ date: today, attending: meeting })
		.select("*")
		.single();

	if (error) {
		console.error("Error setting meeting:", error);
		return null;
	}

	return data; // Meeting updated or created successfully
}

export async function getAllUsersMeetingToday(): Promise<User[]> {
	const today = new Date().toISOString().split("T")[0];
	const supabase = createClient();

	// match date and attending
	const { data, error } = await supabase
		.from("meeting_attendance")
		.select("*")
		.eq("date", today)
		.eq("attending", true);

	if (error) {
		console.error("Error fetching meeting attendance:", error);
		return [];
	}

	if (!data || data.length === 0) return []; // No meeting attendance found

	const users = await Promise.all(
		data.map(
			async (attendance: Attendance) =>
				await getUserById(attendance.user_id)
		)
	);

	return users.filter((user) => user !== null) as User[]; // Filter out null users
}
