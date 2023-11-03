import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3305,
  username: "root",
  password: "famo1245",
  database: "test",
  entities: [__dirname + "/**/*.entity.{js,ts}"],
  synchronize: false,
  migrationsRun: false,
  migrations: [__dirname + "/**/migrations/*.{ts,js}"],
  migrationsTableName: "migrations",
});
