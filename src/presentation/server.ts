import { CustomError } from "@/domain";
import { ResponseFactory } from "@/presentation/utils/response-factory";
import { ApiError } from "@/domain/errors";
import express, { NextFunction, Request, Response, Router } from "express";

interface ServerOptions {
  port: number;
  routes: Router;
}

export class Server {
  public readonly app = express();
  private readonly _routes: Router;
  private readonly _port: number;

  constructor(options: ServerOptions) {
    const { port, routes } = options;
    this._port = port;
    this._routes = routes;
  }

  async start() {
    // Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Routes
    this.app.use(this._routes);

    // Global Error Handler (debe ir al final)
    this.app.use(this.errorHandler);

    this.app.listen(this._port, () => {
      console.log(`📡 Server is running on port ${this._port}`);
    });
  }

  private errorHandler = (
    err: Error | CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.log("Error caught by global handler:", err);

    if (err instanceof CustomError) {
      const apiError: ApiError = {
        code: err.code,
        message: err.message,
      };
      res.status(err.statusCode).json(ResponseFactory.error(apiError));
      return;
    }

    if (err instanceof Error) {
      if (err.name === "ValidationError") {
        const validationError = CustomError.badRequest(err.message);
        const apiError: ApiError = {
          code: validationError.code,
          message: validationError.message,
        };
        res.status(400).json(ResponseFactory.error(apiError));
        return;
      }

      if (err.name === "SyntaxError") {
        const syntaxError = CustomError.badRequest("Invalid JSON format");
        const apiError: ApiError = {
          code: syntaxError.code,
          message: syntaxError.message,
        };
        res.status(400).json(ResponseFactory.error(apiError));
        return;
      }
    }

    const genericError = CustomError.internalServer("Internal Server Error");
    const apiError: ApiError = {
      code: genericError.code,
      message: genericError.message,
    };
    res.status(500).json(ResponseFactory.error(apiError));
  };
}
