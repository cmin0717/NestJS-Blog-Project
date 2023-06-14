import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { BlogEntity } from 'src/blog/entities/blog.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async createTags(tags: string[]) {
    try {
      const tag_list: TagEntity[] = [];
      for (const t of tags) {
        let tag = await this.findTag(t);
        if (!tag) {
          tag = await this.tagRepository.save({ name: t });
        }
        tag_list.push(tag);
      }
      return tag_list;
    } catch (error) {
      throw new HttpException('태그 생성 오류', 400);
    }
  }

  async findTag(tag_name: string) {
    try {
      const tag = await this.tagRepository.findOne({
        where: { name: tag_name },
      });
      return tag;
    } catch (error) {
      throw new HttpException('DB 접근 오류', 400);
    }
  }

  async findTags(tags: string[]) {
    try {
      const check = new Set();
      const blogs: BlogEntity[] = [];

      for (const tag_name of tags) {
        const exist = await this.tagRepository.exist({
          where: { name: tag_name },
        });
        if (exist) {
          const tag = await this.tagRepository.findOne({
            where: { name: tag_name },
            relations: { blogs: true },
          });
          tag.blogs.forEach((blog) => {
            if (!check.has(blog.id)) {
              blogs.push(blog);
              check.add(blog.id);
            }
          });
        }
      }
      return blogs;
    } catch (error) {
      throw new HttpException('DB 접근 오류', 400);
    }
  }
}
