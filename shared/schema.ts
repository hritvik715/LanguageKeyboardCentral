import { pgTable, text, serial, integer, boolean, doublePrecision, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Product Category Enum
export const productCategories = ["keyboard", "display_combo", "accessory"] as const;
export type ProductCategory = typeof productCategories[number];

// Language Support Enum
export const languageCodes = ["hi", "bn", "ta", "te", "kn", "ml", "pa", "mr", "gu", "ur", "or"] as const;
export type LanguageCode = typeof languageCodes[number];

// Product Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in INR (paisas)
  category: text("category").notNull(), // One of productCategories
  imageUrl: text("image_url").notNull(),
  rating: doublePrecision("rating").notNull().default(5.0),
  reviewCount: integer("review_count").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  languagesSupported: text("languages_supported").array().notNull(), // Array of languageCodes
});

// Product Insert Schema
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Language Table
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // Language code (e.g. "hi" for Hindi)
  name: text("name").notNull(), // Language name (e.g. "Hindi")
  nativeName: text("native_name").notNull(), // Language name in native script
  description: text("description").notNull(), // Short description
});

// Language Insert Schema
export const insertLanguageSchema = createInsertSchema(languages).omit({
  id: true,
});

// Cart Items Table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

// Cart Item Insert Schema
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

// Type Definitions for TypeScript
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// Define relations between tables
export const productsRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
