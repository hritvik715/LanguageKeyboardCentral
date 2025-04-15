import { motion } from 'framer-motion';
import { Keyboard, Settings, Palette, Monitor, Clock, Shield } from 'lucide-react';

// Features data
const features = [
  {
    icon: <Keyboard className="text-3xl" />,
    title: "Authentic Language Support",
    description: "Our keyboards provide authentic support for all major Indian languages with precise character placement and intuitive layouts.",
    color: "bg-primary bg-opacity-10 text-primary"
  },
  {
    icon: <Settings className="text-3xl" />,
    title: "Premium Build Quality",
    description: "Each keyboard is crafted with high-quality materials, featuring mechanical switches for a superior typing experience.",
    color: "bg-secondary bg-opacity-10 text-secondary"
  },
  {
    icon: <Palette className="text-3xl" />,
    title: "Customizable Options",
    description: "Personalize your keyboard with RGB lighting, different switch types, and customizable keycaps to match your style.",
    color: "bg-accent bg-opacity-10 text-accent"
  },
  {
    icon: <Monitor className="text-3xl" />,
    title: "Display Integration",
    description: "Our keyboard-display combos ensure seamless language integration from input to output for a consistent experience.",
    color: "bg-primary bg-opacity-10 text-primary"
  },
  {
    icon: <Clock className="text-3xl" />,
    title: "Dedicated Support",
    description: "Our team of language and technical experts provide dedicated support to ensure your typing experience is perfect.",
    color: "bg-secondary bg-opacity-10 text-secondary"
  },
  {
    icon: <Shield className="text-3xl" />,
    title: "3-Year Warranty",
    description: "We stand behind our product quality with an extended warranty and comprehensive protection plans.",
    color: "bg-accent bg-opacity-10 text-accent"
  }
];

export default function FeaturesBenefits() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins text-textColor mb-4">Why Choose Ka-Naada?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the benefits of our premium Indian language keyboards</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-background rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-full mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold font-poppins text-textColor mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
