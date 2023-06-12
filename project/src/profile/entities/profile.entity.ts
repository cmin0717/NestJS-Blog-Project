import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'PROFILES' })
export class ProfileEntity extends CommonEntity {
  @ApiProperty({ example: '프로필 소개', description: '프로필 소개' })
  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @ApiProperty({ example: '프로필 사이트', description: '프로필 사이트' })
  @Column({ type: 'varchar', nullable: true })
  site: string;
}
