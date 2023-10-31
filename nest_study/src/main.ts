import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
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
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
