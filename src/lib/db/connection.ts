import { Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const defaultDbName = process.env.MONGODB_DB ?? 'ayush-ai';

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { maxPoolSize: 10 });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {
    maxPoolSize: 10,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(dbName = defaultDbName): Promise<Db> {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
}