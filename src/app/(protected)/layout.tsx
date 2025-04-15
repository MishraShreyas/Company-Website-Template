"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { SidebarLayout as Sidebar } from "@/components/layout/Sidebar";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			// Redirect to login if not authenticated after loading state resolves
			router.push("/login?redirectedFrom=" + window.location.pathname);
		}
	}, [user, loading, router]);

	// Show loading state or nothing while checking auth, prevents flashing layout
	if (loading || !user) {
		// Optionally return a full-page loader here, or just null
		return <LoadingSpinner fullScreen />;
	}

	// User is authenticated, render the main layout
	return (
		<div className="flex h-screen bg-background">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-muted/40">
					{children}
				</main>
			</div>
		</div>
	);
}
