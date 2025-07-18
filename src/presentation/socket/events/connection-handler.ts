import { BaseSocketHandler } from './base-socket-handler';

export class ConnectionHandler extends BaseSocketHandler {
	setupEvents(): void {
		this.socket.on('disconnect', this.handleDisconnect.bind(this));
	}

	private handleDisconnect(): void {
		this.log('User disconnected');
		// Aquí puedes agregar lógica adicional como limpiar datos del usuario, etc.
	}
}