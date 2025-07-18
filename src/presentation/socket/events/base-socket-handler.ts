import { Socket } from 'socket.io';

export abstract class BaseSocketHandler {
	protected socket: Socket;

	constructor(socket: Socket) {
		this.socket = socket;
	}

	abstract setupEvents(): void;

	protected log(message: string): void {
		console.log(`🔌 [${this.socket.id}] ${message}`);
	}
}