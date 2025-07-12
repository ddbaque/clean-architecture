import { GetUserDto } from '../dtos/user';
import { User } from '../entities';

export interface UserRepository {
	getAllUser(): Promise<Array<User>>;
	getUser(getUserDto: GetUserDto): Promise<User>;
}
