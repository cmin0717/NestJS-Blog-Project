import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 테이블명 지정 (지정하지 않을경우 클래스명을 테이블명으로 설정한다.)
@Entity({ name: 'USER' })
export class UserEntity extends CommonEntity {
  // Email
  @ApiProperty({
    example: 'cyun0717@gmail.com',
    description: '회원 가입시 입력한 이메일',
    required: true,
  })
  @IsEmail({}, { message: '올바른 이메일을 입력해주십쇼!' })
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  @Column({ type: 'varchar', unique: true, nullable: false }) // column데코레이터를 사용하여 해당 컬럼의 정보를 입력해준다.
  email: string;

  // UserName
  @ApiProperty({ example: 'Capt', description: '사용자 이름', required: true })
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세여' })
  @Column({ type: 'varchar', nullable: false })
  username: string;

  // PassWord
  @ApiProperty({
    example: '1234',
    description: '회원가입시 입력한 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  // admin check
  @ApiProperty({
    example: false,
    description: '관리자 가입 유무 체크',
    required: false,
  })
  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;
}

// @Index(): 데이터베이스 테이블의 검색 속도를 향상시키기 위한 자료구조, B+ Tree 알고리즘을 사용, 책에 색인(목차)을 추가하는 것과 같음
// 단점
// 인덱스를 관리하기 위해 DB의 약 10%에 해당하는 저장공간 필요
// create, delete, update가 빈번한 속성에 index를 걸게 되면 index 크기가 커져서 오히려 성능 저하되는 역효과 발생
// 사용하면 좋은 경우
// 데이터의 중복도가 낮은 컬럼
// 규모가 작지 않은 테이블
// JOIN,WHERE 또는 ORDER BY절에서 자주 사용되는 컬럼
// 예시
// user 테이블의 id에 @Index() 사용
