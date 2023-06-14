import { ApiProperty } from '@nestjs/swagger';

export class TagsDto {
  @ApiProperty({ example: ['맛집', '액티비티', '여행'] })
  tags: string[];
}
