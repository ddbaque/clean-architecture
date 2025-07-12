import { User, UserDatasource } from '@/domain';
import { GetUserDto } from '@/domain/dtos/user';
import { UserRepository } from '@/domain/repositories/user.respository';

export class UserRepositoryImpl implements UserRepository {
	constructor(private readonly datasource: UserDatasource) {}

	getUser(getUserDto: GetUserDto): Promise<User> {
		return this.datasource.getUser(getUserDto);
	}

	getAllUser(): Promise<Array<User>> {
		return this.datasource.getAllUsers();
	}
}
