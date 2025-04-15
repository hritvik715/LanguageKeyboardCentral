import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LanguageCard from '@/components/ui/LanguageCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Language } from '@shared/schema';

export default function LanguageSupport() {
  // Fetch languages data
  const { data: languages, isLoading, error } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  // Skeleton loader while data is loading
  if (isLoading) {
    return (
      <section id="languages" className="py-16 md:py-24 bg-textColor text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-72 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-36 rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="languages" className="py-16 md:py-24 bg-textColor text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">Supported Languages</h2>
          <p className="text-red-300 mb-8">Sorry, we couldn't load the languages data. Please try again later.</p>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-textColor" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="languages" className="py-16 md:py-24 bg-textColor text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">Supported Languages</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our keyboards support all major Indian languages with precision and style
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {languages?.map((language) => (
            <motion.div key={language.id} variants={itemVariants}>
              <LanguageCard language={language} />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button variant="outline" className="bg-white text-textColor hover:bg-accent hover:text-textColor">
            Language Compatibility Guide
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
