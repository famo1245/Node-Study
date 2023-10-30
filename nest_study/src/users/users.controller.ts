import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    // console.log(dto);
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    return;
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    console.log(dto);
    return;
  }

  // @Header('Custom', 'Test Header')
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    // if (+userId < 1) {
    //   throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
    // }
    console.log(userId);
    return;
  }
}
