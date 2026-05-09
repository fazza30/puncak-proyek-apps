import type { BaseResponse } from "@/types/response";
import type { WalletTopup, WalletTransaction } from "./wallet.type";
import { privateInstance } from "@/lib/axios";

export const getWalletTransactions = async (): Promise<
	BaseResponse<WalletTransaction[]>
> => privateInstance.get("/customer/topup-history").then((res) => res.data);

export const topupWallet = async (data: { balance: number }): Promise<
	BaseResponse<WalletTopup>
> => privateInstance.post("/customer/topup", data).then((res) => res.data);
