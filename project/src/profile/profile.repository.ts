import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Not } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UserEntity } from 'src/users/users.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createProfile(user_id: string, info: CreateProfileDto) {
    // 이렇게 두개의 테이블에 테이터를 저장시에는 Transaction를 사용하여 데이터의 안정성을 높여줄수도있다.
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: { profile_id: true },
      });
      if (user.profile_id) {
        throw new HttpException('이미 프로필이 존재합니다.', 400);
      }
      const profile = await this.profileRepository.save({ ...info });
      user.profile_id = profile;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findProfile(user_id: string) {
    try {
      const user = await this.userRepository.findOne({
        // 관계된 데이터를 가져오고 싶을경우에는 relations를 사용하여 어떤 필드를 가져올지 명시해주어야한다.
        // 명시하지 않으면 원해 user정보만 넘어오게 된다.
        relations: ['profile_id'],
        where: { id: user_id },
      });
      return user.profile_id;
    } catch (error) {
      throw new HttpException('해당 유저를 찾지 못했습니다.', 400);
    }
  }

  async findAllProfile() {
    try {
      const profiles = await this.userRepository.find({
        relations: ['profile_id'],
        // where 조건에 해당 컬럼에 값이 Not(IsNull())인 값을 가져온다.
        where: { profile_id: Not(IsNull()) },
      });

      return profiles.map((info) => {
        return { userId: info.id, profile: info.profile_id };
      });
    } catch (error) {
      throw new HttpException('프로필을 가져오는데 오류 발생', 400);
    }
  }

  async updateProfile(user_id: string, updateProfile: UpdateProfileDto) {
    try {
      const user = await this.userRepository.findOne({
        relations: ['profile_id'],
        where: { id: user_id },
      });
      user.profile_id = { ...user.profile_id, ...updateProfile };
      return await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException('프로필 수정 오류', 400);
    }
  }

  async removeProfile(user_id: string, profile: ProfileEntity) {
    try {
      const user = await this.userRepository.findOne({
        relations: { profile_id: true },
        where: { id: user_id },
      });
      // 자식 엔티티를 삭제할때는 해당 엔티티와 관계가 있는 컬럼을 null로 변경해준다.(undefinde x null O)
      user.profile_id = null;
      await this.userRepository.save(user);
      // 관계에 있는 엔티티의 FK를 먼저 null로 바꾸고 삭제해 주어야한다.
      await this.profileRepository.delete({ id: profile.id });
    } catch (error) {
      throw new HttpException('프로필 삭제 오류', 400);
    }
  }
}

// Transaction를 이용한 데이터베이스 롤백
// 한 작업에서 여러 데이터 베이스를 수정할때 한쪽은 정상 수정되었지만 한쪽은 오류를 발생시켰다면
// 작업은 중단되지만 정상 변경된 데이터 베이스는 값이 바뀐후라서 문제가 될수있다.
// 그렇기에 둘다 정상 처리 되어야만 데이터 베이스에 커밋되게 해야한다.

// 이런 형태로 진행된다.
// @Injectable()
// export class UsersRepository {
//   constructor(
//     @InjectRepository(UserEntity)
//     private readonly userentity: Repository<UserEntity>,
//   ) {}

//   async findUser(email: string) {
//     await this.userentity.queryRunner.startTransaction(); // Transaction의 시작점
//     try {
//       const user = await this.userentity.findOne({ where: { email } });
//       await this.userentity.queryRunner.commitTransaction(); // Transaction의 커밋
//       return user;
//     } catch (error) {
//       await this.userentity.queryRunner.rollbackTransaction(); // Transaction의 롤백(오류 발생시 시작점으로 롤백한다.)
//       throw new HttpException('DB 오류!', 400);
//     } finally {
//       await this.userentity.queryRunner.release(); // 생성된 데이터베이스 연결을 끊어준다.
//                                            // 데이터 베이스는 한정된 연결만 가능함으로 Transaction으로 연결했으면 작업후 꼭 끊어주어야한다.(쌓이지 않게)
//     }
//   }
