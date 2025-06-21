import { PostgresDatabase } from "@/data/postgres/postgres-database";
import {
  AuthRepository,
  CustomError,
  RegisterUser,
  RegisterUserDto,
} from "@/domain";
import { Request, Response } from "express";

export class AuthController {
  constructor(private readonly authRepository: AuthRepository) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError)
      return res.status(error.statusCode).json({ error: error.message });

    console.log(error);

    return res.status(500).json({ error: "Internal Server Error" });
  };

  registerUser = (req: Request, res: Response) => {
    // Create the Data Transfer Object
    const [error, registerUserDto] = RegisterUserDto.create(req.body);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  loginUser = (_req: Request, res: Response) => {
    res.json("login");
  };

  getUsers = async (req: Request, res: Response) => {
    const pool = PostgresDatabase.getPool();
    const queryGetAllUsers = 'SELECT * FROM "user";';
    pool
      .query(queryGetAllUsers)
      .then((resGetAllUsers) =>
        res
          .status(200)
          .json({ users: resGetAllUsers.rows, user: req.body.user }),
      )
      .catch(() => res.status(500).json({ error: "Internal Server Error" }));
  };
}
