import { MongoClient, Db, Collection } from 'mongodb';
import Transaction from './collections/transaction';

export const collections: { transaction?: Collection<Transaction> } = {}

export async function connectToReadDB() {
  const MONGO_USERNAME = process.env.READ_DATABASE_USERNAME;
  const MONGO_PASSWORD = process.env.READ_DATABASE_PASSWORD;
  const MONGO_TIMEOUT = 2000;

  const client: MongoClient = new MongoClient(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@0.0.0.0:27017/?directConnection=true&serverSelectionTimeoutMS=${MONGO_TIMEOUT}`);
          
  await client.connect();
      
  const db: Db = client.db(process.env.READ_DATABASE_NAME);
 
  const transactionCollection: Collection<Transaction> = db.collection(Transaction.name);

  collections.transaction = transactionCollection;
     
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${transactionCollection.collectionName}`);
}