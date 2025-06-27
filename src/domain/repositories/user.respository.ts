import { User } from "../entities";

export interface UserRepository {
  getAllUser(): Promise<Array<User>>;
}
