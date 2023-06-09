import { Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// 공통의 테이블 정보 ( 상속 시켜서 사용하기 떄문에 abstract로 선언한다. )
export abstract class CommonEntity {
  // id
  @IsUUID()
  @PrimaryGeneratedColumn('uuid') // PrimaryGeneratedColumn : 자동생성되는 ID값을 표현하는 방식
  id: string;

  // 생성 시간
  @CreateDateColumn({ type: 'timestamp' }) // CreateDateColumn : 생성 시간을 자동으로 기록한다.
  createTime: Date;

  // 수정 시간
  @UpdateDateColumn({ type: 'timestamp' }) // UpdateDateColumn : 수정 시간을 자동 기록
  updateTime: Date;

  // 삭제 시간( 없을 경우 null값이 들어간다. )
  // 삭제 시간을 기록하는 이유는 실제 서비스에서는 삭제 로직이 돌아가도 실제 데이터 베이스를 삭제 시키지는 않는다.
  // 복원등 여러 상황에서 사용할수있기에 물리적 삭제가 아닌 논리적 삭제를 실행한다.
  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' }) // DeleteDateColumn : 삭제 시간을 자동 기록
  deleteTime?: Date | null;
}
