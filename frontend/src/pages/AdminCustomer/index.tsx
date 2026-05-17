import TitleHeading from "@/components/TitleHeading";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { Link, useLoaderData } from "react-router-dom";
import type { User } from "@/services/customer/customer.type";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminCustomer() {
	const customers = useLoaderData() as User[];

	return (
		<>
			<TitleHeading title="List Customers" />
			
			<div>
				<Button asChild className="mb-3">
					<Link to="/admin/customers/create">
						<Plus className="w-4 h-4 mr-2" />
						Add Data
					</Link>
				</Button>
				<DataTable columns={columns} data={customers} />
			</div>
		</>
	);
}
