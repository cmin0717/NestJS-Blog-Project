import { ApiProperty, PickType } from '@nestjs/swagger';
import { BlogEntity } from '../entities/blog.entity';

export class CreateBlogTagDto extends PickType(BlogEntity, [
  'title',
  'description',
  'context',
] as const) {
  @ApiProperty({
    example: ['맛집', '여행', '액티비티'],
    description: '해당 블로그 태그들',
  })
  tags: string[];
}
