import { GetUserDto } from "@/domain/dtos/user";
import { UserRepository } from "@/domain/repositories/user.respository";

interface UserCount {
  count: number;
  user: {
    id: number,
    name: string,
    email: string,
  };
}

interface GetUserUseCase {
  execute(getUserDto: GetUserDto): Promise<UserCount>;
}

export class GetUser implements GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(getUserDto: GetUserDto): Promise<UserCount> {

    const user = await this.userRepository.getUser(getUserDto)

    const userToken: UserCount = {
      count: 2,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
    };
    return userToken;
  }
}
