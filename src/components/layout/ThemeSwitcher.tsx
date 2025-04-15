// app/components/ThemeSwitcher.tsx
"use client";

import { Button } from "@heroui/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<Button isIconOnly variant="light" onPress={toggleTheme}>
			{theme === "dark" ? (
				<IconSun
					size={20}
					className="text-neutral-600 dark:text-neutral-300"
				/>
			) : (
				<IconMoon
					size={20}
					className="text-neutral-600 dark:text-neutral-300"
				/>
			)}
		</Button>
	);
}
