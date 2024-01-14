import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/command.handler/db/schema',
  out: './.drizzle',
  driver: 'mysql2',
} satisfies Config;