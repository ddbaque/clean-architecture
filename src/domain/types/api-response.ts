import { ApiError } from '../errors';

export interface BaseResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: ApiError;
	meta?: {
		timestamp: string;
		requestId?: string;
		pagination?: PaginationMeta;
	};
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}
