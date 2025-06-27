import { GetAllUserResponseDto } from "@/domain/dtos/user/get-all-user-response.dto";
import { UserRepository } from "@/domain/repositories/user.respository";

interface UserToken {
  count: number;
  users: Array<GetAllUserResponseDto>;
}

interface GetAllUsersUseCase {
  execute(): Promise<UserToken>;
}

export class RegisterUser implements GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) { }

  async execute(): Promise<UserToken> {
    const users = await this.userRepository.getAllUser();

    const responseUsers = GetAllUserResponseDto.create(users);

    const userToken: UserToken = {
      count: 2,
      users: responseUsers,
    };
    return userToken;
  }
}
