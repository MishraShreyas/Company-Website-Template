import {
	Autocomplete,
	AutocompleteItem,
	AutocompleteSection,
	Chip,
} from "@heroui/react";
import { Check, X } from "lucide-react";

type AutocompleteItemType = {
	name: string; // Name of the item
	id: string; // Unique identifier for the item
};

/**
 * Props for the MultiselectSearch component.
 *
 * @interface MultiselectSearchProps
 * @property {string} label - Label for the multiselect input.
 * @property {string} className - CSS class name for styling the component.
 * @property {AutocompleteItemType[]} array - Array of items to be displayed in the multiselect dropdown.
 * @property {(item: string) => string} [groupingFunction] - Optional function to categorize items into groups.
 * @property {string[]} [selectedItems] - Optional array of pre-selected item values.
 * @property {(items: string[]) => void} [setSelectedItems] - Optional callback function to handle changes when items are selected or deselected.
 */
interface MultiselectSearchProps {
	label: string;
	className?: string;
	array: AutocompleteItemType[];
	groupingFunction?: (item: string) => string;
	selectedItems: AutocompleteItemType[];
	setSelectedItems: (items: AutocompleteItemType[]) => void;
}

const MultiselectSearch = ({
	label,
	className,
	array,
	selectedItems,
	setSelectedItems,
	groupingFunction,
}: MultiselectSearchProps) => {
	// groupingFunction is used to group items in the autocomplete dropdown
	// If not provided, items will be displayed without grouping
	const groupedItems = groupingFunction
		? array.reduce((acc, item) => {
				const group = groupingFunction(item.name);
				if (!acc[group]) {
					acc[group] = [];
				}
				acc[group].push(item);
				return acc;
		  }, {} as Record<string, AutocompleteItemType[]>)
		: { "": array };

	const selectedIds = selectedItems.map((item) => item.id);

	// toggle selection of items in the multiselect dropdown
	const handleSelect = (item: AutocompleteItemType) => {
		if (selectedIds.includes(item.id)) {
			setSelectedItems(
				selectedItems.filter((selection) => selection.id !== item.id)
			);
		} else {
			setSelectedItems([...selectedItems, item]);
		}
	};

	const handleDeleteSelection = (item: AutocompleteItemType) => {
		setSelectedItems(
			selectedItems.filter((selection) => selection.id !== item.id)
		);
	};

	return (
		<div>
			<Autocomplete className={className} selectedKey={""} label={label}>
				{groupingFunction
					? Object.entries(groupedItems).map(([group, items]) => (
							<AutocompleteSection key={group} title={group}>
								{items.map((item) => (
									<AutocompleteItem
										key={item.id}
										onClick={() => handleSelect(item)}
										endContent={
											selectedIds.includes(item.id) && (
												<Check
													size={16}
													className="mr-2 text-green-500"
												/>
											)
										}
									>
										{item.name}
									</AutocompleteItem>
								))}
							</AutocompleteSection>
					  ))
					: array.map((item) => (
							<AutocompleteItem
								key={item.id}
								onClick={() => handleSelect(item)}
								endContent={
									selectedIds.includes(item.id) && (
										<Check
											size={16}
											className="mr-2 text-green-500"
										/>
									)
								}
							>
								{item.name}
							</AutocompleteItem>
					  ))}
			</Autocomplete>
			<div className="flex mt-2 w-96 flex-wrap">
				{selectedItems.map((item, idx) => (
					<Chip
						key={idx}
						color={"primary"}
						className="mr-2 mt-2"
						endContent={
							<X
								size={14}
								className="mr-1 cursor-pointer"
								onClick={() => handleDeleteSelection(item)}
							/>
						}
					>
						{item.name}
					</Chip>
				))}
			</div>
		</div>
	);
};

export default MultiselectSearch;
