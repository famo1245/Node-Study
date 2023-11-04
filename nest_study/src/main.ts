import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { logger3 } from "./logger/logger3";
import * as process from "process";
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule, utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";
// import * as dotenv from "dotenv";
// import * as path from "path";
// import * as process from "process";

// dotenv.config({
//   path: path.resolve(
//     process.env.NODE_ENV === "production"
//       ? ".production.env"
//       : process.env.NODE_ENV === "stage"
//       ? ".stage.env"
//       : ".env",
//   ),
// });

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === "production" ? "info" : "silly",
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike("MyApp", { prettyPrint: true }),
          ),
        }),
      ],
    }),
  });
  // 실행 환경에 따라 다르게 로깅
  // {
  //   logger:
  //     process.env.NODE_ENV === "production" ? ["error", "warn", "log"] : ["error", "warn", "log", "verbose", "debug"],
  // }
  // app.use(logger3);
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
