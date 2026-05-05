import { pgTable, serial, varchar, integer, boolean, timestamp, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const categories = pgTable("categories", {
	id: serial().notNull(),
	name: varchar({ length: 50 }).notNull(),
	icon: varchar({ length: 10 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const crafts = pgTable("crafts", {
	id: serial().notNull(),
	name: varchar({ length: 50 }).notNull(),
	icon: varchar({ length: 10 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const fabrics = pgTable("fabrics", {
	id: serial().notNull(),
	name: varchar({ length: 50 }).notNull(),
	icon: varchar({ length: 10 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const fits = pgTable("fits", {
	id: serial().notNull(),
	name: varchar({ length: 50 }).notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const styles = pgTable("styles", {
	id: serial().notNull(),
	name: varchar({ length: 50 }).notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const tshirtColors = pgTable("tshirt_colors", {
	id: serial().notNull(),
	name: varchar({ length: 50 }).notNull(),
	colorCode: varchar("color_code", { length: 20 }),
	imageUrl: text("image_url").notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const products = pgTable("products", {
	id: serial().notNull(),
	name: varchar({ length: 200 }).notNull(),
	description: text(),
	price: integer().notNull(),
	imageUrl: text("image_url"),
	categoryId: integer("category_id"),
	fabricId: integer("fabric_id"),
	craftId: integer("craft_id"),
	fitId: integer("fit_id"),
	styleId: integer("style_id"),
	isActive: boolean("is_active").default(true),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	detailImages: text("detail_images"),
	videos: text(),
	photos: text(),
});

export const sizes = pgTable("sizes", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 20 }).notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});
