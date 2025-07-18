import { BaseSocketHandler } from './base-socket-handler';
import { SocketManager } from '../socket-manager';
import { SocketMessage, SocketEvents, MessageRemitter, ChatMessageData } from '../types/message.types';

export class MessageHandler extends BaseSocketHandler {
	setupEvents(): void {
		this.socket.on('message', this.handleMessage.bind(this));
	}

	private handleMessage(rawData: any): void {
		this.log(`Message received: ${JSON.stringify(rawData)}`);
		
		// Crear mensaje con protocolo unificado
		const message: SocketMessage<ChatMessageData> = {
			remitter: MessageRemitter.USER,
			event: SocketEvents.CHAT_MESSAGE,
			timestamp: new Date().toISOString(),
			data: {
				text: rawData.text || rawData,
				username: rawData.username || `User-${this.socket.id.substring(0, 6)}`
			},
			room: rawData.room
		};

		// Broadcast usando el protocolo unificado
		if (message.room) {
			SocketManager.getInstance().emitToRoom(message.room, 'message', message);
		} else {
			SocketManager.getInstance().emit('message', message);
		}
	}
}