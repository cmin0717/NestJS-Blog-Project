import { IsString, IsNotEmpty } from 'class-validator';
import { PickType, ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';

export class userLogInDto extends PickType(UserEntity, [
  'email',
  //   'password',
] as const) {
  @ApiProperty({
    example: '1234',
    description: '회원가입시 입력한 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요' })
  password: string;
}
