import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

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
}
