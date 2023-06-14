import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { OnlyPrivateInterceptor } from 'src/common/interceptors/only.private.interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';

@Controller('visitor')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@ApiTags('Visitor API')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Get(':id')
  @ApiOperation({ summary: '블로그 글 방문' })
  async visitBlog(@CurrentUser() user: UserDto, @Param('id') blog_id: string) {
    return await this.visitorService.visitBlog(user.id, blog_id);
  }
}
