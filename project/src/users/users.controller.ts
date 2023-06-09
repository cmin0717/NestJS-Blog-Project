import { OnlyPrivateInterceptor } from './../common/interceptors/only.private.interceptor';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CurrentUser } from '../common/decorators/current.user.decorator';
import { UserDto } from './dtos/user.dto';
import { UserRegisterDto } from './dtos/user-register.dto';
import { userLogInDto } from './dtos/user-login.dto';
import { Response } from 'express';

@Controller('users')
@ApiTags('User API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(OnlyPrivateInterceptor)
  @ApiOperation({ summary: '현재 유저 정보' })
  async getCurrentUser(@CurrentUser() currentUser: UserDto) {
    return currentUser;
  }

  @Post()
  @ApiOperation({ summary: '회원가입' })
  async signUp(@Body() body: UserRegisterDto) {
    return this.usersService.signUp(body);
  }

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  async logIn(
    @Body() body: userLogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.logIn(body, res);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('jwt');
      res.status(200).send({ msg: '로그아웃 성공' });
    } catch (error) {
      throw new HttpException('로그아웃 실패', 400);
    }
  }
  // @Res() 와 @Res({ passthrough: true })의 차이점
  // @Res() 데코레이터로 데코레이트된 자원은 리소스 풀에 등록되고, 리소스 풀에서 해당 자원을 가져올 때마다 새 객체를 생성
  // @Res({passthrough: true}) 데코레이터로 데코레이트된 자원은 리소스 풀에 등록되고, 리소스 풀에서 해당 자원을 가져올 때마다 원본 객체를 반환
  // 각 명령마다 새로운 객체를 가져오냐 원본을 가져오냐 차이인듯하다.
  // 현재는 쿠키를 사용해야하기에 원본을 가져와야 한다. 새로운 객체를 가져오면 새로운 쿠키가 생성됨으로
}
