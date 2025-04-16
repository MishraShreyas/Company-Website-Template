import { CustomerHome } from "@/components/customer/CustomerHome";
import { getSubdomain } from "@/lib/server-utils";

export default async function Page() {
	console.log(await getSubdomain());

	return <CustomerHome />;
}
