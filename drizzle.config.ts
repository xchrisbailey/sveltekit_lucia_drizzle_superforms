import { defineConfig } from 'drizzle-kit';

import * as dotenv from 'dotenv';
dotenv.config();

const { DB_URL } = process.env;
if (!DB_URL) {
	throw new Error('DB_URL is not set in .env file');
}

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'postgresql',
	out: './migrations',
	dbCredentials: {
		url: DB_URL
	},
	verbose: true,
	strict: true
});
