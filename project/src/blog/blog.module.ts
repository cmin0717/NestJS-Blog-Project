import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { UserEntity } from 'src/users/users.entity';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersModule } from 'src/users/users.module';
import { BlogRepository } from './blog.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity]), UsersModule],
  controllers: [BlogController],
  providers: [BlogService, UserDto, BlogRepository],
})
export class BlogModule {}
