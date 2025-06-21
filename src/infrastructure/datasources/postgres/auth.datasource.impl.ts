import { BcryptAdapter } from "@/config";
import { PostgresDatabase } from "@/data/postgres/postgres-database";
import { AuthDatasource, CustomError, RegisterUserDto, User } from "@/domain";
import { UserMapper } from "@/infrastructure/mappers";

type HashPasswordFuncion = (password: string) => string;
type ComparePasswordFuncion = (
  password: string,
  hashedPassword: string,
) => boolean;

export class AuthDataSourceImpl implements AuthDatasource {
  constructor(
    private hashPassword: HashPasswordFuncion,
    private comparePassword: ComparePasswordFuncion,
  ) { }
  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { name, email, password } = registerUserDto;

    try {
      const pool = PostgresDatabase.getPool();

      // Verificar si el correo existe
      const selectUserQuery = `SELECT * FROM "user" WHERE email = $1`;
      const values = [email];
      const res = await pool.query(selectUserQuery, values);

      if (res.rows.length > 0)
        throw CustomError.badRequest("Problem with your credentials");

      // Crear el usuario sabiendo que no hay otro con un email igual
      const createUserQuery =
        'INSERT INTO "user" (email, name, password) VALUES ($1, $2, $3) RETURNING *;';
      const hashedPassword = this.hashPassword(password);
      const createUserValues = [email, name, hashedPassword];
      const resCreatedUser = await pool.query(
        createUserQuery,
        createUserValues,
      );

      console.log(resCreatedUser.rows);

      const createdUser = resCreatedUser.rows[0];


      return Promise.resolve(UserMapper.userEntityFromObject(createdUser));
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }

      throw CustomError.internalServer();
    }
  }
}
