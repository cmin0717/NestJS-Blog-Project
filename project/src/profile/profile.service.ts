import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async create(id: string, createProfileDto: CreateProfileDto) {
    return await this.profileRepository.createProfile(id, createProfileDto);
  }

  findAll() {
    return `This action returns all profile`;
  }

  async findProfile(user_id: string) {
    return await this.profileRepository.findProfile(user_id);
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
