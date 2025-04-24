"use client";
import { UserAttendance } from "@/components/admin/attendance/UserAttendance";
import { Attendance, getAttendanceReport } from "@/lib/db";
import { Database } from "@/types/database.types";
import { Chip, DatePicker, Skeleton } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type AttendanceStats = {
	attended: number;
	missed: number;
	undecided: number;
	user: Database["public"]["Tables"]["users"]["Row"] | null;
	attendanceRate: number;
	streak: number;
	currentStreak: number;
};

export type AttendanceHistory = {
	date: string;
	status: string;
}[];

export function AttendanceReport() {
	const [isLoading, setIsLoading] = useState(true);

	const today = parseDate(new Date().toISOString().split("T")[0]);

	const [startDate, setStartDate] = useState<DateValue | null>(today);
	const [selectedDate, setSelectedDate] = useState<DateValue | null>(today);
	const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
	const [selectedMeeting, setSelectedMeeting] = useState<Attendance | null>(
		null
	);
	const [userStats, setUserStats] = useState<Record<string, AttendanceStats>>(
		{}
	);

	useEffect(() => {
		loadData(today);
	}, []);

	const loadData = async (startDate: DateValue | null) => {
		setIsLoading(true);
		try {
			const data = await getAttendanceReport(
				startDate?.toDate("Asia/Kolkata") || new Date()
			);
			setAttendanceData(data);

			// Set today's meeting as selected by default
			const today = new Date().toISOString().split("T")[0];
			const todaysMeeting = data.find((m) => m.meeting_date === today);
			setSelectedMeeting(todaysMeeting || data[data.length - 1]);
			// Calculate stats for each user

			const stats: Record<string, AttendanceStats> = {};

			// First, identify all unique users
			const allUsers = new Set<string>();
			data.forEach((meeting) => {
				meeting.attending.forEach((user) => allUsers.add(user.id));
				meeting.not_attending.forEach((user) => allUsers.add(user.id));
				meeting.undecided.forEach((user) => allUsers.add(user.id));
			});

			// Initialize stats for each user
			allUsers.forEach((userId) => {
				stats[userId] = {
					attended: 0,
					missed: 0,
					undecided: 0,
					user: null, // Will be filled in later
					attendanceRate: 0,
					streak: 0,
					currentStreak: 0,
				};
			});

			// Calculate stats
			data.forEach((meeting) => {
				meeting.attending.forEach((user) => {
					stats[user.id].attended++;
					stats[user.id].user = user;
					stats[user.id].currentStreak++;
					stats[user.id].streak = Math.max(
						stats[user.id].streak,
						stats[user.id].currentStreak
					);
				});

				meeting.not_attending.forEach((user) => {
					stats[user.id].missed++;
					stats[user.id].user = user;
					stats[user.id].currentStreak = 0;
				});

				meeting.undecided.forEach((user) => {
					stats[user.id].undecided++;
					stats[user.id].user = user;
					stats[user.id].currentStreak = 0;
				});
			});

			// Calculate attendance rates
			Object.keys(stats).forEach((userId) => {
				const total =
					stats[userId].attended +
					stats[userId].missed +
					stats[userId].undecided;
				stats[userId].attendanceRate =
					total > 0
						? Math.round((stats[userId].attended / total) * 100)
						: 0;
			});

			setUserStats(stats);
		} catch (error) {
			console.error("Failed to fetch attendance data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDateChange = (value: DateValue | null) => {
		setSelectedDate(value);
		if (!value) return;

		// Find the meeting for the selected date
		const meeting = attendanceData.find(
			(m) => m.meeting_date === value.toString().split("T")[0]
		);
		setSelectedMeeting(meeting || null);
	};

	const handleStartDateChange = async (value: DateValue | null) => {
		setStartDate(value);
		await loadData(value);
		setSelectedDate(today);
	};

	const getUserAttendanceHistory = (userId: string) => {
		if (!attendanceData.length) return [];

		return attendanceData.map((meeting) => {
			let status = "undecided";
			if (meeting.attending.some((u) => u.id === userId)) {
				status = "attending";
			} else if (meeting.not_attending.some((u) => u.id === userId)) {
				status = "not_attending";
			}

			return {
				date: meeting.meeting_date,
				status,
			};
		});
	};

	return (
		<div className="max-w-5xl">
			<motion.h1
				className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				Team Attendance Report
			</motion.h1>

			<motion.div
				className="mb-4 flex gap-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<DatePicker
					label="Select start date"
					value={startDate}
					onChange={handleStartDateChange}
					isDisabled={isLoading}
					className="w-full"
					maxValue={today}
				/>
				<DatePicker
					label="Select view date"
					value={selectedDate}
					onChange={handleDateChange}
					isDisabled={isLoading}
					className="w-full"
					maxValue={today}
					minValue={startDate}
				/>
			</motion.div>

			<motion.div
				className="mb-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* Today's meeting */}
				<div className="bg-content2 p-4 rounded-lg shadow">
					<motion.h2
						className="text-xl font-semibold mb-4"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						{selectedMeeting
							? `Attendance for ${new Date(
									selectedMeeting.meeting_date
							  ).toLocaleDateString(undefined, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
							  })}`
							: "No meeting data available for this date"}
					</motion.h2>
					<div className="flex flex-wrap gap-4">
						<Skeleton isLoaded={!isLoading}>
							<Chip size="lg" color="success" variant="flat">
								Attending: {selectedMeeting?.attending.length}
							</Chip>
						</Skeleton>
						<Skeleton isLoaded={!isLoading}>
							<Chip size="lg" color="danger" variant="flat">
								Not Attending:{" "}
								{selectedMeeting?.not_attending.length}
							</Chip>
						</Skeleton>
						<Skeleton isLoaded={!isLoading}>
							<Chip size="lg" color="warning" variant="flat">
								Undecided: {selectedMeeting?.undecided.length}
							</Chip>
						</Skeleton>
					</div>
				</div>
			</motion.div>

			<div className="bg-content2 p-4 rounded-lg shadow">
				<motion.h2
					className="text-xl font-semibold mb-4"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					Team members: {Object.keys(userStats).length}
				</motion.h2>

				{/* Members */}
				<div className="space-y-6">
					{Object.values(userStats).map((stats) => (
						<UserAttendance
							key={stats.user?.id}
							stats={stats}
							history={getUserAttendanceHistory(
								stats.user?.id || ""
							)}
							isLoading={isLoading}
							selectedDate={selectedDate}
							selectedMeeting={selectedMeeting}
							handleDateChange={handleDateChange}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
