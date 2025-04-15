import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

// Footer link groups
const footerLinks = [
  {
    title: "Products",
    links: [
      { name: "Keyboards", href: "/#products" },
      { name: "Display Combos", href: "/#products" },
      { name: "Accessories", href: "/#products" },
      { name: "Software", href: "/#" },
      { name: "Special Editions", href: "/#" }
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/#" },
      { name: "Contact Us", href: "/#contact" },
      { name: "Warranty", href: "/#" },
      { name: "Shipping Info", href: "/#" },
      { name: "Returns Policy", href: "/#" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/#about" },
      { name: "Careers", href: "/#" },
      { name: "Press", href: "/#" },
      { name: "Blog", href: "/#" },
      { name: "Language Guide", href: "/#languages" }
    ]
  }
];

// Social media links
const socialLinks = [
  { name: "Facebook", icon: <Facebook size={20} />, href: "/#" },
  { name: "Twitter", icon: <Twitter size={20} />, href: "/#" },
  { name: "Instagram", icon: <Instagram size={20} />, href: "/#" },
  { name: "YouTube", icon: <Youtube size={20} />, href: "/#" }
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-textColor text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold font-poppins">
                Ka<span className="text-primary">-Naada</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Premium Indian language keyboards and display solutions for modern creators and professionals.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>
          
          {footerLinks.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <h3 className="text-lg font-bold font-poppins mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Ka-Naada. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
