import { UserValidations } from '@/domain/validations/zod/user/user.validations';

export class RegisterUserDto {
	private constructor(
		public name: string,
		public email: string,
		public password: string,
	) {}

	static create(object: { [key: string]: any }): [string | undefined, RegisterUserDto?] {
		const user = UserValidations.validate(UserValidations.registerUser(), object);

		return [undefined, new RegisterUserDto(user.name, user.email, user.password)];
	}
}
