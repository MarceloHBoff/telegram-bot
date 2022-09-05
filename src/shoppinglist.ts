import connect from "./mongoConnect";

import { Db } from "mongodb";

let cachedDb: Db | null = null;

type ShoppingList = {
  _id: string;
  text: string;
};

export async function getList(): Promise<ShoppingList[]> {
  cachedDb = await connect(cachedDb);

  const collection = cachedDb.collection("shoppinglist");

  return await collection.find<ShoppingList>({}).toArray();
}

export async function add(text: string): Promise<void> {
  cachedDb = await connect(cachedDb);

  const collection = cachedDb.collection("shoppinglist");

  await collection.insertOne({ text });
}

export async function remove(text: string): Promise<void> {
  cachedDb = await connect(cachedDb);

  const collection = cachedDb.collection("shoppinglist");

  await collection.deleteOne({ text });
}
