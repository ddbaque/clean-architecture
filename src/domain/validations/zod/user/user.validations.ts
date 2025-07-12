// domain/validations/user.validations.ts
import { z } from 'zod';

export class UserValidations {
	// Validaciones base como propiedades estáticas privadas
	private static readonly _name = z
		.string()
		.min(1, 'Name is required')
		.min(2, 'Name must be at least 2 characters')
		.max(50, 'Name must be less than 50 characters')
		.regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Name can only contain letters and spaces');

	private static readonly _email = z
		.string()
		.min(1, 'Email is required')
		.email('Invalid email format')
		.max(100, 'Email must be less than 100 characters');

	private static readonly _password = z
		.string()
		.min(1, 'Password is required')
		.min(8, 'Password must be at least 8 characters')
		.max(100, 'Password must be less than 100 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Password must contain at least one lowercase, one uppercase and one number',
		);

	private static readonly _id = z
		.string()
		.uuid('Invalid user ID format')
		.or(z.number().int().positive('User ID must be a positive integer'));

	// Getters para acceder a las validaciones base (si necesitas reutilizarlas)
	static get name() {
		return this._name;
	}
	static get email() {
		return this._email;
	}
	static get password() {
		return this._password;
	}
	static get id() {
		return this._id;
	}

	// Esquemas compuestos como métodos estáticos
	static registerUser() {
		return z.object({
			name: this._name,
			email: this._email,
			password: this._password,
		});
	}

	static loginUser() {
		return z.object({
			email: this._email,
			password: this._password,
		});
	}

	static getUserById() {
		return z.object({
			id: this._id,
		});
	}

	static updateUser() {
		return z
			.object({
				id: this._id,
				name: this._name.optional(),
				email: this._email.optional(),
			})
			.refine((data) => data.name || data.email, {
				message: 'At least one field (name or email) must be provided',
			});
	}

	// Método para validar datos dinámicamente
	static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
		return schema.parse(data);
	}

	// Método para validación segura
	static safeParse<T>(schema: z.ZodSchema<T>, data: unknown): z.SafeParseReturnType<unknown, T> {
		return schema.safeParse(data);
	}
}
