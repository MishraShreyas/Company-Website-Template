"use client";
import { ProjectSummaryCard } from "@/components/admin/employee/projects/ProjectSummary";
import { getAllProjects, ProjectWithDetails } from "@/lib/db";
import { Database } from "@/types/database.types";
import { Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Team = Database["public"]["Tables"]["teams"]["Row"];

export function EmployeeHome() {
	const [loading, setLoading] = useState(true);
	const [projects, setProjects] = useState<ProjectWithDetails[]>([]);

	const groupedProjects = projects.reduce((acc: Record<string, ProjectWithDetails[]>, project) => {
		const teamId = project.team_id;
		if (!acc[teamId]) {
			acc[teamId] = [];
		}
		acc[teamId].push(project);
		return acc;
	}, {});

	const uniqueTeams: Team[] = Object.values(
		projects.reduce((acc: Record<string, Team>, project) => {
			const { team_id, team_name, team_description } = project;

			if (!acc[team_id]) {
				acc[team_id] = {
					id: team_id,
					name: team_name,
					description: team_description,
					created_at: project.team_created_at,
				} as Team;
			}

			return acc;
		}, {})
	);

	useEffect(() => {
		const fetchProjects = async () => {
			const projects = await getAllProjects();
			setProjects(projects);
			setLoading(false);
		};

		fetchProjects();
	}, []);

	return (
		<div className="space-y-4">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-2xl font-bold text-foreground"
			>
				Employee Dashboard
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-default-500"
			>
				These are the teams and projects you are a part of.
			</motion.p>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="space-y-16"
			>
				<Skeleton isLoaded={!loading}>
					<div className="grid grid-cols-1 gap-4">
						{uniqueTeams.map((team) => (
							<div key={team.id} className="flex flex-col gap-4">
								<h2 className="text-lg font-bold">{team.name}</h2>
								<p className="text-sm text-default-500">{team.description}</p>
								<div className="grid grid-cols-1 gap-4">
									{groupedProjects[team.id].map((project) => (
										<ProjectSummaryCard {...project} key={project.project_id} />
									))}
								</div>
							</div>
						))}
					</div>
				</Skeleton>
			</motion.div>
		</div>
	);
}
