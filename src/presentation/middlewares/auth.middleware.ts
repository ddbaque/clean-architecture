import { JwtAdapter } from "@/config/jwt";
import { NextFunction, Request, Response } from "express";
import { CustomError } from "@/domain/errors";
import { GetUserDto } from "@/domain/dtos/user";
import { GetUser } from "@/domain/use-cases/user/get-user-by-id.use-case";
import { UserRepositoryImpl } from "@/infrastructure/repositories/user.repository.impl";
import { UserDataSourceImpl } from "@/infrastructure/datasources/postgres/";

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      const authorization = req.header("Authorization");

      // No token provided
      if (!authorization) {
        throw CustomError.unauthorized("No token provided");
      }

      // Invalid Bearer format
      if (!authorization.startsWith("Bearer")) {
        throw CustomError.unauthorized("Invalid Bearer Token");
      }

      const token = authorization.split(" ").at(1) || "";

      // Validate token
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        throw CustomError.unauthorized("Invalid token");
      }

      // Get user from database
      const [error, getUserDto] = GetUserDto.create(payload);

      if (error) {
        throw CustomError.badRequest(error);
      }

      const userDataSource = new UserDataSourceImpl();
      const userRepository = new UserRepositoryImpl(userDataSource);
      const user = await new GetUser(userRepository).execute(getUserDto!);

      // User not found in database
      if (user.count === 0) {
        throw CustomError.notFound("User not found");
      }

      // Add user to request
      req.body.user = user.user;
      next();

    } catch (error) {
      next(error);
    }
  };
}
