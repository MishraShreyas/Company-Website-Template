"use server";

import { AdminHome } from "@/components/admin/AdminHome";
import { EmployeeHome } from "@/components/admin/employee/EmployeeHome";
import { CustomerHome } from "@/components/customer/CustomerHome";
import { getSubdomain } from "@/lib/server-utils";

export default async function Page() {
	const subDomain = await getSubdomain();

	switch (subDomain) {
		case "admin":
			return <AdminHome />;
		case "employee":
			return <EmployeeHome />;
		default:
			return <CustomerHome />;
	}
}
