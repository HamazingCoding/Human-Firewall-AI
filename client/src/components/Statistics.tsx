import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Statistics() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("statistics-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <section 
      id="statistics-section" 
      className="mb-12 py-12 bg-gradient-to-r from-primary to-primary-light rounded-xl"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Threats Neutralized</h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          <motion.div variants={item}>
            <p className="text-4xl font-bold text-accent-teal mb-2">98.7%</p>
            <p className="text-gray-300">Detection Accuracy</p>
          </motion.div>
          <motion.div variants={item}>
            <p className="text-4xl font-bold text-accent-teal mb-2">10M+</p>
            <p className="text-gray-300">Threats Analyzed</p>
          </motion.div>
          <motion.div variants={item}>
            <p className="text-4xl font-bold text-accent-teal mb-2">5,000+</p>
            <p className="text-gray-300">Organizations Protected</p>
          </motion.div>
          <motion.div variants={item}>
            <p className="text-4xl font-bold text-accent-teal mb-2">$320M</p>
            <p className="text-gray-300">Potential Loss Prevented</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
