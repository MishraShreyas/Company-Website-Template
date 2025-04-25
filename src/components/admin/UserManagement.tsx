"use client";

import { useOutsideClick } from "@/hooks/use-outside-click";
import { updateUser } from "@/lib/db";
import { createUser, deleteUser } from "@/lib/dbServer/users";
import { Database } from "@/types/database.types";
import {
	addToast,
	Button,
	Card,
	CardHeader,
	Form,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { IconEdit, IconPlus, IconUser } from "@tabler/icons-react";
import { Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { RefObject, useEffect, useId, useRef, useState } from "react";

type User = Database["public"]["Tables"]["users"]["Row"];

interface UserManagementProps {
	users: User[];
	updateUserLocal: (userId: string, user: User, newUser: boolean | null) => void;
}

export function UserManagement({ users, updateUserLocal }: UserManagementProps) {
	const [active, setActive] = useState<User | boolean | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const id = useId();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState(false);

	const [viewPassword, setViewPassword] = useState(false);
	const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);

	const openNewUser = () => {
		setActive({
			id: "new",
			full_name: "",
			avatar_url: null,
			position: "",
			created_at: new Date().toISOString(),
		});
	};

	const selectUser = (user: User) => {
		setActive(user);
	};

	const clickDeleteUser = () => {
		if (typeof active !== "object") return;
		setUserToDelete(active);
		setActive(false);
		onOpen();
	};

	const updateUserSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData(e.target as HTMLFormElement);
		const fullName = formData.get("fullName") as string;
		const position = formData.get("position") as string;
		const email = formData.get("email") as string;
		const avatarUrl = formData.get("avatarUrl") as string;
		const password = formData.get("password") as string;
		const confirmPassword = formData.get("confirm-password") as string;

		try {
			if (active && typeof active === "object") {
				let newUser = false;
				let updatedUser: User | null = null;

				if (active.id === "new") {
					if (!password) {
						addToast({
							title: "Password is required for new users",
							color: "danger",
							timeout: 2000,
						});
						setLoading(false);
						return;
					}

					if (password !== confirmPassword) {
						addToast({
							title: "Passwords do not match",
							color: "danger",
							timeout: 2000,
						});
						setLoading(false);
						return;
					}

					updatedUser = await createUser(fullName, position, email, password);
					newUser = true;
				} else {
					updatedUser = await updateUser({
						full_name: fullName,
						id: active.id,
						position: position,
						avatar_url: avatarUrl || "",
					});
				}

				if (!updatedUser) {
					addToast({
						title: "Error updating user",
						description: "User not found",
						color: "danger",
						timeout: 2000,
					});
					setLoading(false);
					return;
				}

				updateUserLocal(updatedUser.id, updatedUser, newUser);
			}

			setActive(null);
		} catch (error) {
			console.error("Error updating user:", error);
			addToast({
				title: "Error updating user",
				description: error instanceof Error ? error.message : "Unknown error",
				color: "danger",
				timeout: 5000,
			});
		} finally {
			setLoading(false);
		}
	};

	const deleteActiveUser = async () => {
		setLoading(true);
		try {
			if (userToDelete) {
				await deleteUser(userToDelete.id);
				updateUserLocal(userToDelete.id, userToDelete, null);
				setActive(null);
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			addToast({
				title: "Error deleting user",
				description: error instanceof Error ? error.message : "Unknown error",
				color: "danger",
				timeout: 5000,
			});
		} finally {
			setLoading(false);
		}
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
					Manage Users
				</motion.h2>
				<Button isIconOnly color="secondary" onPress={openNewUser}>
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
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
								transition: { duration: 0.05 },
							}}
							className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
							onClick={() => setActive(null)}
						>
							<CloseIcon />
						</motion.button>
						<motion.div
							layoutId={`card-${active.id}-${id}`}
							ref={ref}
							className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
						>
							<Form onSubmit={updateUserSubmit} className="block gap-0">
								<div className="flex justify-between items-start p-4">
									<div className="">
										<motion.h2 layoutId={`title-${active.id}-${id}`} className="font-bold text-foreground">
											{active.id === "new" ? "Create New User" : "Edit User"}
										</motion.h2>
										<motion.p layoutId={`description-${active.id}-${id}`} className="text-default-500 mt-2">
											{active.id === "new" ? "Enter details for the new user" : active.full_name}
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
												errorMessage="Please enter a full name"
												name="fullName"
												label="Full Name"
												defaultValue={active.full_name || ""}
											/>
											<Input
												isRequired
												errorMessage="Please enter a position"
												name="position"
												label="Position"
												defaultValue={active.position || ""}
											/>

											{active.id === "new" ? (
												<>
													<Input
														isRequired
														errorMessage="Please enter a valid email"
														name="email"
														label="Email"
														type="email"
													/>
													<Input
														isRequired
														errorMessage="Please enter a password"
														endContent={
															<button
																className="focus:outline-none cursor-pointer"
																type="button"
																aria-label="Toggle password visibility"
																onClick={() => setViewPassword(!viewPassword)}
															>
																{viewPassword ? <Eye /> : <EyeOff />}
															</button>
														}
														name="password"
														label="Password"
														type={viewPassword ? "text" : "password"}
														autoComplete="new-password"
													/>
													<Input
														isRequired
														errorMessage="Please enter a password"
														endContent={
															<button
																className="focus:outline-none cursor-pointer"
																type="button"
																aria-label="Toggle password visibility"
																onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
															>
																{viewConfirmPassword ? <Eye /> : <EyeOff />}
															</button>
														}
														name="confirm-password"
														label="Confirm Password"
														type={viewConfirmPassword ? "text" : "password"}
														autoComplete="confirm-password"
													/>
												</>
											) : (
												<Input
													name="avatarUrl"
													label="Avatar URL"
													placeholder="https://example.com/avatar.jpg"
													defaultValue={active.avatar_url || ""}
												/>
											)}
										</div>
									</motion.div>
								</div>
								<div className="flex justify-end items-center p-4 gap-2">
									{active.id !== "new" && (
										<Button onPress={clickDeleteUser} isLoading={loading} color="danger">
											Delete
										</Button>
									)}
									<Button isLoading={loading} type="submit" color="success">
										{active.id !== "new" ? "Save Changes" : "Create User"}
									</Button>
								</div>
							</Form>
						</motion.div>
					</div>
				) : null}
			</AnimatePresence>
			<ul className="w-full space-y-4">
				{users.map((user) => (
					<motion.div
						layoutId={`card-${user.id}-${id}`}
						key={`card-${user.id}-${id}`}
						onClick={() => selectUser(user)}
						className="rounded-xl cursor-pointer group"
					>
						<Card className="w-full flex-row justify-between items-center group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800">
							<CardHeader className="w-fit flex items-center">
								{user.avatar_url ? (
									<img src={user.avatar_url} alt={user.full_name || "User"} className="w-8 h-8 rounded-full mr-3" />
								) : (
									<div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
										<IconUser size={16} />
									</div>
								)}
								<div>
									<motion.h3 layoutId={`title-${user.id}-${id}`} className="font-medium text-foreground text-center md:text-left">
										<b>{user.full_name}</b>
										<span className="text-default-500"> - {user.position}</span>
									</motion.h3>
								</div>
							</CardHeader>

							<Button isIconOnly className="pointer-events-none group-hover:bg-neutral-200 dark:group-hover:bg-neutral-400">
								<IconEdit />
							</Button>
						</Card>
					</motion.div>
				))}
			</ul>

			<Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Are you sure you want to delete the user {typeof active === "object" && `${active?.full_name}`}?
							</ModalHeader>
							<ModalBody>
								<p>This action cannot be undone. The user will be permanently deleted from the system.</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" isLoading={loading} onPress={onClose}>
									Cancel
								</Button>
								<Button
									color="danger"
									variant="solid"
									isLoading={loading}
									onPress={async () => {
										setLoading(true);
										await deleteActiveUser();
										setLoading(false);
										onClose();
									}}
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}

export const CloseIcon = () => {
	return (
		<motion.svg
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{
				opacity: 0,
				transition: { duration: 0.05 },
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
