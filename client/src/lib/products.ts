import { Product } from "@shared/schema";

// Format price from paisas to Indian Rupees
export function formatPrice(price: number): string {
  return `₹${(price / 100).toLocaleString('en-IN')}`;
}

// Get product image placeholder if image fails to load
export function getProductImagePlaceholder(category: string): string {
  if (category === 'display_combo') {
    return 'https://images.unsplash.com/photo-1542728928-1413d1894ed1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }
  
  return 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
}

// Filter products by category
export function filterProductsByCategory(products: Product[], category: string | null): Product[] {
  if (!category || category === 'all') {
    return products;
  }
  
  return products.filter(product => product.category === category);
}

// Sort products by various criteria
export type SortOption = 'latest' | 'price-asc' | 'price-desc' | 'rating';

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sortedProducts = [...products];
  
  switch (sortOption) {
    case 'latest':
      return sortedProducts.filter(p => p.isNewArrival).concat(sortedProducts.filter(p => !p.isNewArrival));
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating - a.rating);
    default:
      return sortedProducts;
  }
}

// Get badge text for product card
export function getProductBadge(product: Product): { text: string, color: string } | null {
  if (product.isNewArrival) {
    return { text: 'New Arrival', color: 'bg-secondary' };
  }
  
  if (product.isFeatured) {
    return { text: 'Bestseller', color: 'bg-primary' };
  }
  
  if (!product.inStock) {
    return { text: 'Out of Stock', color: 'bg-gray-600' };
  }
  
  return null;
}
