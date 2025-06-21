import { JwtAdapter } from "@/config/jwt";
import { RegisterUserDto } from "@/domain/dtos";
import { CustomError } from "@/domain/errors";
import { AuthRepository } from "@/domain/repositories";
import { type StringValue } from "ms";

interface UserToken {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface RegisterUserUseCase {
  execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignTokenFunction = (
  payload: Object,
  duration?: StringValue | number,
) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignTokenFunction = JwtAdapter.generateToken,
  ) { }

  async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {

    const user = await this.authRepository.register(registerUserDto);

    const token = await this.signToken({ id: user.id }, "2d");

    if (!token) throw CustomError.internalServer();

    const userToken: UserToken = {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
    return userToken;
  }
}
