import TitleHeading from "@/components/TitleHeading";

import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";

import {
	Link,
	useLoaderData,
} from "react-router-dom";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

/**
 * ==================================================
 * TYPES
 * ==================================================
 */

type TransactionData = {
	user: {
		name: string;
		email: string;
	};

	movie: {
		title: string;
	};

	theater: {
		name: string;
	};

	seats: {
		seat: string;
	}[];
};

/**
 * ==================================================
 * COMPONENT
 * ==================================================
 */

export default function AdminCustomer() {
	const transactions =
		useLoaderData() as TransactionData[];

	return (
		<>
			<TitleHeading title="Customer Transactions" />

			<div className="space-y-4">
				<Button
					asChild
					className="mb-3"
				>
					<Link to="/admin/customers/create">
						<Plus className="mr-2 h-4 w-4" />
						Add Data
					</Link>
				</Button>

				<DataTable
					columns={columns}
					data={
						transactions ??
						[]
					}
				/>
			</div>
		</>
	);
}