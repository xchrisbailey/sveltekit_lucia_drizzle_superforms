import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
