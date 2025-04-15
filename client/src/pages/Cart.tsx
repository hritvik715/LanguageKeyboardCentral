import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Trash2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';
import { formatPrice } from '@/lib/products';

type CartItemWithProduct = {
  item: {
    id: number;
    sessionId: string;
    productId: number;
    quantity: number;
  };
  product: Product;
};

export default function Cart() {
  const { toast } = useToast();
  const [updatingQuantity, setUpdatingQuantity] = useState<number | null>(null);

  // Fetch cart data with products
  const { data: cartItems, isLoading, error } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => apiRequest('DELETE', `/api/cart/remove/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => 
      apiRequest('PUT', `/api/cart/update/${itemId}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      setUpdatingQuantity(null);
      toast({
        title: "Quantity updated",
        description: "The cart has been updated successfully.",
      });
    },
    onError: () => {
      setUpdatingQuantity(null);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', '/api/cart/clear'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle quantity change
  const handleQuantityChange = (itemId: number, change: number) => {
    const cartItem = cartItems?.find(item => item.item.id === itemId);
    if (!cartItem) return;
    
    const newQuantity = Math.max(1, cartItem.item.quantity + change);
    setUpdatingQuantity(itemId);
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  // Calculate cart summary
  const subtotal = cartItems?.reduce((sum, item) => 
    sum + (item.product.price * item.item.quantity), 0) || 0;
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over ₹5,000
  const total = subtotal + shipping;

  // Handle checkout
  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Proceeding to checkout...",
    });
    // In a real application, this would redirect to a checkout page or process
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center gap-4 py-4 border-b">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 p-6 rounded-xl mb-6">
            <AlertTriangle className="mx-auto text-red-500 mb-2" size={48} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Cart</h1>
            <p className="text-gray-600 mb-6">We couldn't load your cart items. Please try again later.</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/cart'] })}>
              Retry
            </Button>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ChevronLeft className="mr-2" size={16} />
              Back to Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-md mb-6"
          >
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={80} />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/#products">
              <Button className="bg-primary text-white">Start Shopping</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold font-poppins text-textColor">Shopping Cart</h1>
            <Button 
              variant="ghost" 
              className="text-gray-500 hover:text-primary"
              onClick={() => clearCartMutation.mutate()}
              disabled={clearCartMutation.isPending}
            >
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            {cartItems.map((cartItem) => (
              <motion.div 
                key={cartItem.item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Link href={`/products/${cartItem.product.slug}`}>
                    <img 
                      src={cartItem.product.imageUrl} 
                      alt={cartItem.product.name} 
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </Link>
                  <div>
                    <Link href={`/products/${cartItem.product.slug}`}>
                      <h3 className="font-bold text-textColor hover:text-primary transition-colors">
                        {cartItem.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {formatPrice(cartItem.product.price)} each
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-l-md rounded-r-none"
                      onClick={() => handleQuantityChange(cartItem.item.id, -1)}
                      disabled={updatingQuantity === cartItem.item.id || cartItem.item.quantity <= 1}
                    >
                      -
                    </Button>
                    <div className="h-8 px-4 flex items-center justify-center border-y">
                      {updatingQuantity === cartItem.item.id ? (
                        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
                      ) : (
                        cartItem.item.quantity
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-r-md rounded-l-none"
                      onClick={() => handleQuantityChange(cartItem.item.id, 1)}
                      disabled={updatingQuantity === cartItem.item.id}
                    >
                      +
                    </Button>
                  </div>
                  
                  <div className="w-24 text-right font-bold">
                    {formatPrice(cartItem.product.price * cartItem.item.quantity)}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => removeItemMutation.mutate(cartItem.item.id)}
                    disabled={removeItemMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold font-poppins text-textColor mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-textColor">Total</span>
                  <span className="font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white" 
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Link href="/#products">
                <Button variant="outline" className="w-full">
                  <ChevronLeft className="mr-2" size={16} />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}