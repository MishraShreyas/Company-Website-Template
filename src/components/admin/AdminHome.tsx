"use client";

import { RoleManagement } from "@/components/admin/RoleManagement";
import { TeamManagement } from "@/components/admin/TeamManagement";
import { UserManagement } from "@/components/admin/UserManagement";
import {
	getAllRoles,
	getAllTeams,
	getAllUsers,
	getPermissions,
	RoleWithPermissions,
	TeamWithMembers,
} from "@/lib/db";
import { Attendance, getAllMeetingUsers } from "@/lib/db/meeting_attendance";
import { Database } from "@/types/database.types";
import { Chip, Skeleton } from "@heroui/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Permission = Database["public"]["Tables"]["permissions"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

export function AdminHome() {
	const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
	const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
	const [teams, setTeams] = useState<TeamWithMembers[]>([]);
	const [allUsers, setAllUsers] = useState<User[]>([]);

	const [meetingToday, setMeetingToday] = useState<Attendance>({
		attending: [],
		not_attending: [],
		undecided: [],
	});

	const [loading, setLoading] = useState(true);

	const updateRole = (
		roleId: string,
		role: RoleWithPermissions,
		newRole: boolean | null
	) => {
		if (newRole === null) {
			setRoles((prev) => prev.filter((r) => r.id !== roleId));
		}

		if (newRole) {
			setRoles((prev) => [...prev, role]);
			return;
		}

		const updatedRoles = roles.map((r) => {
			if (r.id === roleId) {
				return {
					...role,
				};
			}
			return r;
		});

		setRoles(updatedRoles);
	};

	const updateTeamLocal = (
		teamId: string,
		team: TeamWithMembers,
		newTeam: boolean | null
	) => {
		if (newTeam === null) {
			setTeams((prev) => prev.filter((t) => t.id !== teamId));
		}

		if (newTeam) {
			setTeams((prev) => [...prev, team]);
			return;
		}

		const updatedTeams = teams.map((t) => {
			if (t.id === teamId) {
				return {
					...team,
				};
			}
			return t;
		});

		setTeams(updatedTeams);
	};

	const updateUserLocal = (
		userId: string,
		user: User,
		newUser: boolean | null
	) => {
		if (newUser === null) {
			setAllUsers((prev) => prev.filter((u) => u.id !== userId));
		}

		if (newUser) {
			setAllUsers((prev) => [...prev, user]);
			return;
		}

		const updatedUsers = allUsers.map((u) => {
			if (u.id === userId) {
				return {
					...user,
				};
			}
			return u;
		});

		setAllUsers(updatedUsers);
	};

	useEffect(() => {
		async function fetchData() {
			const roles = await getAllRoles();
			const allPermissions = await getPermissions();
			const allUsers = await getAllUsers();
			const teams = await getAllTeams();
			const meeters = await getAllMeetingUsers();

			setRoles(roles);
			setAllPermissions(allPermissions);
			setAllUsers(allUsers);
			setTeams(teams);
			setMeetingToday(meeters);

			setLoading(false);
		}

		fetchData();
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-2xl font-bold text-gray-800 dark:text-gray-200"
			>
				Admin Home
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-gray-600 dark:text-gray-400"
			>
				Welcome to the admin dashboard. Here you can manage users,
				roles, and permissions.
			</motion.p>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-gray-600 dark:text-gray-400"
			>
				The people attending today are:{" "}
				<i>{meetingToday.attending.length}</i>
			</motion.p>
			{meetingToday.attending.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-4">
					{meetingToday.attending.map((user) => (
						<Chip color="primary" key={user.id}>
							{user.full_name}
						</Chip>
					))}
				</div>
			)}
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-gray-600 dark:text-gray-400"
			>
				The people not attending today are:{" "}
				<i>{meetingToday.not_attending.length}</i>
			</motion.p>
			{meetingToday.not_attending.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-4">
					{meetingToday.not_attending.map((user) => (
						<Chip color="warning" key={user.id}>
							{user.full_name}
						</Chip>
					))}
				</div>
			)}
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-gray-600 dark:text-gray-400"
			>
				The people undecided today are:{" "}
				<i>{meetingToday.undecided.length}</i>
			</motion.p>
			{meetingToday.undecided.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-4">
					{meetingToday.undecided.map((user) => (
						<Chip key={user.id}>{user.full_name}</Chip>
					))}
				</div>
			)}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="space-y-16 max-w-3xl"
			>
				<div>
					{loading ? (
						<Skeleton className="h-20 w-full" />
					) : (
						<RoleManagement
							roles={roles}
							allPermissions={allPermissions}
							updateRoleLocal={updateRole}
						/>
					)}
				</div>

				<div>
					{loading ? (
						<Skeleton className="h-20 w-full" />
					) : (
						<TeamManagement
							teams={teams}
							users={allUsers}
							updateTeamLocal={updateTeamLocal}
						/>
					)}
				</div>

				<div>
					{loading ? (
						<Skeleton className="h-20 w-full" />
					) : (
						<UserManagement
							users={allUsers}
							updateUserLocal={updateUserLocal}
						/>
					)}
				</div>
			</motion.div>
		</div>
	);
}
