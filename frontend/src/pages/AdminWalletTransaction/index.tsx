import TitleHeading from "@/components/TitleHeading";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./columns";
import { useLoaderData } from "react-router-dom";
import type { WalletTransaction } from "@/services/customer/customer.type";

export default function AdminWalletTransactions() {
	const transactions = useLoaderData() as WalletTransaction[];

	return (
		<>
			<TitleHeading title="List Wallet Transactions" />
			<div>
				<DataTable columns={columns} data={[]} />
			</div>
		</>
	);
}
