import { OnlyPrivateInterceptor } from './../common/interceptors/only.private.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { UserDto } from './dtos/user.dto';
import { UserRegisterDto } from './dtos/user-register.dto';

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
}
