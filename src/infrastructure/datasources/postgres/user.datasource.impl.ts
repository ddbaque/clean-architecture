import { PostgresDatabase } from '@/data/postgres/postgres-database';
import { CustomError, ErrorCode, User, UserDatasource } from '@/domain';
import { GetUserDto } from '@/domain/dtos/user';
import { UserMapper } from '@/infrastructure/mappers';

export class UserDataSourceImpl implements UserDatasource {
	constructor() {}
	async getUser(getUserDto: GetUserDto): Promise<User> {
		const pool = PostgresDatabase.getPool();
		const queryGetUserById = 'SELECT * FROM "user" WHERE id = $1';
		const valuesGetUserById = [getUserDto.id];
		const resGetUserById = await pool.query(queryGetUserById, valuesGetUserById);

		if (resGetUserById.rowCount === 0) throw new CustomError(404, 'User not found.', ErrorCode.NOT_FOUND);

		return Promise.resolve(UserMapper.userEntityFromObject(resGetUserById.rows[0]));
	}
	async getAllUsers(): Promise<Array<User>> {
		const pool = PostgresDatabase.getPool();

		const queryGetAllUsers = 'SELECT * FROM "user";';

		const resGetAllUsers = await pool.query(queryGetAllUsers);

		return Promise.resolve(UserMapper.userArrayEntityFromObject(resGetAllUsers.rows));
	}
}
