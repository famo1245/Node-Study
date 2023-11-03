import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { logger3 } from "./logger/logger3";
import * as process from "process";
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
    logger:
      process.env.NODE_ENV === "production" ? ["error", "warn", "log"] : ["error", "warn", "log", "verbose", "debug"],
  });
  // app.use(logger3);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
