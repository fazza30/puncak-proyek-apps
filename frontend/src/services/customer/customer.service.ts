import type { BaseResponse } from "@/types/response";
import type { Transaction, User, WalletTransaction } from "./customer.type";
import { privateInstance } from "@/lib/axios";

export const getCustomers = (): Promise<BaseResponse<User[]>> =>
	privateInstance.get("/admin/customers").then((res) => res.data);

export const getTransactions = (): Promise<BaseResponse<Transaction[]>> =>
	privateInstance.get("/admin/ticket-transactions").then((res) => res.data);

export const getWalletTransactions = (): Promise<
	BaseResponse<WalletTransaction[]>
> => privateInstance.get("/admin/wallet-transactions").then((res) => res.data);
