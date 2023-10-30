import { Injectable } from "@nestjs/common";
import * as uuid from "uuid";
import { EmailService } from "../email/email.service";
import { UserInfo } from "./UserInfo";

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false; // TODO: DB 연동 후 구현
  }

  private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    // TODO: DB 연동 후 구현
    return;
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
