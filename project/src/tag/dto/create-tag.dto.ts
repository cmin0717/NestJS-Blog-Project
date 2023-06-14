import { PickType } from '@nestjs/swagger';
import { TagEntity } from '../entities/tag.entity';

export class CreateTagDto extends PickType(TagEntity, ['name'] as const) {}
