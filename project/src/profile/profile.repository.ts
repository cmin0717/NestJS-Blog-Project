import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UsersRepository } from 'src/users/user.repository';
import { UserEntity } from 'src/users/users.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createProfile(user_id: string, info: CreateProfileDto) {
    const profile = await this.profileRepository.save({ ...info });
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    user.profile_id = profile;
    return await this.userRepository.save(user);
  }

  async findProfile(user_id: string) {
    const user = await this.userRepository.findOne({
      // 관계된 데이터를 가져오고 싶을경우에는 relations를 사용하여 어떤 필드를 가져올지 명시해주어야한다.
      // 명시하지 않으면 원해 user정보만 넘어오게 된다.
      relations: ['profile_id'],
      where: { id: user_id },
    });
    return user.profile_id;
  }
}
