import { AttendanceHistory } from "@/components/admin/attendance/AttendanceReport";
import { Button, Skeleton } from "@heroui/react";
import { DateValue, parseDate } from "@internationalized/date";

interface UserAttendanceCalendarProps {
	history: AttendanceHistory;
	selectedDate: DateValue | null;
	handleDateChange: (date: DateValue) => void;
	isLoading: boolean;
}

export function UserAttendanceCalendar({
	history,
	selectedDate,
	handleDateChange,
	isLoading,
}: UserAttendanceCalendarProps) {
	return (
		<div className="w-full border border-divider rounded-lg grid grid-cols-4 md:grid-cols-7 overflow-clip">
			{history.slice(-14).map((day, index) => {
				let bgColor: "default" | "success" | "danger" | "warning" =
					"default";
				if (day.status === "attending") bgColor = "success";
				if (day.status === "not_attending") bgColor = "danger";
				if (day.status === "undecided") bgColor = "warning";

				return (
					<div
						className={`p-3 lg:p-5 w-full aspect-square ${
							!isLoading && day.date === selectedDate?.toString()
								? "bg-default"
								: ""
						}`}
						key={index}
					>
						<Skeleton
							isLoaded={!isLoading}
							key={index}
							classNames={{
								base: "w-full h-full rounded-lg",
								content: "w-full h-full rounded-lg",
							}}
						>
							<Button
								color={bgColor}
								className="w-full h-full min-w-10 flex items-center justify-center text-xs lg:text-md"
								onPress={() =>
									handleDateChange(parseDate(day.date))
								}
							>
								{new Date(day.date).getDate()}
							</Button>
						</Skeleton>
					</div>
				);
			})}
		</div>
	);
}
