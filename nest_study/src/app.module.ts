import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { EmailModule } from "./email/email.module";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import { validationSchema } from "./config/validationSchema";
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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
