import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

// type Attendance = Database["public"]["Tables"]["meeting_attendance"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export type Attendance = {
	attending: User[];
	not_attending: User[];
	undecided: User[];
};

export async function isMeetingToday(): Promise<boolean | null> {
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
		if (error.code !== "PGRST116") return null; // Ignore not found error
		return null; // No meeting today
	}

	if (!data) return null;

	return data.attending;
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

export async function getAllMeetingUsers(): Promise<Attendance> {
	const today = new Date().toISOString().split("T")[0];
	const supabase = createClient();

	const { data, error } = await supabase.rpc("get_attendance_by_date", {
		target_date: today,
	});

	if (error) {
		console.error("Error fetching meeting attendance:", error);
		return {
			attending: [],
			not_attending: [],
			undecided: [],
		};
	}

	if (!data || data.length === 0)
		return {
			attending: [],
			not_attending: [],
			undecided: [],
		}; // No meeting attendance found

	return data[0] as Attendance; // Return the first row as attendance data
}
