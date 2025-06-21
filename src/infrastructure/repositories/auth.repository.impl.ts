import {
  AuthDatasource,
  AuthRepository,
  RegisterUserDto,
  User,
} from "@/domain";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) { }

  register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.datasource.register(registerUserDto);
  }
}
