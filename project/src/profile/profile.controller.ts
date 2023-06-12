import { OnlyPrivateInterceptor } from './../common/interceptors/only.private.interceptor';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  Get,
  Body,
  Post,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/users/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
import { UserDto } from 'src/users/dtos/user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@UseInterceptors(OnlyPrivateInterceptor)
@ApiTags('Profile API')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async findUserProfile(@CurrentUser() user: UserDto) {
    return await this.profileService.findProfile(user.id);
  }

  @Post()
  async createUserProfile(
    @CurrentUser() user: UserDto,
    @Body() body: CreateProfileDto,
  ) {
    return await this.profileService.create(user.id, body);
  }
}
