import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, connection } from '.';

const doMigrate = async  () => {
  try {
    await migrate(db, { migrationsFolder: './.drizzle' });
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.log("migration error: ", error);
    process.exit(0);
  }
}

doMigrate()