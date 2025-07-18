import { instrument } from '@socket.io/admin-ui';

import { CustomError } from '@/domain';
import { ApiError } from '@/domain/errors';
import { SocketEvents, SocketManager } from '@/presentation/socket';
import { ResponseFactory } from '@/presentation/utils/response-factory';

import express, { Express, NextFunction, Request, Response, Router } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ZodError } from 'zod';

interface ServerOptions {
	port: number;
	routes: Router;
}

export class Server {
	public readonly app: Express = express();
	private readonly _routes: Router;
	private readonly _port: number;
	private readonly _httpServer;
	public readonly io: SocketIOServer;

	constructor(options: ServerOptions) {
		const { port, routes } = options;
		this._port = port;
		this._routes = routes;
		this._httpServer = createServer(this.app);
		this.io = new SocketIOServer(this._httpServer, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		});
		this.setupSocket();
	}

	async start() {
		// Middlewares
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));

		// Routes
		this.app.use(this._routes);

		// Global Error Handler (debe ir al final)
		this.app.use(this.errorHandler);

		instrument(this.io, {
			auth: false,
			mode: 'development',
		});

		this._httpServer.listen(this._port, () => {
			console.log(`📡 Server is running on port ${this._port}`);
			console.log(`🔌 Socket.IO server is ready`);
		});
	}

	private errorHandler = (err: Error | CustomError | ZodError, _req: Request, res: Response, _next: NextFunction) => {
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

	private setupSocket(): void {
		// Initialize the SocketManager singleton with our IO instance
		SocketManager.getInstance().initialize(this.io);

		// Setup connection events
		this.io.on('connection', SocketEvents.setupEvents);
	}
}
