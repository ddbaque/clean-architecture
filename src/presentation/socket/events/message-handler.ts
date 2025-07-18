import { SocketManager } from '../socket-manager';
import { ChatMessageData, MessageRemitter, SocketEvents, SocketMessage } from '../types/message.types';
import { BaseSocketHandler } from './base-socket-handler';

export class MessageHandler extends BaseSocketHandler {
	setupEvents(): void {
		this.socket.on('message', this.handleMessage.bind(this));
	}

	private handleMessage(rawData: unknown): void {
		this.log(`Message received: ${JSON.stringify(rawData)}`);

		// Type guard para verificar que rawData tenga la estructura esperada
		const data = rawData as Record<string, unknown>;

		// Crear mensaje con protocolo unificado
		const message: SocketMessage<ChatMessageData> = {
			remitter: MessageRemitter.USER,
			event: SocketEvents.CHAT_MESSAGE,
			timestamp: new Date().toISOString(),
			data: {
				text: (data.text as string) || String(rawData),
				username: (data.username as string) || `User-${this.socket.id.substring(0, 6)}`,
			},
			room: data.room as string,
		};

		// Broadcast usando el protocolo unificado
		if (message.room) {
			SocketManager.getInstance().emitToRoom(message.room, 'message', message);
		} else {
			SocketManager.getInstance().emit('message', message);
		}
	}
}
