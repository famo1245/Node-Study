import { Injectable, InternalServerErrorException, UnprocessableEntityException } from "@nestjs/common";
import * as uuid from "uuid";
import { EmailService } from "../email/email.service";
import { UserInfo } from "./UserInfo";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { DataSource, Repository } from "typeorm";
import { ulid } from "ulid";

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    }

    const signupVerifyToken = uuid.v1();

    // await this.saveUser(name, email, password, signupVerifyToken);
    await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private async checkUserExists(emailAddress: string) {
    const user = await this.userRepository.findOne({
      where: { email: emailAddress },
    });
    return user !== null;
  }

  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.userRepository.save(user);
  }

  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);
      // throw new InternalServerErrorException(); // 고의로 에러 발생시키기
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러 발생시 롤백
      console.log("error!");
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 query runner는 해제 해줘야함
      await queryRunner.release();
    }
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    // 상용에는 사용하지 말 것
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // TODO
    // 1. DB에서 signupVerifyToken으로 회원 가입 처리 중인 유저가 있는지 조회 없으면 에러
    // 2. 바로 로그인을 할 수 있도록 JWT 발급
    throw new Error("Method not implemented");
  }

  async login(email: string, password: string): Promise<string> {
    // TODO
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인 없으면 에러
    // 2. JWT 발급
    throw new Error("Method not implemented");
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // TODO
    // 1. userId를 가진 사용자 존재 DB에서 확인 없으면 에러
    // 2. 조회된 데이터를 UserInfo 객체로 응답
    throw new Error("Method not implemented");
  }
}
