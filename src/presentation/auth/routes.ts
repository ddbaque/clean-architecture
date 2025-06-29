import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDataSourceImpl, AuthRepositoryImpl } from "@/infrastructure";
import { BcryptAdapter } from "@/config";

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

    return router;
  }
}
