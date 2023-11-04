import { Controller, Get } from "@nestjs/common";
import * as process from "process";

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return "Hello";
  }
}
