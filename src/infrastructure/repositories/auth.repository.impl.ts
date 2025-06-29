import {
  AuthDatasource,
  AuthRepository,
  LoginUserDto,
  RegisterUserDto,
  User,
} from "@/domain";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) { }

  login(loginUserDto: LoginUserDto): Promise<User> {
    return this.datasource.login(loginUserDto)
  }

  register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.datasource.register(registerUserDto);
  }
}
