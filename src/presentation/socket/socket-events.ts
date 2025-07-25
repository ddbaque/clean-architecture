import { ConnectionHandler } from './events/connection-handler';
import { MessageHandler } from './events/message-handler';
import { RoomHandler } from './events/room-handler';

import { Socket } from 'socket.io';

export class SocketEvents {
	static setupEvents(socket: Socket): void {
		console.log(`🔌 User connected: ${socket.id}`);

		// Initialize handlers
		const messageHandler = new MessageHandler(socket);
		const roomHandler = new RoomHandler(socket);
		const connectionHandler = new ConnectionHandler(socket);

		// Setup all events
		messageHandler.setupEvents();
		roomHandler.setupEvents();
		connectionHandler.setupEvents();
	}
}
