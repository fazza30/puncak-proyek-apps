export interface LoginResponse {
	id: string;
	name: string;
	email: string;
	role: string;
	photoUrl: string;
	token: string;
	expiresAt: string;
}