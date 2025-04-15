import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, ShoppingCart, Heart, Shield, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Product, Language } from '@shared/schema';
import { formatPrice } from '@/lib/products';
import { getLanguageSupportText } from '@/lib/languages';

export default function ProductDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  // Fetch languages for display
  const { data: languages } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
    enabled: !!product,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) => 
      apiRequest('POST', '/api/cart/add', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: `${product?.name} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCartMutation.mutate({
      productId: product.id,
      quantity
    });
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>
            <ChevronLeft className="mr-2" size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/#products" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
          <ChevronLeft size={16} className="mr-1" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-xl"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-xl hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-poppins text-textColor mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={18} 
                    className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-gray-300"}
                  />
                ))}
                <span className="ml-2 text-gray-600">{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-primary mb-6">{formatPrice(product.price)}</div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Languages Supported */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Languages Supported:</h3>
              <div className="flex flex-wrap gap-2">
                {product.languagesSupported.map(code => {
                  const lang = languages?.find(l => l.code === code);
                  return (
                    <span key={code} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {lang ? lang.name : code === 'en' ? 'English' : code}
                    </span>
                  );
                })}
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="w-24">
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="text-center"
                />
              </div>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                size="lg"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || !product.inStock}
              >
                {addToCartMutation.isPending ? (
                  "Adding to Cart..."
                ) : (
                  <>
                    <ShoppingCart className="mr-2" size={18} />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => {
                toast({
                  title: "Added to Wishlist",
                  description: `${product.name} has been added to your wishlist.`,
                });
              }}>
                <Heart size={20} />
              </Button>
            </div>
            
            {/* Product Highlights */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center">
                <Shield className="text-secondary mr-2" size={18} />
                <span className="text-gray-700">3-Year Warranty Protection</span>
              </div>
              <div className="flex items-center">
                <Package className="text-secondary mr-2" size={18} />
                <span className="text-gray-700">Free accessories with purchase</span>
              </div>
              <div className="flex items-center">
                <Truck className="text-secondary mr-2" size={18} />
                <span className="text-gray-700">Free shipping on orders over ₹5,000</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Product Tabs: Specifications, Features, Reviews */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="specifications">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="pt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">General</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Type</span>
                        <span className="font-medium">{product.category === 'keyboard' ? 'Mechanical Keyboard' : 'Keyboard & Display Combo'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Language Support</span>
                        <span className="font-medium">{getLanguageSupportText(product.languagesSupported)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Connection</span>
                        <span className="font-medium">Wired USB / Bluetooth 5.0</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Switch Type</span>
                        <span className="font-medium">Cherry MX Brown / Blue / Red</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-3">Physical</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Dimensions</span>
                        <span className="font-medium">44.8 cm x 13.5 cm x 3.8 cm</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-medium">1.2 kg</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Material</span>
                        <span className="font-medium">Aluminium Alloy / ABS</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Keycap Material</span>
                        <span className="font-medium">PBT Double Shot</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="pt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Key Features</h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="w-12 h-12 flex-shrink-0 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Authentic Language Support</h4>
                      <p className="text-gray-600">Every character and symbol is precisely placed for intuitive typing in your preferred language.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="w-12 h-12 flex-shrink-0 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center text-secondary mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">RGB Backlight Customization</h4>
                      <p className="text-gray-600">Customize your typing experience with 16.8 million color options and multiple lighting effects.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="w-12 h-12 flex-shrink-0 bg-accent bg-opacity-10 rounded-full flex items-center justify-center text-accent mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Hot-Swappable Switches</h4>
                      <p className="text-gray-600">Change switches without soldering for a customized typing feel and sound profile.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Customer Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < Math.floor(product.rating) ? "text-accent fill-accent" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">Based on {product.reviewCount} reviews</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Sample reviews - in a real app, these would come from an API */}
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold">Rajesh K.</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < 5 ? "text-accent fill-accent" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Verified Purchase | 2 months ago</div>
                    <p className="text-gray-700">Absolutely love this keyboard! The Hindi layout is perfect for my daily work and the typing experience is exceptional. The build quality feels premium and the RGB lighting looks stunning.</p>
                  </div>
                  
                  <div className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold">Priya M.</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < 4 ? "text-accent fill-accent" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Verified Purchase | 3 weeks ago</div>
                    <p className="text-gray-700">Great keyboard with excellent language support. The keys have good tactile feedback and the language switching is seamless. Took one star off because the software could be more intuitive.</p>
                  </div>
                  
                  <div className="pb-2">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold">Amit S.</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < 5 ? "text-accent fill-accent" : "text-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">Verified Purchase | 1 month ago</div>
                    <p className="text-gray-700">This is exactly what I was looking for. The ability to type in both English and my native language makes this perfect for my work. The build quality is exceptional and the switches feel great.</p>
                  </div>
                </div>
                
                <Button className="mt-6 w-full">View All Reviews</Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
