import { LoginUserDto, RegisterUserDto } from "../dtos";
import { User } from "../entities";

export interface AuthDatasource {
  // TODO: hacer login
  //abstract login()

  login(loginUserDto: LoginUserDto): Promise<User>;
  register(registerUserDto: RegisterUserDto): Promise<User>;
}
