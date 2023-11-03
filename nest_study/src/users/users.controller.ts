import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserInfo } from "./UserInfo";
import { VerifyEmailDto } from "./dto/verify-email.dto";
import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "../auth.guard";
import { User } from "../decorator/user.decorator";
import { UserData } from "../decorator/user-data.decorator";
import { Logger as WinstonLogger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as console from "console";

interface User {
  name: string;
  email: string;
}

@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // console.log(dto);
    this.printWinstonLog(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post("/email-verify")
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post("/login")
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get("/username")
  getUserName(@UserData("name") userName: string) {
    return userName;
  }

  // @Header('Custom', 'Test Header')
  @UseGuards(AuthGuard)
  @Get("/:id")
  async getUserInfo(@Headers() headers: any, @Param("id") userId: string, @User() user: User): Promise<UserInfo> {
    // const jwtString = headers.authorization.split("Bearer ")[1];
    // this.authService.verify(jwtString);
    // if (+userId < 1) {
    //   throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
    // }
    console.log(user);
    return this.usersService.getUserInfo(userId);
  }

  private printWinstonLog(dto: CreateUserDto) {
    console.log(dto.name);

    this.logger.error("error: ", dto);
    this.logger.warn("warn: ", dto);
    this.logger.info("info: ", dto);
    this.logger.http("http: ", dto);
    this.logger.verbose("verbose: ", dto);
    this.logger.debug("debug: ", dto);
    this.logger.silly("silly: ", dto);
  }
}
