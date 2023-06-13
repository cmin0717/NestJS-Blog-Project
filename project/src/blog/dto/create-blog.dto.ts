import { PickType } from '@nestjs/swagger';
import { BlogEntity } from '../entities/blog.entity';

export class CreateBlogDto extends PickType(BlogEntity, [
  'title',
  'description',
  'context',
] as const) {}
