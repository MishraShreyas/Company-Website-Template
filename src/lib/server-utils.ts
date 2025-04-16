"use server";
import { headers } from "next/headers";

/**
 * Fetches the subdomain from the request URL.
 */
export async function getSubdomain() {
	const headersList = await headers();
	const host = headersList.get("host") || "";
	const subdomain = host.split(".")[0];
	return subdomain === "www" ? "" : subdomain;
}
