import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { OnlyPrivateInterceptor } from 'src/common/interceptors/only.private.interceptor';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';
// import { BlogTagPipe } from 'src/common/pipe/blog.tag.pipe';
import { CreateBlogTagDto } from './dto/create-blog-tag.dto';

@Controller('blog')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@ApiTags('Blog API')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: '블로그 글 생성' })
  async createBlog(
    @CurrentUser() user: UserDto,
    @Body() info: CreateBlogTagDto,
  ) {
    const bloginfo: CreateBlogDto = { ...info };
    const tags: string[] = info.tags;
    return await this.blogService.createBlog(user.id, bloginfo, tags);
  }

  @Get()
  @ApiOperation({ summary: '모든 유저의 블로그 글 가져오기' })
  async findAllBlog() {
    return await this.blogService.findAllBlog();
  }

  @Get('myblog')
  @ApiOperation({ summary: '해당 유저의 블로그 글 가져오기' })
  async findBlog(@CurrentUser() user: UserDto) {
    return await this.blogService.findBlog(user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '블로그 글 수정' })
  async updateBlog(
    @CurrentUser() user: UserDto,
    @Param('id') blog_id: string,
    @Body() info: CreateBlogTagDto,
  ) {
    const bloginfo: UpdateBlogDto = { ...info };
    const tags: string[] = info.tags;
    return await this.blogService.updateBlog(user.id, blog_id, bloginfo, tags);
  }

  @Delete(':id')
  @ApiOperation({ summary: '블로그 글 삭제' })
  async remove(@CurrentUser() user: UserDto, @Param('id') blog_id: string) {
    return await this.blogService.removeBlog(user.id, blog_id);
  }

  @Get('visitors:id')
  @ApiOperation({ summary: '블로그 방문자 확인' })
  async findVisitor(@Param('id') blog_id: string) {
    return await this.blogService.findVisitor(blog_id);
  }
}
