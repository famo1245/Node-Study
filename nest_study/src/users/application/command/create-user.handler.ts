import { Inject, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import * as uuid from "uuid";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../infra/db/entity/user.entity";
import { EmailService } from "../../../email/email.service";
import { ulid } from "ulid";
import { UserCreatedEvent } from "../../domain/user-created.event";
import { UserFactory } from "../../domain/user.factory";
import { IUserRepository } from "../../domain/iuser.repository";

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    // private dataSource: DataSource,
    // @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    // private eventBus: EventBus,
    // private emailService: EmailService,
    private userFactory: UserFactory,
    @Inject("UserRepository") private userRepository: IUserRepository,
  ) {}
  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    // const userExist = await this.checkUserExists(email);
    // if (userExist) {
    //   throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    // }
    //
    // const signupVerifyToken = uuid.v1();
    //
    // await this.saveUser(name, email, password, signupVerifyToken);
    // await this.sendMemberJoinEmail(email, signupVerifyToken);
    // this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
    // this.eventBus.publish(new TsetEvent());

    const user = await this.userRepository.findByEmail(email);
    if (user !== null) {
      throw new UnprocessableEntityException("해당 이메일로는 가입할 수 없습니다.");
    }

    const id = ulid();
    const signupVerifyToken = uuid.v1();

    await this.userRepository.save(id, name, email, password, signupVerifyToken);
    this.userFactory.create(id, name, email, password, signupVerifyToken);
  }
  // private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
  //   const user = new UserEntity();
  //   user.id = ulid();
  //   user.name = name;
  //   user.email = email;
  //   user.password = password;
  //   user.signupVerifyToken = signupVerifyToken;
  //   await this.userRepository.save(user);
  // }
  //
  // private async checkUserExists(emailAddress: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { email: emailAddress },
  //   });
  //   return user !== null;
  // }
  //
  // private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
  //   // 상용에는 사용하지 말 것
  //   await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  // }
}
