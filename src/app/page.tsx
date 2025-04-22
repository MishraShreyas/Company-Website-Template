"use server";

import { AdminHome } from "@/components/admin/AdminHome";
import { CustomerHome } from "@/components/customer/CustomerHome";
import { getSubdomain } from "@/lib/server-utils";

export default async function Page() {
	const subDomain = await getSubdomain();

	switch (subDomain) {
		case "admin":
			return <AdminHome />;
		case "employee":
			return <div>
				<p classNams="text-3xl">
					Employee Portal is WIP. Please use the navigation bar to mark attendance!
				</p>
			</div>;
		default:
			return <CustomerHome />;
	}
}
