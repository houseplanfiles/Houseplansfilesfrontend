// 📁 src/components/CorporatePackagesSection.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Store, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";

const corporatePackages = [
  { title: "Builders", icon: <Building2 className="w-5 h-5 md:w-12 md:h-12 text-primary" />, description: "Housing & Colony projects.", slug: "builders-colonizers" },
  { title: "Commercial", icon: <Store className="w-5 h-5 md:w-12 md:h-12 text-primary" />, description: "Offices & Retail.", slug: "offices-shops" },
  { title: "Institutional", icon: <Factory className="w-5 h-5 md:w-12 md:h-12 text-primary" />, description: "Factories & Schools.", slug: "factories-educational" },
];

const CorporatePackagesSection = () => {
  return (
    <section className="py-10 md:py-20 bg-soft-teal">
      <div className="container mx-auto px-2 md:px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">Corporate Projects</h2>
          <p className="text-xs md:text-lg text-muted-foreground mt-1">Tailored solutions for large-scale needs.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-6xl mx-auto">
          {corporatePackages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              // Yeh class aakhri item ko mobile par aache se center karti hai
              className={`bg-card border-2 border-transparent rounded-xl p-3 md:p-8 text-center flex flex-col items-center hover:border-primary shadow-sm hover:shadow-lg transition-all ${corporatePackages.length % 2 !== 0 && index === corporatePackages.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <div className="mb-2 md:mb-6">{pkg.icon}</div>
              <h3 className="text-sm md:text-2xl font-bold text-foreground mb-1 md:mb-4">{pkg.title}</h3>
              <p className="text-[10px] md:text-base text-muted-foreground flex-grow mb-3 md:mb-6 leading-tight">{pkg.description}</p>
              
              <Button asChild className="w-full h-8 text-[10px] md:h-auto md:text-base mt-auto">
                <Link to={`/corporate-inquiry/${pkg.slug}`}>Inquire Now</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporatePackagesSection;
