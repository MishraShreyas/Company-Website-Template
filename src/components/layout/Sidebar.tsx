"use client";
import { getUserById } from "@/lib/db";
import { isMeetingToday, updateMeetingToday } from "@/lib/db";
import { createClient } from "@/utils/supabase/client";
import {
	IconArrowLeft,
	IconBrandTabler,
	IconSettings,
	IconUserBolt,
} from "@tabler/icons-react";
import { User } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
	Sidebar,
	SidebarBody,
	SidebarAttendance,
	SidebarLink,
} from "../ui/sidebar";

interface SidebarLayoutProps {
	children: React.ReactNode;
	subdomain: null | "admin" | "employee";
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
	const links = [
		{
			label: "Dashboard",
			href: "/",
			icon: (
				<IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
			),
		},
		{
			label: "Profile",
			href: "#",
			icon: (
				<IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
			),
		},
		{
			label: "Settings",
			href: "/settings",
			icon: (
				<IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
			),
		},
		{
			label: "Logout",
			href: "#",
			icon: (
				<IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
			),
		},
	];
	const [open, setOpen] = useState(false);

	const [initialLoading, setInitialLoading] = useState(true);
	const [user, setUser] = useState<null | {
		id: string;
		name: string;
	}>(null);

	const [loading, setLoading] = useState(false);
	const [meetingToday, setMeetingToday] = useState(false);

	const toggleMeetingToday = async () => {
		setLoading(true);
		const updatedMeeting = await updateMeetingToday(!meetingToday);
		if (updatedMeeting) {
			setMeetingToday(!meetingToday);
		}
		setLoading(false);
	};

	useEffect(() => {
		const fetchUser = async () => {
			const { user } = (await createClient().auth.getUser()).data;
			if (user) {
				const userData = await getUserById(user.id);
				if (userData) {
					setUser({
						id: userData.id,
						name: userData.full_name || "User",
					});
				}
			}

			setMeetingToday(await isMeetingToday());

			setInitialLoading(false);
		};
		fetchUser();
	}, []);

	return (
		<div className="flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-dvh">
			<Sidebar open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-10">
					<div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
						{open ? <Logo /> : <LogoIcon />}
						<div className="mt-8 flex flex-col gap-2">
							{links.map((link, idx) => (
								<SidebarLink key={idx} link={link} />
							))}
						</div>
					</div>
					<div className="space-y-2">
						{!initialLoading && user && (
							<SidebarAttendance
								className={
									meetingToday ? "bg-green-700" : "bg-red-800"
								}
								loading={loading}
								onPress={toggleMeetingToday}
							>
								{meetingToday
									? "Attending Meeting"
									: "Not Attending Meeting"}
							</SidebarAttendance>
						)}
						<SidebarLink
							link={{
								label: initialLoading
									? ""
									: user
									? user?.name || "User"
									: "Please Log In",
								href: "#",
								icon: (
									<User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
								),
							}}
						/>
					</div>
				</SidebarBody>
			</Sidebar>
			<div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
				{children}
			</div>
		</div>
	);
}
export const Logo = () => {
	return (
		<Link
			href="#"
			className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
		>
			<div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="font-medium whitespace-pre text-black dark:text-white"
			>
				Obelithe Studios
			</motion.span>
		</Link>
	);
};
export const LogoIcon = () => {
	return (
		<Link
			href="#"
			className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
		>
			<div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
		</Link>
	);
};
