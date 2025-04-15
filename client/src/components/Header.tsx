import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart, Search, X } from 'lucide-react';

type NavLink = {
  name: string;
  href: string;
};

const navLinks: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/#products' },
  { name: 'Languages', href: '/#languages' },
  { name: 'About', href: '/#about' },
  { name: 'Contact', href: '/#contact' }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Get cart items count
  const { data: cartData } = useQuery({
    queryKey: ['/api/cart'],
    queryFn: () => fetch('/api/cart').then(res => res.json()),
    staleTime: 60000,
  });

  const cartItemsCount = cartData?.length || 0;

  // Handle scroll event for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation for hash links
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 80,
          behavior: 'smooth'
        });
      }
      
      return;
    }
    
    setLocation(href);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold font-poppins text-primary mr-2">
            Ka<span className="text-secondary">-Naada</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href)}
              className="font-medium text-textColor hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-3 pr-8 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button 
              className="text-textColor hover:text-primary transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>
          )}
          
          <Link href="/cart" className="text-textColor hover:text-primary transition-colors relative">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      handleNavigation(e, link.href);
                      document.querySelector('[data-state="open"]')?.setAttribute('data-state', 'closed');
                    }}
                    className="text-lg font-medium py-2 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
