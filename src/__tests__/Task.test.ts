import request from "supertest";
import { ConnectionOptions, createConnection, getConnection } from "typeorm";
import { createDatabase, dropDatabase } from "typeorm-extension";

import { app } from "../app";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "test:todo-api",
  entities: ["src/data/entity/*.ts"],
  migrationsTableName: "migrations",
  migrations: ["src/data/migrations/*.ts"],
  cli: {
    migrationsDir: "src/data/migrations",
  },
  synchronize: true,
};
describe("Tasks", () => {
  beforeAll(async () => {
    await createDatabase({ ifNotExist: true }, connectionOptions);
    const connection = await createConnection(connectionOptions);
    await connection.runMigrations();
  });

  afterAll(async () => {
    const conn = getConnection();
    await conn.close();
    await dropDatabase({ ifExist: true }, connectionOptions);
  });

  it("should be able to add a new task", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Title",
      description: "Description",
      status: "Done",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
