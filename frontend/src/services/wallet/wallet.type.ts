export interface WalletTransaction {
	_id: string;
	wallet: string;
	price: number;
	status: string;
}

export interface WalletTopup {
	token: string;
	redirect_url: string;
}
