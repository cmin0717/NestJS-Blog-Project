import { Module, forwardRef } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity]),
    forwardRef(() => BlogModule),
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
