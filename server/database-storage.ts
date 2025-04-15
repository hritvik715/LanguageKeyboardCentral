import { 
  languages, type Language, type InsertLanguage,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isFeatured, true));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [createdProduct] = await db.insert(products).values(product).returning();
    return createdProduct;
  }

  // Language methods
  async getAllLanguages(): Promise<Language[]> {
    return await db.select().from(languages);
  }

  async getLanguageByCode(code: string): Promise<Language | undefined> {
    const [language] = await db.select().from(languages).where(eq(languages.code, code));
    return language;
  }

  async createLanguage(language: InsertLanguage): Promise<Language> {
    const [createdLanguage] = await db.insert(languages).values(language).returning();
    return createdLanguage;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async getCartItemsWithProducts(sessionId: string): Promise<{item: CartItem, product: Product}[]> {
    const items = await this.getCartItems(sessionId);
    const result: {item: CartItem, product: Product}[] = [];
    
    for (const item of items) {
      const product = await this.getProductById(item.productId);
      if (product) {
        result.push({ item, product });
      }
    }
    
    return result;
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item is already in the cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.sessionId, cartItem.sessionId),
          eq(cartItems.productId, cartItem.productId)
        )
      );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + (cartItem.quantity || 1);
      const updatedItem = await this.updateCartItemQuantity(existingItem.id, newQuantity);
      return updatedItem as CartItem;
    }

    // Add new item
    const [createdCartItem] = await db.insert(cartItems).values(cartItem).returning();
    return createdCartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return true;
  }
}