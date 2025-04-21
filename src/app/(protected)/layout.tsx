"use server";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	// User is authenticated, render the main layout
	return <>{children}</>;
}
