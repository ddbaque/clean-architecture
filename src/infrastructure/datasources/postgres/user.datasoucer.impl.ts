import { PostgresDatabase } from "@/data/postgres/postgres-database";
import { CustomError, User, UserDatasource } from "@/domain";
import { UserMapper } from "@/infrastructure/mappers";

export class UserDataSourceImpl implements UserDatasource {
  constructor() { }
  async getAllUsers(): Promise<Array<User>> {
    try {
      const pool = PostgresDatabase.getPool();

      const queryGetAllUsers = 'SELECT * FROM "user";';

      const resGetAllUsers = await pool.query(queryGetAllUsers)

      console.log('resGetAllUsers', resGetAllUsers)

      return Promise.resolve(UserMapper.userArrayEntityFromObject(resGetAllUsers.rows))

    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }
}
