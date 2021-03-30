import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { inMemoryStore } from "./in-memory";

export const getTestMongo = async (): Promise<MongoConnection> => {
  const mongo = new MongoConnection({
    type: MongoConnectionType.MEMORY,
    auth: { user: "user", password: "password" },
    url: { host: "host", port: 1234 },
    databaseName: "databaseName",
    inMemoryStore,
  });
  await mongo.connect();
  return mongo;
};
