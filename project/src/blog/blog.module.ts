import { Module, forwardRef } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { UserEntity } from 'src/users/users.entity';
import { UserDto } from 'src/users/dtos/user.dto';
import { UsersModule } from 'src/users/users.module';
import { BlogRepository } from './blog.repository';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity, UserEntity]),
    UsersModule,
    forwardRef(() => TagModule),
  ],
  controllers: [BlogController],
  providers: [BlogService, UserDto, BlogRepository],
  exports: [BlogRepository],
})
export class BlogModule {}
