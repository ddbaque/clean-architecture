export interface SocketMessage<T = unknown> {
	remitter: string; // Quien envía el mensaje (server, user-id, system, etc.)
	event: string; // Nombre del evento (user-joined, users-updated, chat-message, etc.)
	timestamp: string; // ISO string de la fecha
	data: T; // Datos específicos del evento (genérico)
	room?: string; // Sala opcional
}

// Tipos específicos para eventos comunes
export interface ChatMessageData {
	text: string;
	username?: string;
}

export interface UserEventData {
	userId: string;
	username?: string;
}

export interface UsersUpdatedData {
	count: number;
	users?: unknown[];
}

export interface RoomEventData {
	roomName: string;
	userId: string;
}

// Enum para eventos predefinidos
export enum SocketEvents {
	CHAT_MESSAGE = 'chat-message',
	USER_JOINED = 'user-joined',
	USER_LEFT = 'user-left',
	USERS_UPDATED = 'users-updated',
	ROOM_JOINED = 'room-joined',
	ROOM_LEFT = 'room-left',
	SYSTEM_MESSAGE = 'system-message',
	ERROR = 'error',
}

// Enum para remitentes
export enum MessageRemitter {
	SERVER = 'server',
	SYSTEM = 'system',
	USER = 'user',
	API = 'api',
}
