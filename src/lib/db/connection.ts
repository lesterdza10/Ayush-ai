import { Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const defaultDbName = process.env.MONGODB_DB ?? 'ayush-ai';

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable');
}

let cachedDb: Db | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, {
  maxPoolSize: 10,
});

const clientPromise = global._mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== 'production') {
  global._mongoClientPromise = clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

export async function getDb(dbName = defaultDbName): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoClient = await getMongoClient();
  cachedDb = mongoClient.db(dbName);
  return cachedDb;
}
