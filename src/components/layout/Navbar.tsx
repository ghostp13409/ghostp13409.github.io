import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: NavbarProps) => {
  return (
    <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-page-bg/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between transition-colors duration-400">
      <div>
        <h1 className="text-sm font-black uppercase tracking-tighter text-text-main">Parth <span className="text-accent-peach">Gajjar</span></h1>
      </div>
      
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-text-main p-2 -mr-2"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isMobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </nav>
  );
};

export default Navbar;