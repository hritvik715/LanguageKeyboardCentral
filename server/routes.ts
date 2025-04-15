import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefixed with /api
  
  // Products Routes
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product details" });
    }
  });

  // Languages Routes
  app.get("/api/languages", async (req: Request, res: Response) => {
    try {
      const languages = await storage.getAllLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  app.get("/api/languages/:code", async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const language = await storage.getLanguageByCode(code);
      
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      
      res.json(language);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch language details" });
    }
  });

  // Cart Routes
  app.get("/api/cart", async (req: Request, res: Response) => {
    try {
      // In a real app, we'd use session/user ID
      // For now, just use a fixed sessionId
      const sessionId = req.headers["x-session-id"] as string || "demo-session";
      const cartItems = await storage.getCartItemsWithProducts(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart/add", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const sessionId = req.headers["x-session-id"] as string || "demo-session";
      const result = insertCartItemSchema.safeParse({ ...req.body, sessionId });
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
      }
      
      const cartItem = await storage.addToCart(result.data);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/update/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      // Validate request body
      const schema = z.object({ quantity: z.number().min(1) });
      const result = schema.safeParse({ quantity });
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request data", errors: result.error.format() });
      }
      
      const cartItem = await storage.updateCartItemQuantity(parseInt(id), quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/remove/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.removeFromCart(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart/clear", async (req: Request, res: Response) => {
    try {
      const sessionId = req.headers["x-session-id"] as string || "demo-session";
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
