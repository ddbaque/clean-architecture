import { envs } from "./config/envs";
import { PostgresDatabase } from "./data/postgres/postgres-database";
import { Server } from "./presentation"
import { AppRoutes } from "./presentation/routes";

(() => {
  main()
})()

async function main() {

  await PostgresDatabase.connect({
    postgresDbName: envs.POSTGRES_DB_NAME,
    postgresPort: 5432,
    postgresHost: envs.POSTGRES_HOST,
    postgresPassword: envs.POSTGRES_PASSWORD,
    postgresUser: envs.POSTGRES_USER
  })

  const server = new Server({ port: 9090, routes: AppRoutes.routes })
  server.start();
}
