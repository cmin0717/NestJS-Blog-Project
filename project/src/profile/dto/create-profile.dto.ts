import { PickType } from '@nestjs/swagger';
import { ProfileEntity } from '../entities/profile.entity';
export class CreateProfileDto extends PickType(ProfileEntity, [
  'bio',
  'site',
] as const) {}
