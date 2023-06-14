import { HttpException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogRepository } from './blog.repository';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async createBlog(
    user_id: string,
    createBlogDto: CreateBlogDto,
    tags: string[],
  ) {
    return await this.blogRepository.create(user_id, createBlogDto, tags);
  }

  async findAllBlog() {
    const blogs = await this.blogRepository.findAllBlog();

    if (blogs) {
      return blogs;
    } else {
      throw new HttpException('블로그 글이 존재하지 않습니다.', 400);
    }
  }

  async findBlog(user_id: string) {
    const blogs = await this.blogRepository.findBlog(user_id);

    if (blogs) {
      return blogs;
    } else {
      throw new HttpException('해당 유저의 글이 존재 하지 않습니다', 400);
    }
  }

  async updateBlog(
    blog_id: string,
    updateBlogDto: UpdateBlogDto,
    tags: string[],
  ) {
    return await this.blogRepository.updateBlog(blog_id, updateBlogDto, tags);
  }

  async removeBlog(blog_id: string) {
    return await this.blogRepository.removeBlog(blog_id);
  }

  async findVisitor(blog_id: string) {
    const visitors = await this.blogRepository.findVisitor(blog_id);
    if (visitors.length !== 0) {
      return visitors;
    } else {
      throw new HttpException('방문자가 없습니다.', 400);
    }
  }
}
