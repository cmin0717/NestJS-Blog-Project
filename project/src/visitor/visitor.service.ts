import { Injectable } from '@nestjs/common';
import { VisitorEntity } from './entities/visitor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogRepository } from 'src/blog/blog.repository';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
    private readonly blogRepository: BlogRepository,
  ) {}

  async visitBlog(user_id: string, blog_id: string) {
    const blog = await this.blogRepository.findBlogId(blog_id);
    await this.visitorRepository.save({
      user_id,
      blog,
    });
    return blog;
  }
}
