import { MessageRemitter, SocketEvents, SocketMessage } from './types/message.types';

import { Server as SocketIOServer } from 'socket.io';

export class SocketManager {
	private static instance: SocketManager;
	private _io: SocketIOServer | null = null;

	private constructor() {}

	public static getInstance(): SocketManager {
		if (!SocketManager.instance) {
			SocketManager.instance = new SocketManager();
		}
		return SocketManager.instance;
	}

	public initialize(io: SocketIOServer): void {
		this._io = io;
	}

	public getIO(): SocketIOServer {
		if (!this._io) {
			throw new Error('Socket.IO server not initialized. Call initialize() first.');
		}
		return this._io;
	}

	// Método genérico para enviar mensajes con protocolo unificado
	public sendMessage<T = unknown>(message: SocketMessage<T>): void {
		if (this._io) {
			if (message.room) {
				this._io.to(message.room).emit('message', message);
			} else {
				this._io.emit('message', message);
			}
		}
	}

	// Método helper para crear y enviar mensajes rápidamente
	public broadcast<T = unknown>(
		event: SocketEvents | string,
		data: T,
		remitter: MessageRemitter = MessageRemitter.SERVER,
		room?: string,
	): void {
		const message: SocketMessage<T> = {
			remitter,
			event,
			timestamp: new Date().toISOString(),
			data,
			room: room ?? '',
		};
		this.sendMessage(message);
	}

	// Mantener compatibilidad con métodos anteriores (deprecated)
	public emit(event: string, data: unknown): void {
		if (this._io) {
			this._io.emit(event, data);
		}
	}

	public emitToRoom(room: string, event: string, data: unknown): void {
		if (this._io) {
			this._io.to(room).emit(event, data);
		}
	}
}
