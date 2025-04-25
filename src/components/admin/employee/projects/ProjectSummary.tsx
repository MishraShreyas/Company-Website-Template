import { UserAvatar } from "@/components/common/UserAvater";
import { ProjectWithDetails } from "@/lib/db";
import { AvatarGroup, Button, Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import Link from "next/link";

export function ProjectSummaryCard({
	project_id,
	project_title,
	project_descriptions,
	project_created_at,
	due_date,
	priority,
	project_creator,
	team_members,
}: ProjectWithDetails) {
	const projectCreatedDate = new Date(project_created_at || "");
	const formattedDate = projectCreatedDate.toLocaleDateString("en-IN", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	});

	return (
		<Card>
			<CardHeader className="w-full justify-between">
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-bold">{project_title}</h2>
					<p className="text-sm text-default-500">{project_descriptions}</p>
				</div>
				<AvatarGroup isBordered>
					{team_members.map((member) => (
						<UserAvatar user={member} key={member.id} color="secondary" />
					))}
				</AvatarGroup>
			</CardHeader>

			<CardBody>
				<div className="flex flex-wrap gap-2 -mt-2">
					{project_created_at && (
						<Chip variant="flat" className="w-fit">
							Created At: {formattedDate}
						</Chip>
					)}
					{project_creator && (
						<Chip variant="flat" className="w-fit">
							Created By: {project_creator}
						</Chip>
					)}
					{due_date && (
						<Chip variant="flat" className="w-fit">
							Due Date: {due_date}
						</Chip>
					)}
					{priority && priority !== "none" && (
						<Chip variant="flat" className="w-fit">
							Priority: {priority}
						</Chip>
					)}
				</div>
			</CardBody>

			<CardFooter>
				<Link href={`/projects/${project_id}`} className="w-full">
					<Button color="primary" variant="flat" className="w-full">
						Open Project
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
