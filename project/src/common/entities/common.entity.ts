import { IsUUID } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// 공통의 테이블 정보
export abstract class CommonEntity {
  // id
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 생성 시간
  @CreateDateColumn({ type: 'timestamptz' })
  createTime: Date;

  // 수정 시간
  @UpdateDateColumn({ type: 'timestamptz' })
  updateTime: Date;

  // 삭제 시간( 없을 경우 null값이 들어간다. )
  // 삭제 시간을 기록하는 이유는 실제 서비스에서는 삭제 로직이 돌아가도 실제 데이터 베이스를 삭제 시키지는 않는다.
  // 복원등 여러 상황에서 사용할수있기에 물리적 삭제가 아닌 논리적 삭제를 실행한다.
  @DeleteDateColumn({ type: 'timestamptz' })
  deleteTime?: Date | null;
}
