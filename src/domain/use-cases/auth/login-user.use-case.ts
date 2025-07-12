import { JwtAdapter } from '@/config/jwt';
import { LoginUserDto, RegisterUserDto } from '@/domain/dtos';
import { CustomError } from '@/domain/errors';
import { AuthRepository } from '@/domain/repositories';

import { type StringValue } from 'ms';

interface UserToken {
	token: string;
	user: {
		id: number;
		name: string;
		email: string;
	};
}

interface LoginUserUseCase {
	execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignTokenFunction = (payload: Object, duration?: StringValue | number) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignTokenFunction = JwtAdapter.generateToken,
	) {}

	async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
		const user = await this.authRepository.login(loginUserDto);

		const token = await this.signToken({ id: user.id }, '2d');

		if (!token) throw CustomError.internalServer();

		const userToken: UserToken = {
			token: token,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		};
		return userToken;
	}
}
