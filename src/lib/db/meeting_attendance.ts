import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

// type Attendance = Database["public"]["Tables"]["meeting_attendance"]["Row"];
// type User = Database["public"]["Tables"]["users"]["Row"];

export type Attendance =
	Database["public"]["Functions"]["get_attendance"]["Returns"][0];

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

export async function setAttendanceOnDate(userId: string, date: Date) {
	const supabase = createClient();

	// match date
	const { data, error } = await supabase
		.from("meeting_attendance")
		.upsert({ date: date.toISOString().split("T")[0], user_id: userId })
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

	const { data, error } = await supabase
		.rpc("get_attendance", {
			target_date: today,
		})
		.single(); // Get attendance for today

	if (error) {
		console.error("Error fetching meeting attendance:", error);
		return {
			meeting_date: today,
			attending: [],
			not_attending: [],
			undecided: [],
		};
	}

	if (!data)
		return {
			meeting_date: today,
			attending: [],
			not_attending: [],
			undecided: [],
		}; // No meeting attendance found

	return data as Attendance; // Return the first row as attendance data
}

export async function getAttendanceReport(date: Date): Promise<Attendance[]> {
	const supabase = createClient();

	// get all attendance for the user after the date
	const { data, error } = await supabase.rpc("get_attendance", {
		target_date: date.toISOString().split("T")[0],
	});

	if (error) {
		console.error("Error fetching meeting attendance:", error);
		return [];
	}

	return data; // Return the attendance report for the user
}
