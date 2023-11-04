import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import { validationSchema } from "./config/validationSchema";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as process from "process";
import { LoggerMiddleware } from "./logger/logger.middleware";
import { Logger2Middleware } from "./logger/logger2.middleware";
import { UsersController } from "./users/users.controller";
import { AuthModule } from "./auth/auth.module";
import authConfig from "./config/authConfig";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from "nest-winston";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./exception/http-exception.filter";
import { ExceptionModule } from "./exception/exception.module";
import { LoggingModule } from "./logger/logging.module";

// import * as process from "process";

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       envFilePath:
//         process.env.NODE_ENV === "production"
//           ? ".production.env"
//           : process.env.NODE_ENV === "stage"
//           ? ".stage.env"
//           : ".env",
//     }),
//     UsersModule,
//     EmailModule,
//   ],
//   controllers: [AppController],
//   providers: [],
// })

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    UsersModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3305,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: "test",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.DATABASE_SYNCHRONIZE === "true", // jpa 의 ddl auto 같은거
    }),
    WinstonModule.forRoot({
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
    ExceptionModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): any {
//     consumer.apply(LoggerMiddleware, Logger2Middleware).forRoutes(UsersController);
//   }
// }
