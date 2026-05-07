export interface LoginResponse {
	name: string;
	email: string;
	role: string;
	photoUrl: string;
	token: string;
	expiresAt: string;
}