import TitleHeading from "@/components/TitleHeading";
import { DataTable } from "@/components/ui/data-table";

import { useLoaderData } from "react-router-dom";
import type { WalletTransaction } from "@/services/customer/customer.type";
import { Seat } from "@/services/global/global.type";

export default function AdminSeats() {
    const seats = useLoaderData() as Seat[];

    return (
        <>
            <TitleHeading title="List Seat Maps" />
            <div>
                
            </div>
        </>
    );
}
