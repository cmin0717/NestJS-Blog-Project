import { CommonEntity } from '../common/entities/common.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { BlogEntity } from 'src/blog/entities/blog.entity';

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
  // Exclude 데코레이터를 사용하여 데이터를 전달할때는 password가 포함되지 않게 한다.
  @Exclude()
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

  // profile 관계성 부여 (1 대 1)
  //  @OneToOne : 첫번째 인자로는 어디 엔티티와 매핑할지, 두번째 인자는 매핑시 옵션
  @OneToOne(() => ProfileEntity, { cascade: true }) // cascade옵션을 부여하여 user에서 profile를 바꾸면 profile 테이블 정보도 바뀌게 설정
  @JoinColumn({ name: 'profile_id', referencedColumnName: 'id' })
  profile_id: ProfileEntity;

  // blog 관계성 부여 (1 대 N)
  // @OneToMany : 첫번째 인자는 어디 엔티티와 매핑할지, 두번째 인자는 매핑될 필드, 세번째는 옵션
  // ManyToOne은 반드시 사용해야하지만 1 대 N 매핑에서 @OneToMany는 사용하지 않아도 된다.
  // 유저측에서 수정시 blog값을 변경해주기 위해 cascade를 사용하기 위해서 onetomany를 사용했다.
  @OneToMany(() => BlogEntity, (blog: BlogEntity) => blog.author, {
    cascade: true,
  })
  blogs: BlogEntity[];
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

// realation의 옵션
// eager	(기본 false) : true일시 find로 엔티티를 불러올때 해당 연관 관계를 자동으로 같이 불러옴
// cascade	(기본 false) : 부모 테이블의 값이 수정이나 삭제가 발생하면, 해당 값을 참조하고 있는 자식 테이블의 역시 종속적으로 수정 및 삭제가 일어나도록 하는 옵션
// onDelete	: 엔티티가 삭제될 시 어떻게 행동할지 지정하는 옵션 가능한 값으로는 "RESTRICT" , "CASCADE" , "SET NULL" 가 있음
// nullable (기본 true) : 기본 해당 연관 관계가 nullable 한지 여부 (FK의 nullable과 동일)

// TypeORM 패턴
// - Active Record(AR) 패턴
// 레포지토리 레이어를 두지 않고 엔터티 자체에서 직접 접근하여 로직을 수행한다. 비교적 작은 서비스에 어울리는 패턴이다.
// 모든 엔터티들은 TypeORM에서 제공하는 BaseEntity를 상속하고 이 BaseEntity에는 대부분의 기본 레포지토리에서 제공하는 메서드들이 담겨있다.
// 즉 쉽게 말해 모든 엔티티는 BaseEntity를 상속받는데 BaseEntity 내부에 있는 매서드들로 데이터 베이스에 접근하여 데이터를 처리하는 방식이다.

// - Data Mapper(MR) 패턴
// 엔터티에 직접 접근하는 방식이 아닌 레포지토리 레이어를 두고 접근합니다. 유지보수성이 좋으며 큰 앱에서 더 효과적이다.
// 엔티티는 단순히 속성을 정의한것일뿐 데이터베이스에 접근하기 위해서는 각각의 엔티티에 해당하는 레포지토리를 생성후 해당 레포지토를 사용하여 접근해야 한다.

// 관리자 페이지
// admin js라는 라이브러리를 사용하여 관리자 페이지를 쉽게 만들수있다. (알고 있자)
// 하지만 mysql를 사용할때는 AR패턴으로 구성된 엔티티를 사용해야 하기에 구현은 패쓰해부렸다.
