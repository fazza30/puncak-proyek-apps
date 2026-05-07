export type BaseResponse<T> = {
	message: string;
	data: T;
	status: string;
};
