import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	// Simple layout, no sidebar/header for login page
	return children;
}
