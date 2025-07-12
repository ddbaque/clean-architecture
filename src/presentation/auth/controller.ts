import { AuthRepository, CustomError, LoginUserDto, RegisterUser, RegisterUserDto } from '@/domain';
import { LoginUser } from '@/domain/use-cases/auth/login-user.use-case';

import { ResponseFactory } from '../utils/response-factory';

import { Request, Response } from 'express';

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	registerUser = async (req: Request, res: Response) => {
		const [error, registerUserDto] = RegisterUserDto.create(req.body);

		if (error) throw new CustomError(400, error);

		const user = await new RegisterUser(this.authRepository).execute(registerUserDto!);

		res.status(201).json(ResponseFactory.success(user, 'User registred successfully.'));
	};

	loginUser = async (req: Request, res: Response) => {
		const [error, loginUserDto] = LoginUserDto.create(req.body);

		if (error) throw new CustomError(400, error);

		const user = await new LoginUser(this.authRepository).execute(loginUserDto!);

		res.status(200).json(ResponseFactory.success(user, 'User logged successfully.'));
	};
}
