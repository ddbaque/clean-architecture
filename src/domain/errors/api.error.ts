import { ErrorCode } from './';

export interface ApiError {
	code: ErrorCode;
	message: string;
	details?: unknown;
}
