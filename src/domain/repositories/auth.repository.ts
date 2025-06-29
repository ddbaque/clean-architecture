import { LoginUserDto, RegisterUserDto } from "../dtos";
import { User } from "../entities";

export interface AuthRepository {
  // TODO: hacer login
  //abstract login()

  register(registerUserDto: RegisterUserDto): Promise<User>;
  login(loginUserDto: LoginUserDto): Promise<User>;
}
