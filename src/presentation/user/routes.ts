import { Router } from "express";
import { UserController } from "./controller";
import { AuthMiddleware } from "../middlewares";
import { UserDataSourceImpl } from "@/infrastructure/datasources/postgres/user.datasoucer.impl";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();

    const database = new UserDataSourceImpl();
    const userRepository = new UserRepositoryImpl(database);

    const controller = new UserController(userRepository);

    router.get("/", AuthMiddleware.validateJWT, controller.getUsers);

    return router;
  }
}
