import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { TagEntity } from 'src/tag/entities/tag.entity';
import { UserEntity } from 'src/users/users.entity';
import { VisitorEntity } from 'src/visitor/entities/visitor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'BLOGS' })
export class BlogEntity extends CommonEntity {
  @ApiProperty({ example: 'nset study', description: '타이틀', required: true })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({ example: '요약', description: '요약' })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({ example: '어쩌구 저쩌구,,,', description: '블로그 내용' })
  @Column({ type: 'text', nullable: true })
  context: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.blogs, {
    // onDelete: 'CASCADE' 옵션을 주었기에 해당 엔티티가 삭제시 관계있는 user의 blogs에서 자동 삭제 된다.
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'author', referencedColumnName: 'id' })
  author: UserEntity;

  @OneToMany(() => VisitorEntity, (visitor: VisitorEntity) => visitor.blog, {
    cascade: true,
  })
  visitors: VisitorEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.blogs)
  @JoinTable({
    name: 'Blog-Tag',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: TagEntity[];
}
