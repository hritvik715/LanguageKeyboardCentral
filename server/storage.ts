import { 
  languages, type Language, type InsertLanguage,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem
} from "@shared/schema";

// Storage interface for all our data operations
export interface IStorage {
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Language methods
  getAllLanguages(): Promise<Language[]>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  
  // Cart methods
  getCartItems(sessionId: string): Promise<CartItem[]>;
  getCartItemsWithProducts(sessionId: string): Promise<{item: CartItem, product: Product}[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private languages: Map<number, Language>;
  private cartItems: Map<number, CartItem>;
  
  private productCurrentId: number;
  private languageCurrentId: number;
  private cartItemCurrentId: number;

  constructor() {
    this.products = new Map();
    this.languages = new Map();
    this.cartItems = new Map();
    
    this.productCurrentId = 1;
    this.languageCurrentId = 1;
    this.cartItemCurrentId = 1;
    
    // Initialize with demo data
    this.initializeData();
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productCurrentId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Language methods
  async getAllLanguages(): Promise<Language[]> {
    return Array.from(this.languages.values());
  }

  async getLanguageByCode(code: string): Promise<Language | undefined> {
    return Array.from(this.languages.values()).find(
      (language) => language.code === code
    );
  }

  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const id = this.languageCurrentId++;
    const language: Language = { ...insertLanguage, id };
    this.languages.set(id, language);
    return language;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async getCartItemsWithProducts(sessionId: string): Promise<{item: CartItem, product: Product}[]> {
    const items = await this.getCartItems(sessionId);
    return items.map(item => {
      const product = this.products.get(item.productId);
      return {
        item,
        product: product!
      };
    }).filter(({product}) => product !== undefined);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item is already in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === insertCartItem.sessionId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity
      return this.updateCartItemQuantity(existingItem.id, existingItem.quantity + insertCartItem.quantity) as Promise<CartItem>;
    }

    // Add new item
    const id = this.cartItemCurrentId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId)
      .map(item => item.id);
    
    itemsToRemove.forEach(id => this.cartItems.delete(id));
    return true;
  }

  // Initialize demo data
  private initializeData() {
    // Initialize languages
    const languagesData: InsertLanguage[] = [
      { code: "hi", name: "Hindi", nativeName: "हिन्दी", description: "Most popular language" },
      { code: "bn", name: "Bengali", nativeName: "বাংলা", description: "Full character support" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்", description: "Classical language" },
      { code: "te", name: "Telugu", nativeName: "తెలుగు", description: "Complete layout" },
      { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", description: "Special edition available" },
      { code: "ml", name: "Malayalam", nativeName: "മലയാളം", description: "Premium layout" },
      { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", description: "Gurumukhi script" },
      { code: "mr", name: "Marathi", nativeName: "मराठी", description: "Devanagari script" },
      { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", description: "Full support" },
      { code: "ur", name: "Urdu", nativeName: "اردو", description: "Right-to-left support" },
      { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", description: "Eastern Indian language" }
    ];

    languagesData.forEach(lang => {
      this.createLanguage(lang);
    });

    // Initialize products
    const productsData: InsertProduct[] = [
      {
        name: "Hindi Keyboard Pro",
        slug: "hindi-keyboard-pro",
        description: "Mechanical keyboard with Hindi language layout and RGB lighting. Perfect for daily typing and programming.",
        price: 649900, // ₹6,499.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewCount: 124,
        inStock: true,
        isFeatured: true,
        isNewArrival: false,
        languagesSupported: ["hi", "en"]
      },
      {
        name: "Bengali Mech Keyboard",
        slug: "bengali-mech-keyboard",
        description: "Premium mechanical keyboard with Bengali character support. Features Cherry MX switches for the ultimate typing experience.",
        price: 719900, // ₹7,199.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.0,
        reviewCount: 78,
        inStock: true,
        isFeatured: true,
        isNewArrival: true,
        languagesSupported: ["bn", "en"]
      },
      {
        name: "Tamil-English Combo",
        slug: "tamil-english-combo",
        description: "Keyboard and 24\" display combo with Tamil language support. Perfect for professionals who work in dual languages.",
        price: 1199900, // ₹11,999.00
        category: "display_combo",
        imageUrl: "https://images.unsplash.com/photo-1542728928-1413d1894ed1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        reviewCount: 42,
        inStock: true,
        isFeatured: true,
        isNewArrival: false,
        languagesSupported: ["ta", "en"]
      },
      {
        name: "Kerala Special Edition",
        slug: "kerala-special-edition",
        description: "Special edition keyboard designed specifically for Malayalam typing. Features authentic Malayalam script layout.",
        price: 899900, // ₹8,999.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        reviewCount: 56,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["ml", "en"]
      },
      {
        name: "Telugu Premium Keyboard",
        slug: "telugu-premium-keyboard",
        description: "Premium mechanical keyboard with Telugu character support. Designed for professional writers and content creators.",
        price: 779900, // ₹7,799.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        reviewCount: 37,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["te", "en"]
      },
      {
        name: "Punjabi Wireless Keyboard",
        slug: "punjabi-wireless-keyboard",
        description: "Wireless mechanical keyboard with Punjabi language support. Perfect for those who need mobility without compromising on typing experience.",
        price: 599900, // ₹5,999.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.2,
        reviewCount: 23,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["pa", "en"]
      },
      {
        name: "Gujarati Display Combo",
        slug: "gujarati-display-combo",
        description: "Keyboard and display combo with Gujarati language support. Features a 27\" 4K monitor for the ultimate viewing experience.",
        price: 1249900, // ₹12,499.00
        category: "display_combo",
        imageUrl: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.4,
        reviewCount: 19,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["gu", "en"]
      },
      {
        name: "Kannada Gaming Keyboard",
        slug: "kannada-gaming-keyboard",
        description: "Mechanical gaming keyboard with Kannada language support. Features RGB lighting and programmable macros for the ultimate gaming experience.",
        price: 829900, // ₹8,299.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewCount: 31,
        inStock: true,
        isFeatured: false,
        isNewArrival: true,
        languagesSupported: ["kn", "en"]
      },
      {
        name: "Marathi Pro Keyboard",
        slug: "marathi-pro-keyboard",
        description: "Professional grade keyboard with Marathi language support. Perfect for content creators and writers.",
        price: 749900, // ₹7,499.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1561112078-7d24e04c3407?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        reviewCount: 28,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["mr", "en"]
      },
      {
        name: "Odia Classic Keyboard",
        slug: "odia-classic-keyboard",
        description: "Classic mechanical keyboard with Odia language support. Features Cherry MX Brown switches for a tactile typing experience.",
        price: 699900, // ₹6,999.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.3,
        reviewCount: 17,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["or", "en"]
      },
      {
        name: "Multi-Language Premium Combo",
        slug: "multi-language-premium-combo",
        description: "Premium keyboard and 32\" 4K display combo with support for all major Indian languages. The ultimate setup for multilingual professionals.",
        price: 1899900, // ₹18,999.00
        category: "display_combo",
        imageUrl: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewCount: 14,
        inStock: true,
        isFeatured: false,
        isNewArrival: true,
        languagesSupported: ["hi", "bn", "ta", "te", "kn", "ml", "pa", "mr", "gu", "ur", "or", "en"]
      },
      {
        name: "Urdu Wireless Keyboard",
        slug: "urdu-wireless-keyboard",
        description: "Wireless mechanical keyboard with Urdu language support and right-to-left text input capabilities.",
        price: 749900, // ₹7,499.00
        category: "keyboard",
        imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.4,
        reviewCount: 22,
        inStock: true,
        isFeatured: false,
        isNewArrival: false,
        languagesSupported: ["ur", "en"]
      }
    ];

    productsData.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();
