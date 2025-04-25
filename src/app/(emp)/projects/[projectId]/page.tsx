import { ProjectPage } from "@/components/admin/employee/projects/ProjectPage";
import { getProjectByIdWithDetailsServer } from "@/lib/dbServer/projects";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ projectId: string }> }) {
	const { projectId } = await params;
	const project = await getProjectByIdWithDetailsServer(projectId);

	if (!project) return notFound();

	return <ProjectPage project={project} />;
}
