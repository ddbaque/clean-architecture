import { BaseSocketHandler } from './base-socket-handler';
import { SocketManager } from '../socket-manager';
import { SocketMessage, SocketEvents, MessageRemitter, RoomEventData } from '../types/message.types';

export class RoomHandler extends BaseSocketHandler {
	setupEvents(): void {
		this.socket.on('join-room', this.handleJoinRoom.bind(this));
		this.socket.on('leave-room', this.handleLeaveRoom.bind(this));
	}

	private handleJoinRoom(room: string): void {
		this.socket.join(room);
		this.log(`Joined room: ${room}`);
		
		// Crear mensaje de usuario que se unió
		const message: SocketMessage<RoomEventData> = {
			remitter: MessageRemitter.SYSTEM,
			event: SocketEvents.USER_JOINED,
			timestamp: new Date().toISOString(),
			data: {
				roomName: room,
				userId: this.socket.id
			},
			room
		};

		// Notificar a otros usuarios en la sala
		SocketManager.getInstance().emitToRoom(room, 'message', message);
	}

	private handleLeaveRoom(room: string): void {
		this.socket.leave(room);
		this.log(`Left room: ${room}`);
		
		// Crear mensaje de usuario que se fue
		const message: SocketMessage<RoomEventData> = {
			remitter: MessageRemitter.SYSTEM,
			event: SocketEvents.USER_LEFT,
			timestamp: new Date().toISOString(),
			data: {
				roomName: room,
				userId: this.socket.id
			},
			room
		};

		// Notificar a otros usuarios en la sala
		SocketManager.getInstance().emitToRoom(room, 'message', message);
	}
}