import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const customPrompts=sqliteTable('custom_prompts',{
 id:text('id').primaryKey(),
 payload:text('payload').notNull(),
 createdAt:text('created_at').notNull()
});
