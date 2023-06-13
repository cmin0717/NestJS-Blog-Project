import { HttpException, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async create(id: string, createProfileDto: CreateProfileDto) {
    return await this.profileRepository.createProfile(id, createProfileDto);
  }

  async findAllProfile() {
    return await this.profileRepository.findAllProfile();
  }

  async findProfile(user_id: string) {
    const profile = await this.profileRepository.findProfile(user_id);
    if (profile) {
      return profile;
    } else {
      throw new HttpException('해당 프로필을 찾지 못했습니다.', 400);
    }
  }

  async updateProfile(user_id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findProfile(user_id);

    if (!profile) {
      throw new HttpException('프로필 생성을 먼저 해주세요', 400);
    }

    return await this.profileRepository.updateProfile(
      user_id,
      updateProfileDto,
    );
  }

  async removeProfile(user_id: string) {
    const profile = await this.profileRepository.findProfile(user_id);
    if (profile) {
      return await this.profileRepository.removeProfile(user_id, profile);
    } else {
      throw new HttpException('이미 프로필이 없어용!', 400);
    }
  }
}
