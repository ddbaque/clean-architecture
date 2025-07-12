import { UserValidations } from '@/domain/validations/zod/user/user.validations';

export class LoginUserDto {
	private constructor(
		public email: string,
		public password: string,
	) {}

	static create(object: { [key: string]: any }): [string | undefined, LoginUserDto?] {
		const validateData = UserValidations.loginUser();

		const user = UserValidations.validate(validateData, object);

		return [undefined, new LoginUserDto(user.email, user.password)];
	}
}
