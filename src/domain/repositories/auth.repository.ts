import { RegisterUserDto } from "../dtos";
import { User } from "../entities";

export interface AuthRepository {
  // TODO: hacer login
  //abstract login()

  register(registerUserDto: RegisterUserDto): Promise<User>;
}
