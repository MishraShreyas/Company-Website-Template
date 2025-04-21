import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";

type Label = Database["public"]["Tables"]["labels"]["Row"];
type LabelInsert = Database["public"]["Tables"]["labels"]["Insert"];
type LabelUpdate = Database["public"]["Tables"]["labels"]["Update"];

// CREATE Label
export async function createLabel(labelData: LabelInsert): Promise<Label> {
	const { data, error } = await createClient()
		.from("labels")
		.insert(labelData)
		.select()
		.single();
	if (error) throw error;
	if (!data) throw new Error("Label creation failed.");
	return data;
}

// READ Label by ID
export async function getLabelById(labelId: string): Promise<Label | null> {
	const { data, error } = await createClient()
		.from("labels")
		.select("*")
		.eq("id", labelId)
		.maybeSingle();
	if (error) throw error;
	return data;
}

// READ Labels (with projectId filter)
export async function getLabels(projectId: string): Promise<Label[]> {
	const { data, error } = await createClient()
		.from("labels")
		.select("*")
		.eq("project_id", projectId)
		.order("name");
	if (error) throw error;
	return data || [];
}

// UPDATE Label
export async function updateLabel(
	labelId: string,
	labelData: LabelUpdate
): Promise<Label> {
	const { data, error } = await createClient()
		.from("labels")
		.update(labelData)
		.eq("id", labelId)
		.select()
		.single();
	if (error) throw error;
	if (!data) throw new Error("Label update failed.");
	return data;
}

// DELETE Label
export async function deleteLabel(labelId: string): Promise<void> {
	// Consider implications: task_labels using this label? Set up cascade or handle manually.
	const { error } = await createClient()
		.from("labels")
		.delete()
		.eq("id", labelId);
	if (error) throw error;
}
