import { GetUserDto } from "../dtos/user";
import { User } from "../entities";

export interface UserDatasource {
  getAllUsers(): Promise<Array<User>>;
  getUser(getUserDto: GetUserDto): Promise<User>;
}
