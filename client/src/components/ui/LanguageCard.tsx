import { motion } from 'framer-motion';
import { Language } from '@shared/schema';
import { getLanguageChar } from '@/lib/languages';

interface LanguageCardProps {
  language: Language;
}

export default function LanguageCard({ language }: LanguageCardProps) {
  return (
    <motion.div 
      className="bg-white bg-opacity-10 rounded-lg p-6 text-center hover:bg-opacity-20 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-4xl font-bold mb-2 text-accent">{getLanguageChar(language)}</div>
      <h3 className="text-xl font-bold font-poppins mb-1">{language.name}</h3>
      <p className="text-sm text-gray-300">{language.description}</p>
    </motion.div>
  );
}
