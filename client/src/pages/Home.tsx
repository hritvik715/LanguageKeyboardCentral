import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import LanguageSupport from '@/components/LanguageSupport';
import ProductCatalog from '@/components/ProductCatalog';
import FeaturesBenefits from '@/components/FeaturesBenefits';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  const [location] = useLocation();

  // Handle hash navigation on initial load
  useEffect(() => {
    if (location.includes('#')) {
      const id = location.split('#')[1];
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <FeaturedProducts />
      <LanguageSupport />
      <ProductCatalog />
      <FeaturesBenefits />
      <Newsletter />
    </>
  );
}
