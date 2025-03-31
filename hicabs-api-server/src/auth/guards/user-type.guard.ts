import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RequestWithUser } from '../types/request-with-user';

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    if (!userId) {
      return false;
    }

    const user = await this.usersService.findUserById(userId);
    if (!user) {
      return false;
    }

    request.user.userType = user.userType;
    return true;
  }
}
