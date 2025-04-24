import {
	AttendanceHistory,
	AttendanceStats,
} from "@/components/admin/attendance/AttendanceReport";
import { UserAttendanceCalendar } from "@/components/admin/attendance/UserAttendanceCalendar";
import { Attendance } from "@/lib/db";
import {
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	ChipProps,
	DateValue,
	Listbox,
	ListboxItem,
	Popover,
	PopoverTrigger,
	Skeleton,
	User,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const UserAttendanceStatus = ({
	userId,
	meeting,
	isLoading,
	onPress,
}: {
	userId: string;
	meeting: Attendance;
	isLoading: boolean;
	onPress: () => void;
}) => {
	if (!meeting) return null;

	const props = {
		isDisabled: isLoading,
		onClose: onPress,
		endContent: (
			<PopoverTrigger>
				<ChevronDown size={15} className="mr-0.5" />
			</PopoverTrigger>
		),
		variant: "dot",
	} as ChipProps;

	if (meeting.attending.some((u) => u.id === userId))
		return (
			<Chip color="success" {...props}>
				Attending
			</Chip>
		);
	else if (meeting.not_attending.some((u) => u.id === userId))
		return (
			<Chip color="danger" {...props}>
				Not Attending
			</Chip>
		);
	else if (meeting.undecided.some((u) => u.id === userId))
		return (
			<Chip color="warning" {...props}>
				Undecided
			</Chip>
		);
	return null;
};

interface UserAttendanceProps {
	stats: AttendanceStats;
	history: AttendanceHistory;
	isLoading: boolean;
	selectedMeeting: Attendance | null;
	selectedDate: DateValue | null;
	handleDateChange: (date: DateValue) => void;
}

export function UserAttendance({
	stats,
	history,
	isLoading,
	selectedMeeting,
	selectedDate,
	handleDateChange,
}: UserAttendanceProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Card key={stats.user?.id}>
			<CardHeader className="justify-between">
				<User
					avatarProps={{
						src: stats.user?.avatar_url || "",
					}}
					name={stats.user?.full_name || ""}
					description={stats.user?.position || ""}
				/>
				<Popover
					isOpen={isOpen}
					onOpenChange={setIsOpen}
					placement="bottom"
					showArrow
				>
					{/* <PopoverTrigger> */}
					<UserAttendanceStatus
						onPress={() => setIsOpen(true)}
						isLoading={isLoading}
						userId={stats.user?.id || ""}
						meeting={selectedMeeting!}
					/>
					{/* </PopoverTrigger> */}
					<Listbox
						aria-label="Actions"
						onAction={(key) => alert(key)}
					>
						<ListboxItem color="primary" key="Attending">
							Attending
						</ListboxItem>
					</Listbox>
				</Popover>
			</CardHeader>
			<CardBody>
				<UserAttendanceCalendar
					history={history}
					isLoading={isLoading}
					selectedDate={selectedDate}
					handleDateChange={handleDateChange}
				/>
			</CardBody>
			<CardFooter className="gap-4 flex-wrap">
				<h4 className="font-semibold mr-8">Attendance Stats</h4>
				<Skeleton isLoaded={!isLoading}>
					<Chip size="sm" color="primary" variant="faded">
						Attendance Rate: {stats.attendanceRate}
					</Chip>
				</Skeleton>
				<Skeleton isLoaded={!isLoading}>
					<Chip size="sm" color="primary" variant="faded">
						Current Streak: {stats.currentStreak}
					</Chip>
				</Skeleton>
				<Skeleton isLoaded={!isLoading}>
					<Chip size="sm" color="primary" variant="faded">
						Best Streak: {stats.streak}
					</Chip>
				</Skeleton>
			</CardFooter>
		</Card>
	);
}
