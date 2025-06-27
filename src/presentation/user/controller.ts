import { PostgresDatabase } from "@/data/postgres/postgres-database";
import { AuthRepository, CustomError } from "@/domain";
import { UserRepository } from "@/domain/repositories/user.respository";
import { RegisterUser } from "@/domain/use-cases/user/get-all-user.use-case";
import { Request, Response } from "express";

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  };

  getUsers = async (_req: Request, res: Response) => {
    new RegisterUser(this.userRepository)
      .execute()
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
}
