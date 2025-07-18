import { UserRepository } from '@/domain/repositories/user.respository';
import { GetAllUsers } from '@/domain/use-cases/user/get-all-user.use-case';
import { SocketManager } from '@/presentation/socket';
import { SocketEvents, MessageRemitter, UsersUpdatedData } from '@/presentation/socket/types/message.types';

import { ResponseFactory } from '../utils/response-factory';

import { Request, Response } from 'express';

export class UserController {
  constructor(private readonly userRepository: UserRepository) { }

  getUsers = async (_req: Request, res: Response) => {
    const newUser = await new GetAllUsers(this.userRepository).execute();

    // Notificar usando el protocolo unificado
    SocketManager.getInstance().broadcast<UsersUpdatedData>(
      SocketEvents.USERS_UPDATED,
      {
        count: newUser.count,
        users: newUser.users
      },
      MessageRemitter.API
    );

    res.status(200).json(ResponseFactory.success(newUser, 'Users retrieved successfully.'));
  };
}
