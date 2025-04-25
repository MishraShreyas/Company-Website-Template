"use client";
import { useEffect, useState } from "react";
import { getTaskSummary, ProjectWithDetails } from "@/lib/db";
import { motion } from "framer-motion";
import { Database } from "@/types/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function ProjectPage({ project }: { project: ProjectWithDetails }) {
	const [, setLoading] = useState(true);
	const [, setTasks] = useState<Task[]>([]);

	const fetchTasks = async () => {
		setLoading(true);
		const _tasks = await getTaskSummary(project.project_id);
		console.log(_tasks);
		setTasks(_tasks);
		setLoading(false);
	};

	useEffect(() => {
		fetchTasks();
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
				Project: {project.project_title}
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="text-default-500"
			>
				{project.project_descriptions}
			</motion.p>
		</div>
	);
}
