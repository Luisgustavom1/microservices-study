import { MongoClient, Db, Collection } from 'mongodb';
import { Transaction } from '../models/Transaction';
import { Account } from '@query.handler/models/Account';

interface Collections { 
  transaction?: Collection<Transaction>
  account?: Collection<Account>
} 

export const collections: Collections = {}

export async function connectToReadDB() {
  const MONGO_HOST = process.env.READ_DATABASE_HOST;
  const MONGO_USERNAME = process.env.READ_DATABASE_USERNAME;
  const MONGO_PASSWORD = process.env.READ_DATABASE_PASSWORD;
  const MONGO_TIMEOUT = 2000;

  const client: MongoClient = new MongoClient(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/?directConnection=true&serverSelectionTimeoutMS=${MONGO_TIMEOUT}`);
          
  await client.connect();
      
  const db: Db = client.db(process.env.READ_DATABASE_NAME);
 
  const transactionCollection: Collection<Transaction> = db.collection(Transaction.name);
  const accountCollection: Collection<Account> = db.collection(Account.name);

  collections.transaction = transactionCollection;
  collections.account = accountCollection;
     
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${transactionCollection.collectionName}, ${accountCollection.collectionName}`);
}