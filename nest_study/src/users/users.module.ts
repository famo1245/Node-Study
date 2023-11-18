import { Logger, Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { EmailModule } from "../email/email.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateUserHandler } from "./handler/create-user.handler";
import { UserEventsHandler } from "./handler/user-events.handler";

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([UserEntity]), AuthModule, CqrsModule],
  controllers: [UsersController],
  providers: [Logger, UsersService, CreateUserHandler, UserEventsHandler],
})
export class UsersModule {}
