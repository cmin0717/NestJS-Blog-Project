import { ApiProperty } from '@nestjs/swagger';
import { BlogEntity } from 'src/blog/entities/blog.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'TAG' })
export class TagEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ example: '여행' })
  name: string;

  @ManyToMany(() => BlogEntity, (blog) => blog.tags)
  blogs: BlogEntity[];
}
