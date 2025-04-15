import React from "react";
import { Spinner } from "@heroui/react";

interface LoadingSpinnerProps {
	fullScreen?: boolean;
	label?: string;
	size?: "sm" | "md" | "lg";
	color?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger";
	variant?: "default" | "gradient" | "wave" | "dots" | "spinner" | "simple";
}

export const LoadingSpinner = ({
	fullScreen = false,
	size = "md",
	color = "default",
	label,
	variant = "default",
}: LoadingSpinnerProps) => {
	const spinner = (
		<Spinner
			size={size}
			color={color}
			label={label}
			labelColor={color === "default" ? "foreground" : color}
			variant={variant}
		/>
	);

	if (fullScreen) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
				{spinner}
			</div>
		);
	}

	return spinner;
};
