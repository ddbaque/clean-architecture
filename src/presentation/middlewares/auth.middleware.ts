import { JwtAdapter } from "@/config/jwt";
import { PostgresDatabase } from "@/data/postgres/postgres-database";
import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
  static validateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const authorization = req.header("Authorization");
    console.log(authorization);

    if (!authorization) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    if (!authorization.startsWith("Bearer")) {
      res.status(401).json({ error: "Invalid Bearer Token" });
      return;
    }

    const token = authorization.split(" ").at(1) || "";

    try {
      // TODO:  payload de jwt adapter
      //
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      const pool = PostgresDatabase.getPool();

      const queryGetUserById = 'SELECT * FROM "user" WHERE id = $1';
      const valuesGetUserById = [payload.id];
      const resGetUserById = await pool.query(
        queryGetUserById,
        valuesGetUserById,
      );

      if (resGetUserById.rows.length === 0) {
        res.status(500).json({ error: "Internal Server Error" });
      }

      req.body.user = resGetUserById.rows[0]

      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
