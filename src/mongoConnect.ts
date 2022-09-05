import { Db, MongoClient } from "mongodb";

export default async function mongoConnect(cachedDb: Db | null): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGODB_URI ?? "";

  const client = await MongoClient.connect(uri, {});

  const urlString = new URL(uri);

  const dbName = urlString.pathname.substr(1);

  const db = client.db(dbName);

  return db;
}
