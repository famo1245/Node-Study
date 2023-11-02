import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import { validationSchema } from "./config/validationSchema";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as process from "process";
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
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    UsersModule,
    EmailModule,
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
