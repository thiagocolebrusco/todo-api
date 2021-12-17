import http from "http";
import { app } from "./app";
const port = process.env.APP_PORT || "3002";
import createConnection from "./data/client";
import { ConnectionOptions, getConnectionOptions } from "typeorm";
import { createDatabase } from "typeorm-extension";

(async () => {
  if (process.env.NODE_ENV !== "test") {
    const connectionOptions: ConnectionOptions = await getConnectionOptions();

    await createDatabase({ ifNotExist: true }, connectionOptions);

    const connection = await createConnection();
    await connection.runMigrations();
  }

  const server = http.createServer(app);
  server.listen(port, () => console.log(`Server started at port ${port}`));
})();
