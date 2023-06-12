import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { UserEntity } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { UserDto } from 'src/users/dtos/user.dto';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity]), UsersModule],
  controllers: [ProfileController],
  providers: [ProfileService, UserDto, ProfileRepository],
})
export class ProfileModule {}
