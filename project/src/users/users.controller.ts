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
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
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
      res.send({ msg: '로그아웃 성공' });
    } catch (error) {
      throw new HttpException('로그아웃 실패', 400);
    }
  }
}
