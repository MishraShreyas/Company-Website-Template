import { AttendanceReport } from "@/components/admin/attendance/AttendanceReport";
import { getSubdomain } from "@/lib/server-utils";

export default async function Page() {
	const subdomain = await getSubdomain();
	return <AttendanceReport subdomain={subdomain} />;
}
