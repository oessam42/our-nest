import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const items = sqliteTable('items', { id: text('id').primaryKey(), data: text('data').notNull() });
