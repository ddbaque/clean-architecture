import { AuthRoutes } from './auth/routes';
import { UserRoutes } from './user/routes';

import { Router } from 'express';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		router.use('/api/auth', AuthRoutes.routes);
		router.use('/api/user', UserRoutes.routes);

		return router;
	}
}
