import { User, UserDatasource } from "@/domain";
import { UserRepository } from "@/domain/repositories/user.respository";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly datasource: UserDatasource) {}

  getAllUser(): Promise<Array<User>> {
    return this.datasource.getAllUsers();
  }
}
