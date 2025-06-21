import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDataSourceImpl, AuthRepositoryImpl } from "@/infrastructure";
import { BcryptAdapter } from "@/config";
import { AuthMiddleware } from "../middlewares";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const database = new AuthDataSourceImpl(
      BcryptAdapter.hash,
      BcryptAdapter.compare,
    );
    const authRepository = new AuthRepositoryImpl(database);
    const controller = new AuthController(authRepository);

    // TODO: definir todas mis routes
    router.post("/register", controller.registerUser);
    router.post("/login", controller.loginUser);
    router.get("/users", [AuthMiddleware.validateJWT], controller.getUsers);

    return router;
  }
}
