import { UserRepository } from '@/domain/repositories/user.respository';
import { RegisterUser } from '@/domain/use-cases/user/get-all-user.use-case';

import { ResponseFactory } from '../utils/response-factory';

import { Request, Response } from 'express';

export class UserController {
	constructor(private readonly userRepository: UserRepository) {}

	getUsers = async (_req: Request, res: Response) => {
		const newUser = await new RegisterUser(this.userRepository).execute();

		res.status(200).json(ResponseFactory.success(newUser, 'Users retrieved successfully.'));
	};
}
