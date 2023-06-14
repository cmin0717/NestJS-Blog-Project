import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OnlyPrivateInterceptor } from 'src/common/interceptors/only.private.interceptor';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { TagsDto } from './dto/tag.dto';

@Controller('tag')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@ApiTags('Tag API')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '해당 태그에 속한 블로그 가져오기' })
  async findTags(@Body() tags: TagsDto) {
    return await this.tagService.findTags(tags.tags);
  }
}
