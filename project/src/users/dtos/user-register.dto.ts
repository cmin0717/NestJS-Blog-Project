import { UserEntity } from '../users.entity';
import { PickType } from '@nestjs/swagger';

export class UserRegisterDto extends PickType(UserEntity, [
  'email',
  'password',
  'username',
] as const) {}
