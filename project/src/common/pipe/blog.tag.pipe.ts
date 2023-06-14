import { Injectable, PipeTransform } from '@nestjs/common';
import { CreateBlogTagDto } from 'src/blog/dto/create-blog-tag.dto';
import { CreateBlogDto } from 'src/blog/dto/create-blog.dto';

@Injectable()
export class BlogTagPipe implements PipeTransform {
  transform(value: CreateBlogTagDto) {
    const blog: CreateBlogDto = { ...value };
    const tags = value.tags;
    console.log(blog, tags);
    return [blog, tags];
  }
}
