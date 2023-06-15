import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BlogEntity } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UserEntity } from 'src/users/users.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tagService: TagService,
  ) {}

  async create(user_id: string, bloginfo: CreateBlogDto, tags: string[]) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        // relations: { blogs: true },
      });

      const tag_list = await this.tagService.createTags(tags);

      // user의 blogs에 cascade옵션을 설정했기에 blog에 저장하면 자동으로 user의 blogs컬럼에 추가된다.
      // blog의 fk을 설정할때는 위에처럼 관계형을 빼고 가져와야한다.
      const blog = await this.blogRepository.save({
        ...bloginfo,
        author: user,
        tags: tag_list,
      });
      // await this.userRepository.save(user);
      return blog;
    } catch (error) {
      throw new HttpException('블로그 글 생성 오류', 400);
    }
  }

  async findAllBlog() {
    try {
      return await this.blogRepository.find({ relations: { author: true } });
    } catch (error) {
      throw new HttpException('블로그 글 가져오기 실패', 400);
    }
  }

  async findBlog(user_id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: { blogs: true },
      });
      return user.blogs;
    } catch (error) {
      throw new HttpException('해당 유저 글 가져오기 실패', 400);
    }
  }

  async updateBlog(
    user_id: string,
    blog_id: string,
    updateinfo: UpdateBlogDto,
    tags: string[],
  ) {
    try {
      let blog = await this.blogRepository.findOne({
        where: { id: blog_id },
        relations: { author: true },
      });
      if (!blog) {
        throw new HttpException('해당 블로그가 존재하지 않습니다.', 400);
      }

      if (blog.author.id !== user_id) {
        throw new HttpException('작성자만 접근할수있습니다.', 400);
      }

      const tag_list = await this.tagService.createTags(tags);

      blog = { ...blog, ...updateinfo, tags: tag_list };
      await this.blogRepository.save(blog);
      return blog;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async removeBlog(user_id: string, blog_id: string) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id: blog_id },
        relations: { author: true },
      });
      if (!blog) {
        throw new HttpException('해당 블로그가 존재하지 않습니다.', 400);
      }

      if (blog.author.id !== user_id) {
        throw new HttpException('작성자만 접근할수 있습니다.', 400);
      }
      await this.blogRepository.delete({ id: blog_id });
      return '정상적으로 삭제되었습니다.';
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findBlogId(blog_id: string) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id: blog_id },
        relations: { visitors: true },
      });

      if (blog) {
        return blog;
      } else {
        throw new HttpException('해당 블로그가 존재하지 않습니다.', 400);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // cascade가 적용된 상태에서 또 저장하면 무한 루프에 빠진다.
  // async saveBlog(blog: BlogEntity) {
  //   try {
  //     return await this.blogRepository.save(blog);
  //   } catch (error) {
  //     throw new HttpException('블로그 저장 실패', 400);
  //   }
  // }

  async findVisitor(blog_id: string) {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id: blog_id },
        relations: { visitors: true },
      });
      return blog.visitors;
    } catch (error) {
      throw new HttpException('DB 접근 오류', 400);
    }
  }
}
