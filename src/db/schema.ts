import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  email: text('email').notNull(),
  walletAddress: text('address').notNull(),
  physicalAddress: text('physical_address'),
  fullName: text('full_name'),
  userName: text('user_name'),
  identityNumber: text('identity_number'),
  identityFile: text('identity_file'),
  apiKey: text('api_key'),
  apiSecret: text('api_secret'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bankAccounts = sqliteTable('bank_accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  bankId: integer('bank_id').references(() => banks.id).notNull(),
  accountNumber: text('account_number').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const banks = sqliteTable('banks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  name: text('name').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});