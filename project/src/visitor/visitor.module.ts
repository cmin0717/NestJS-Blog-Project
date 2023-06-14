import { Module } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorController } from './visitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorEntity } from './entities/visitor.entity';
import { UserDto } from 'src/users/dtos/user.dto';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([VisitorEntity]), BlogModule],
  controllers: [VisitorController],
  providers: [VisitorService, UserDto],
})
export class VisitorModule {}
