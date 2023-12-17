import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { BadRequestException } from "@nestjs/common";
import { NotIn } from "../../../decorator/not-in";

export class CreateUserDto {
  // trim() 메서드가 처리하지 못하는 공백 있음
  @Transform((params) => params.value.trim())
  @NotIn("password", { message: "password는 name과 같은 문자열을 포함할 수 없습니다." })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException("password는 name과 같은 문자열을 포함할 수 없습니다.");
  //   }
  //
  //   return value.trim();
  // })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
