"use client";

import { SidebarLayout as Sidebar } from "@/components/layout/Sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	// User is authenticated, render the main layout
	return (
		<div className="flex h-screen bg-background">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				{children}
			</div>
		</div>
	);
}
