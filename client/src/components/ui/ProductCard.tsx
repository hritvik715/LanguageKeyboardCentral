import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { Product } from '@shared/schema';
import { formatPrice, getProductBadge } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { toast } = useToast();

  // Add to cart handler
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      await apiRequest('POST', '/api/cart/add', {
        productId: product.id,
        quantity: 1
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Get product badge if any
  const badge = getProductBadge(product);

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div 
        className={`product-card bg-white rounded-xl overflow-hidden shadow-md cursor-pointer ${compact ? '' : 'group'}`}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-52 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`w-full h-full object-cover ${compact ? 'group-hover:scale-110' : ''} transition-transform duration-500`}
          />
          
          {badge && (
            <div className={`absolute top-3 left-3 ${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
              {badge.text}
            </div>
          )}
          
          <motion.div 
            className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" size="icon" className="text-textColor hover:text-primary h-8 w-8 p-1" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast({
                title: "Added to wishlist",
                description: `${product.name} has been added to your wishlist.`,
              });
            }}>
              <Heart size={16} />
            </Button>
          </motion.div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-bold font-poppins text-textColor mb-1">{product.name}</h3>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center text-sm">
              <Star size={14} className="text-accent fill-accent" />
              <span className="ml-1 text-gray-600">{product.rating.toFixed(1)} ({product.reviewCount})</span>
            </div>
            <span className="mx-2 text-gray-300">|</span>
            {product.inStock ? (
              <span className="text-xs text-gray-500">In Stock</span>
            ) : (
              <span className="text-xs text-red-500">Out of Stock</span>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
            <Button
              size="sm"
              className="hover-scale bg-secondary text-white text-sm font-medium"
              onClick={handleAddToCart}
              disabled={isAddingToCart || !product.inStock}
            >
              {isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart size={14} className="mr-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
