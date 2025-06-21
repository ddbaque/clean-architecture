import jwt from "jsonwebtoken";
import { envs } from "./envs";
import { type StringValue } from "ms";

export class JwtAdapter {
  static async generateToken(
    payload: Object,
    duration: StringValue | number = "2h",
  ): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        envs.JWT_KEY,
        { expiresIn: duration },
        (error, token) => {
          if (error) return resolve(null);

          return resolve(token!);
        },
      );
    });
  }

  static async validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) =>
      jwt.verify(token, envs.JWT_KEY, (err, decoded) => {
        if (err) return resolve(null);

        return resolve(decoded as T); // TODO: mejorar este tipado
      }),
    );
  }
}
