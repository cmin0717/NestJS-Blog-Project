import { PickType } from '@nestjs/swagger';
import { VisitorEntity } from '../entities/visitor.entity';

export class CreateVisitorDto extends PickType(VisitorEntity, [
  'user_id',
  'blog',
] as const) {}
