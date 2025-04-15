import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const scrollToFeatured = () => {
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen overflow-hidden bg-textColor">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1563191911-e65f8655ebf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          alt="Premium keyboard" 
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold font-poppins text-white leading-tight mb-4">
            Express Your <span className="text-accent">Language</span>,<br />
            Experience the <span className="text-primary">Difference</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Premium Indian language keyboards and display combos designed for modern creators
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                const productsSection = document.getElementById('products');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore Collection
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white hover:bg-white hover:text-textColor text-white"
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={scrollToFeatured}
          className="text-white hover:text-white/80 hover:bg-transparent"
        >
          <ChevronDown size={36} />
        </Button>
      </motion.div>
    </section>
  );
}
