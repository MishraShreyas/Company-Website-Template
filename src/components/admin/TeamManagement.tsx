"use client";

import MultiselectSearch, { AutocompleteItemType } from "@/components/ui/multi-select-search";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { createTeam, deleteTeam, TeamWithMembers, updateTeam } from "@/lib/db";
import { Database } from "@/types/database.types";
import { Button, Card, CardHeader, Form, Input, Snippet } from "@heroui/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React, { RefObject, useEffect, useId, useRef, useState } from "react";

type User = Database["public"]["Tables"]["users"]["Row"];

interface TeamManagementProps {
	teams: TeamWithMembers[];
	users: User[];
	updateTeamLocal: (teamId: string, team: TeamWithMembers, newTeam: boolean | null) => void;
}

export function TeamManagement({ teams, users, updateTeamLocal }: TeamManagementProps) {
	const [active, setActive] = useState<TeamWithMembers | boolean | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const id = useId();

	const [loading, setLoading] = useState(false);

	const [selectedUsers, setSelectedUsers] = useState<AutocompleteItemType[]>([]);

	const [selectedManagers, setSelectedManagers] = useState<AutocompleteItemType[]>([]);

	const openNewTeam = () => {
		setSelectedManagers([]);
		setSelectedUsers([]);
		setActive({
			name: "New Team",
			description: "New Team Description",
			id: "new",
			created_at: new Date().toISOString(),
			team_members: [],
		});
	};

	const selectTeam = (team: TeamWithMembers) => {
		setSelectedUsers(
			team.team_members.map((user) => ({
				id: user.id,
				name: user.full_name,
			}))
		);
		setActive(team);
	};

	const updateTeamSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target as HTMLFormElement);
		const teamName = formData.get("teamName") as string;
		const teamDescription = formData.get("teamDescription") as string;

		if (active && typeof active === "object") {
			let newTeam = false;
			if (active.id === "new") {
				const createdTeam = await createTeam(
					{
						name: teamName,
						description: teamDescription,
					},
					selectedUsers.map((user) => user.id),
					selectedManagers.map((user) => user.id)
				);
				active.id = createdTeam.id;
				newTeam = true;
			} else {
				await updateTeam(
					active.id,
					{
						name: teamName,
						description: teamDescription,
					},
					selectedUsers.map((user) => user.id)
				);
			}

			updateTeamLocal(
				active.id,
				{
					...active,
					name: teamName,
					description: teamDescription,
					team_members: users.filter((user) => selectedUsers.some((selectedUser) => selectedUser.id === user.id)),
				},
				newTeam
			);
		}

		setActive(null);
		setLoading(false);
	};

	const deleteOpenTeam = async () => {
		setLoading(true);
		if (active && typeof active === "object") {
			if (active.id !== "new") {
				await deleteTeam(active.id);
				updateTeamLocal(active.id, active, null);
			}
			setActive(null);
		}
		setLoading(false);
	};

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setActive(false);
			}
		}

		if (active && typeof active === "object") {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [active]);

	useOutsideClick(ref as RefObject<HTMLDivElement>, () => setActive(null));

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<motion.h2
					className="text-xl font-bold text-foreground"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
				>
					Manage Teams
				</motion.h2>
				<Button isIconOnly color="secondary" onPress={openNewTeam}>
					<IconPlus />
				</Button>
			</div>
			<AnimatePresence>
				{active && typeof active === "object" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/20 h-full w-full z-10"
					/>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{active && typeof active === "object" ? (
					<div className="fixed inset-0 grid place-items-center z-[100]">
						<motion.button
							key={`button-${active.id}-${id}`}
							layout
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
								transition: {
									duration: 0.05,
								},
							}}
							className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
							onClick={() => setActive(null)}
						>
							<CloseIcon />
						</motion.button>
						<motion.div
							layoutId={`card-${active.id}-${id}`}
							ref={ref}
							className="relative w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
						>
							<Snippet hideSymbol color="secondary" codeString={active.id} size="sm" className="absolute top-4 right-4 hidden lg:flex">
								id
							</Snippet>
							<Form onSubmit={updateTeamSubmit} className="block gap-0">
								<div className="flex justify-between items-start p-4">
									<div className="space-y-2">
										<motion.h2 layoutId={`title-${active.id}-${id}`} className="font-bold text-foreground">
											{active.name}
										</motion.h2>
										<motion.p layoutId={`description-${active.id}-${id}`} className="text-default-500">
											{active.description}
										</motion.p>
									</div>
								</div>
								<div className="pt-4 relative px-4">
									<motion.div
										layout
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
									>
										<div className="w-full space-y-4">
											<Input
												isRequired
												errorMessage="Please enter a team name"
												name="teamName"
												label="Team Name"
												defaultValue={active.name}
											/>
											<Input
												isRequired
												errorMessage="Please enter a team description"
												name="teamDescription"
												label="Team Description"
												defaultValue={active.description || ""}
											/>

											<MultiselectSearch
												label="Members"
												array={users.map((u) => ({
													id: u.id,
													name: u.full_name,
												}))}
												selectedItems={selectedUsers}
												setSelectedItems={setSelectedUsers}
											/>

											{active.id === "new" && (
												<MultiselectSearch
													label="Managers"
													array={users.map((u) => ({
														id: u.id,
														name: u.full_name,
													}))}
													selectedItems={selectedManagers}
													setSelectedItems={setSelectedManagers}
												/>
											)}
										</div>
									</motion.div>
								</div>
								<div className="flex justify-end items-center p-4 gap-2">
									{active.id !== "new" && (
										<Button onPress={deleteOpenTeam} isLoading={loading} color="danger">
											Delete
										</Button>
									)}
									<Button isLoading={loading} type="submit" color="success">
										{active.id !== "new" ? "Save Changes" : "Create Team"}
									</Button>
								</div>
							</Form>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>
			<ul className="w-full space-y-4">
				{teams.map((team) => (
					<motion.div
						layoutId={`card-${team.id}-${id}`}
						key={`card-${team.id}-${id}`}
						onClick={() => selectTeam(team)}
						className="rounded-xl cursor-pointer group"
					>
						<Card className="w-full flex-row justify-between items-center group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800">
							<CardHeader className="w-fit">
								<motion.h3 layoutId={`title-${team.id}-${id}`} className="font-medium text-foreground text-center md:text-left">
									{team.name}
								</motion.h3>
								<motion.p layoutId={`description-${team.id}-${id}`} className="text-default-500 text-center md:text-left ml-2">
									{team.description}
								</motion.p>
							</CardHeader>

							<Button isIconOnly className="pointer-events-none group-hover:bg-neutral-200 dark:group-hover:bg-neutral-400">
								<IconEdit />
							</Button>
						</Card>
					</motion.div>
				))}
			</ul>
		</>
	);
}

export const CloseIcon = () => {
	return (
		<motion.svg
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
			exit={{
				opacity: 0,
				transition: {
					duration: 0.05,
				},
			}}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="h-4 w-4 text-black"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M18 6l-12 12" />
			<path d="M6 6l12 12" />
		</motion.svg>
	);
};
