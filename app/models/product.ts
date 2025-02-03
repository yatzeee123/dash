import { client } from "~/mongo.server";

let db = client.db("products");
let collection = db.collection("products");

export async function getProducts() {
  return collection.find().toArray();
}
