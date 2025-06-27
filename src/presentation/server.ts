import express, { Router } from "express";
import morgan from 'morgan'

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
    this.app.use(express.urlencoded());
    this.app.use(morgan('dev'))


    this.app.use(this._routes);

    this.app.listen(this._port, () => {
      console.log(`📡 Server is running on port ${this._port}`);
    });
  }
}
