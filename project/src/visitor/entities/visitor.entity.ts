import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { BlogEntity } from 'src/blog/entities/blog.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'VISITOR' })
export class VisitorEntity extends CommonEntity {
  @IsUUID()
  @Column({ type: 'varchar', nullable: false })
  @ApiProperty({ example: '현재 유저 id' })
  user_id: string;

  @ManyToOne(() => BlogEntity, (blog: BlogEntity) => blog.visitors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blog_id', referencedColumnName: 'id' })
  blog: BlogEntity;
}
