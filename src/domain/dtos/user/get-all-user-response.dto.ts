import { User } from "@/domain/entities";

export class GetAllUserResponseDto {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public image?: string,
  ) { }

  static create(users: Array<User>): Array<GetAllUserResponseDto> {
    return users.map(
      (user) => new GetAllUserResponseDto(user.id, user.name, user.email),
    );
  }
}
