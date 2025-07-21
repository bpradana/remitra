import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').notNull(),
    email: text('email').notNull(),
    address: text('address').notNull(),
    userName: text('user_name'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const providers = sqliteTable('providers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const kycs = sqliteTable('kycs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').references(() => users.id),
    userIdNumber: text('user_id_number').notNull(),
    providerId: text('provider_id').references(() => providers.id),
    status: text('status').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const banks = sqliteTable('banks', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const bankAccounts = sqliteTable('bank_accounts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: text('user_id').references(() => users.id),
    bankId: text('bank_id').references(() => banks.id),
    accountNumber: text('account_number').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});