import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { inMemoryStore } from "./in-memory";

export const getTestMongo = async (): Promise<MongoConnection> => {
  const mongo = new MongoConnection({
    auth: { user: "user", password: "password" },
    databaseName: "databaseName",
    hostname: "host",
    inMemoryStore,
    port: 1234,
    type: MongoConnectionType.MEMORY,
  });
  await mongo.connect();
  return mongo;
};
