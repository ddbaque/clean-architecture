import { CustomError } from "@/domain";
import { Pool } from "pg";

/**
 * Permite manejar la conexion a una base de datos PostgreSQL.
 * - Crear un Connection Pool
 * - Obtener la instancia del Connection Pool
 */
export class PostgresDatabase {
  private static _pool: Pool;

  /**
   * Crea una connection Pool para poder conectarnos a una base de datos postgres y que las conexiones sean reutilizadas en múltiples peticiones al mismo tiempo.
   * @param options - Opciones para realizar la conexión. Debe cumplir con la estructura
   * de `PostgresDatabaseOptions`.
   * Estructura esperada:
   * ```ts
   * {
   *   postgresDbName: string;
   *   postgresPort: number;
   *   postgresHost: string;
   *   postgresPassword: string;
   *   postgresUser: string;
   * }
   * ```
   */
  static async connect(options: PostgresDatabaseOptions): Promise<void> {
    const {
      postgresHost,
      postgresPassword,
      postgresPort,
      postgresUser,
      postgresDbName,
    } = options;
    try {
      this._pool = new Pool({
        user: postgresUser,
        password: postgresPassword,
        host: postgresHost,
        port: postgresPort,
        database: postgresDbName,
      });
    } catch (error) { }
  }

  /**
   * Obtiene un Pool de conexiones de una base de datos PostgreSQL, en caso de no existir lanza un Error.
  */
  static getPool(): Pool {
    if (!this._pool) throw new CustomError(500, "No Postgres Pool Connection");

    return this._pool;
  }
}
