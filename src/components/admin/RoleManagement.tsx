"use client";

import React, { RefObject, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { createRole, deleteRole, permissionGrouper, RoleWithPermissions, updateRole } from "@/lib/db";
import { addToast, Button, Card, CardHeader, Form, Input } from "@heroui/react";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Database } from "@/types/database.types";
import MultiselectSearch from "@/components/ui/multi-select-search";

type Permissions = Database["public"]["Tables"]["permissions"]["Row"];

interface RoleManagementProps {
	roles: RoleWithPermissions[];
	allPermissions: Permissions[];
	updateRoleLocal: (roleId: string, role: RoleWithPermissions, newRole: boolean | null) => void;
}

export function RoleManagement({ roles, allPermissions, updateRoleLocal }: RoleManagementProps) {
	const [active, setActive] = useState<RoleWithPermissions | boolean | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const id = useId();

	const [loading, setLoading] = useState(false);

	const [selectedPermissions, setSelectedPermissions] = useState<Omit<Permissions, "description">[]>([]);
	const permissionsDropdown = allPermissions.map((p) => ({
		id: p.id,
		name: `${p.name} - ${p.description}`,
	}));

	const openNewRole = () => {
		setActive({
			name: "New Role",
			description: "New Role",
			id: "new",
			created_at: new Date().toISOString(),
			permissions: [],
		});
		setSelectedPermissions([]);
	};

	const selectRole = (role: RoleWithPermissions) => {
		setSelectedPermissions(
			role.permissions.map((p) => ({
				id: p.id,
				name: `${p.name} - ${p.description}`,
			}))
		);
		setActive(role);
	};

	const updateRoleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target as HTMLFormElement);
		const roleName = formData.get("roleName") as string;
		const roleDescription = formData.get("roleDescription") as string;

		const perms = selectedPermissions.map((p) => ({
			id: p.id,
			name: p.name.split(" - ")[0],
			description: p.name.split(" - ")[1],
		}));

		if (perms.length === 0) {
			addToast({
				title: "Please select at least one permission",
				color: "danger",
				timeout: 2000,
			});
			setActive(null);
			setLoading(false);
			return;
		}

		if (active && typeof active === "object") {
			let newRole = false;
			if (active.id === "new") {
				active.id = await createRole(
					roleName,
					roleDescription,
					perms.map((p) => p.id)
				);
				newRole = true;
			} else
				await updateRole(
					active.id,
					{
						name: roleName,
						description: roleDescription,
					},
					perms.map((p) => p.id)
				);

			updateRoleLocal(
				active.id,
				{
					...active,
					name: roleName,
					description: roleDescription,
					permissions: perms,
				},
				newRole
			);
		}

		setActive(null);
		setLoading(false);
	};

	const deleteOpenRole = async () => {
		setLoading(true);
		console.log("Deleting role", active);
		if (active && typeof active === "object") {
			if (active.id !== "new") {
				await deleteRole(active.id);
				updateRoleLocal(active.id, active, null);
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
					Manage Roles
				</motion.h2>
				<Button isIconOnly color="secondary" onPress={openNewRole}>
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
							className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
						>
							<Form onSubmit={updateRoleSubmit} className="block gap-0">
								<div className="flex justify-between items-start p-4">
									<div className="">
										<motion.h2 layoutId={`title-${active.id}-${id}`} className="font-bold text-foreground">
											{active.name}
										</motion.h2>
										<motion.p layoutId={`description-${active.id}-${id}`} className="text-default-500 mt-2">
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
										className="text-default text-xs md:text-sm lg:text-base h-40 md:h-fit flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
									>
										<div className="w-full space-y-4">
											<Input
												isRequired
												errorMessage="Please enter a role name"
												name="roleName"
												label="Role Name"
												defaultValue={active.name}
											/>
											<Input
												isRequired
												errorMessage="Please enter a role description"
												name="roleDescription"
												label="Role Description"
												defaultValue={active.description || ""}
											/>

											<MultiselectSearch
												label="Permissions"
												array={permissionsDropdown}
												selectedItems={selectedPermissions}
												setSelectedItems={setSelectedPermissions}
												groupingFunction={permissionGrouper}
											/>
										</div>
									</motion.div>
								</div>
								<div className="flex justify-end items-center p-4 gap-2">
									{active.id !== "new" && (
										<Button onPress={deleteOpenRole} isLoading={loading} color="danger">
											Delete
										</Button>
									)}
									<Button isLoading={loading} type="submit" color="success">
										{active.id !== "new" ? "Save Changes" : "Create Role"}
									</Button>
								</div>
							</Form>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>
			<ul className="w-full space-y-4">
				{roles.map((role) => (
					<motion.div
						layoutId={`card-${role.id}-${id}`}
						key={`card-${role.id}-${id}`}
						onClick={() => selectRole(role)}
						className="rounded-xl cursor-pointer group"
					>
						<Card className="w-full flex-row justify-between items-center group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800">
							<CardHeader className="w-fit">
								<motion.h3 layoutId={`title-${role.name}-${id}`} className="font-medium text-foreground text-center md:text-left">
									{role.name}
								</motion.h3>
								<motion.p
									layoutId={`description-${role.description}-${id}`}
									className="text-default-500 text-center md:text-left ml-2"
								>
									{role.description}
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
