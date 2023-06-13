import { OnlyPrivateInterceptor } from './../common/interceptors/only.private.interceptor';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Body,
  Post,
  Patch,
  Delete,
  HttpException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@ApiTags('Profile API')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: '현재 유저의 프로필 정보' })
  async findUserProfile(@CurrentUser() user: UserDto) {
    return await this.profileService.findProfile(user.id);
  }

  @Post()
  @ApiOperation({ summary: '프로필 생성' })
  async createUserProfile(
    @CurrentUser() user: UserDto,
    @Body() body: CreateProfileDto,
  ) {
    return await this.profileService.create(user.id, body);
  }

  @Get('all')
  @ApiOperation({ summary: '모든 유저의 프로필 정보' })
  async findAllProfile() {
    return await this.profileService.findAllProfile();
  }

  @Patch('update')
  @ApiOperation({ summary: '현재 유저 프로필 수정' })
  async updateProfile(
    @CurrentUser() user: UserDto,
    @Body() info: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(user.id, info);
  }

  @Delete('delete')
  @ApiOperation({ summary: '프로필 삭제' })
  async deleteProfile(@CurrentUser() user: UserDto) {
    await this.profileService.removeProfile(user.id);
    return '프로필 삭제 완료';
  }
}
