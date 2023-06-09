import { IsString, IsNotEmpty } from 'class-validator';
import { UserEntity } from '../users.entity';
import { PickType, ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto extends PickType(UserEntity, [
  'email',
  // 'password',
  'username',
] as const) {
  // password를 excloud했기에 dto에서 직접 넣어준다.
  @ApiProperty({
    example: '1234',
    description: '회원가입시 입력한 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;
}
