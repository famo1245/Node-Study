import { Logger, Module } from "@nestjs/common";
import { UsersController } from "./interface/users.controller";
import { UsersService } from "./users.service";
import { EmailModule } from "../email/email.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./infra/db/entity/user.entity";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateUserHandler } from "./application/command/create-user.handler";
import { UserEventsHandler } from "./application/event/user-events.handler";
import { GetUserInfoHandler } from "./application/query/get-user-info.handler";
import { UserFactory } from "./domain/user.factory";
import { UserRepository } from "./infra/db/repository/user.repository";
import { EmailService } from "./infra/adapter/email.service";

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule, CqrsModule],
  controllers: [UsersController],
  providers: [
    Logger,
    UsersService,
    CreateUserHandler,
    UserEventsHandler,
    GetUserInfoHandler,
    UserFactory,
    { provide: "UserRepository", useClass: UserRepository },
    { provide: "EmailService", useClass: EmailService },
  ],
})
export class UsersModule {}
