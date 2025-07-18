import { instrument } from '@socket.io/admin-ui';

import { errorHandlerMiddleware } from '@/presentation/middlewares/error-handler.middleware';
import { SocketEvents, SocketManager } from '@/presentation/socket';

import express, { Express, Router } from 'express';
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
		this.app.use(errorHandlerMiddleware);

		instrument(this.io, {
			auth: false,
			mode: 'development',
		});

		this._httpServer.listen(this._port, () => {
			console.log(`📡 Server is running on port ${this._port}`);
			console.log(`🔌 Socket.IO server is ready`);
		});
	}

	private setupSocket(): void {
		// Initialize the SocketManager singleton with our IO instance
		SocketManager.getInstance().initialize(this.io);

		// Setup connection events
		this.io.on('connection', SocketEvents.setupEvents);
	}
}
