import { UserDataSourceImpl } from '@/infrastructure/datasources/postgres/user.datasource.impl';
import { UserRepositoryImpl } from '@/infrastructure/repositories/user.repository.impl';

import { AuthMiddleware } from '../middlewares';
import { UserController } from './controller';

import { Router } from 'express';

export class UserRoutes {
	static get routes(): Router {
		const router = Router();

		const database = new UserDataSourceImpl();
		const userRepository = new UserRepositoryImpl(database);

		const controller = new UserController(userRepository);

		router.get('/', AuthMiddleware.validateJWT, controller.getUsers);

		return router;
	}
}
