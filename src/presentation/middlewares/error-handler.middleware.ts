import { ApiError } from '@/domain';
import { CustomError } from '@/domain/errors/custom.error';
import { ResponseFactory } from '@/presentation/utils/response-factory';

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (
	err: Error | CustomError | ZodError,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.log('Error caught by global handler:', err);

	if (err instanceof ZodError) {
		const errorMessage = err.errors[0].message;
		const validationError = CustomError.badRequest(errorMessage);
		const apiError: ApiError = {
			code: validationError.code,
			message: validationError.message,
		};
		res.status(400).json(ResponseFactory.error(apiError));
		return;
	}

	if (err instanceof CustomError) {
		const apiError: ApiError = {
			code: err.code,
			message: err.message,
		};
		res.status(err.statusCode).json(ResponseFactory.error(apiError));
		return;
	}

	if (err instanceof Error) {
		if (err.name === 'ValidationError') {
			const validationError = CustomError.badRequest(err.message);
			const apiError: ApiError = {
				code: validationError.code,
				message: validationError.message,
			};
			res.status(400).json(ResponseFactory.error(apiError));
			return;
		}

		if (err.name === 'SyntaxError') {
			const syntaxError = CustomError.badRequest('Invalid JSON format');
			const apiError: ApiError = {
				code: syntaxError.code,
				message: syntaxError.message,
			};
			res.status(400).json(ResponseFactory.error(apiError));
			return;
		}
	}

	const genericError = CustomError.internalServer('Internal Server Error');
	const apiError: ApiError = {
		code: genericError.code,
		message: genericError.message,
	};
	res.status(500).json(ResponseFactory.error(apiError));
};
