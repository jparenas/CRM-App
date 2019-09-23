import "module-alias/register";
import path from "path";
import { config } from "dotenv";
config({
  path: path.resolve(__dirname, "../../../../.env")
});

module.exports = {
  client: "pg",
  connection: {
    host: process.env.NODE_POSTGRES_HOST,
    user: process.env.NODE_POSTGRES_USER,
    password: process.env.NODE_POSTGRES_PASSWORD,
    database: process.env.NODE_POSTGRES_DB
  },
  migrations: {
    directory: path.resolve(__dirname, "../db/migrations"),
    extension: "ts",
    tableName: "migrations"
  },
  seeds: {
    directory: path.resolve(__dirname, "../db/seeds")
  }
};
