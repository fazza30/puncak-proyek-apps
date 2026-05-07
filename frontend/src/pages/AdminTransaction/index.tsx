import TitleHeading from "@/components/TitleHeading";
import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./columns";
import { useLoaderData } from "react-router-dom";
import type { Transaction } from "@/services/customer/customer.type";

export default function AdminTransactions() {
	const transactions = useLoaderData() as Transaction[];

	return (
		<>
			<TitleHeading title="List Transactions" />
			<div>
				<DataTable columns={columns} data={transactions} />
			</div>
		</>
	);
}
