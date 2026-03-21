import { pgTable, serial, timestamp, varchar, integer, text, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 系统健康检查表（保留，禁止删除）
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// ==================== 基础分类表 ====================

// 产品分类表：POLO衫、T恤、卫衣等
export const categories = pgTable("categories", {
	id: serial().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	icon: varchar("icon", { length: 10 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// 布料类型表：纯棉、纯涤、棉涤混纺
export const fabrics = pgTable("fabrics", {
	id: serial().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	icon: varchar("icon", { length: 10 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// 工艺类型表：印刷、刺绣
export const crafts = pgTable("crafts", {
	id: serial().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	icon: varchar("icon", { length: 10 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// 版型表：修身、常规、宽松
export const fits = pgTable("fits", {
	id: serial().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// 款式表：短袖、长袖、套头
export const styles = pgTable("styles", {
	id: serial().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ==================== T恤颜色图片表 ====================

// T恤颜色图片表：白色、黑色、藏青等
export const tshirtColors = pgTable("tshirt_colors", {
	id: serial().notNull(),
	name: varchar("name", { length: 50 }).notNull(),
	colorCode: varchar("color_code", { length: 20 }),
	imageUrl: text("image_url").notNull(),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

// ==================== 产品表 ====================

// 产品表
export const products = pgTable("products", {
	id: serial().notNull(),
	name: varchar("name", { length: 200 }).notNull(),
	description: text("description"),
	price: integer("price").notNull(), // 单位：分
	imageUrl: text("image_url"),
	
	// 关联分类
	categoryId: integer("category_id"),
	fabricId: integer("fabric_id"),
	craftId: integer("craft_id"),
	fitId: integer("fit_id"),
	styleId: integer("style_id"),
	
	// 状态
	isActive: boolean("is_active").default(true),
	sortOrder: integer("sort_order").default(0),
	
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});
