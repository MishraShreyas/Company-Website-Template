import { Database } from "@/types/database.types";
import { Avatar } from "@heroui/react";

export function UserAvatar({
	user,
	size,
	className,
	color,
}: {
	user: Database["public"]["Tables"]["users"]["Row"];
	size?: "sm" | "md" | "lg";
	className?: string;
	color?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
}) {
	const getInitials = (name: string) => {
		const names = name.split(" ");
		if (names.length === 1) {
			return names[0].charAt(0).toUpperCase();
		} else if (names.length > 1) {
			return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
		}
		return "";
	};
	return (
		<Avatar
			src={user.avatar_url || undefined}
			alt={user.full_name}
			name={user.full_name}
			size={size}
			className={className}
			color={color}
			getInitials={getInitials}
		/>
	);
}
