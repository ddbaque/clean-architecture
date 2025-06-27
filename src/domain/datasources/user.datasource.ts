import { User } from "../entities";

export interface UserDatasource {
  getAllUsers(): Promise<Array<User>>;
}
