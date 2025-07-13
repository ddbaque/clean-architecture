import { CustomError } from '@/domain';
import { ApiError } from '@/domain/errors';
import { ResponseFactory } from '@/presentation/utils/response-factory';

import express, { Express, NextFunction, Request, Response, Router } from 'express';
import { ZodError } from 'zod';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

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
				origin: "*",
				methods: ["GET", "POST"]
			}
		});
		this.setupSocketEvents();
	}

	async start() {
		// Middlewares
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));

		// Routes
		this.app.use(this._routes);

		// Global Error Handler (debe ir al final)
		this.app.use(this.errorHandler);

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

	private setupSocketEvents() {
		this.io.on('connection', (socket) => {
			console.log(`🔌 User connected: ${socket.id}`);

			socket.on('disconnect', () => {
				console.log(`🔌 User disconnected: ${socket.id}`);
			});

			// Example event handlers
			socket.on('message', (data) => {
				console.log('Message received:', data);
				// Broadcast to all clients
				this.io.emit('message', data);
			});

			socket.on('join-room', (room) => {
				socket.join(room);
				console.log(`🔌 User ${socket.id} joined room: ${room}`);
				socket.to(room).emit('user-joined', { userId: socket.id });
			});

			socket.on('leave-room', (room) => {
				socket.leave(room);
				console.log(`🔌 User ${socket.id} left room: ${room}`);
				socket.to(room).emit('user-left', { userId: socket.id });
			});
		});
	}
}
