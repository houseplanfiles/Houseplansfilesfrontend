// 📁 src/components/PremiumPackagesSection.tsx

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Define Package type for props
interface Package {
  _id: string;
  title: string;
  price: number;
  unit: string;
  areaType?: string;
  isPopular?: boolean;
  features?: string[];
  includes?: string[];
}
interface PremiumPackagesProps {
  packages: Package[];
}

const PremiumPackagesSection: React.FC<PremiumPackagesProps> = ({
  packages: premiumPackages,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  if (!premiumPackages || premiumPackages.length === 0) return null;

  // --- Mobile Logic ---
  const initialMobileCount = 4;
  const mobileVisiblePackages = showAllMobile
    ? premiumPackages
    : premiumPackages.slice(0, initialMobileCount);
  const hasMoreMobile = premiumPackages.length > initialMobileCount;

  // --- Scroll Logic ---
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            Premium Packages
          </h2>
          <p className="text-xs md:text-lg text-muted-foreground mt-1">
            Comprehensive designs for your needs.
          </p>
        </motion.div>

        {/* --- DESKTOP VIEW (SLIDER) --- */}
        <div className="hidden md:block relative">
          {premiumPackages.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white flex"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm hover:bg-white flex"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 px-1 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {premiumPackages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex-shrink-0 w-[45vw] lg:w-[30vw] xl:w-[23vw] snap-start bg-card border-2 rounded-xl text-center transition-all duration-300 relative flex flex-col ${pkg.isPopular ? "border-primary shadow-lg" : "border-gray-200 hover:border-primary hover:shadow-lg"}`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    MOST POPULAR
                  </div>
                )}
                <div className="flex-grow overflow-y-auto px-5 pt-6 pb-3">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {pkg.title}
                  </h3>
                  <div className="mb-3">
                    <span className="text-4xl font-extrabold text-primary">
                      ₹{pkg.price}
                    </span>
                    <p className="text-sm text-muted-foreground">{pkg.unit}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {pkg.areaType}
                  </p>
                  <div className="text-left mt-2 text-xs space-y-1">
                    {[...(pkg.features || []), ...(pkg.includes || [])].map(
                      (f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle
                            size={12}
                            className="text-green-500 mt-0.5"
                          />
                          <span>{f}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="px-5 pb-4 pt-3 border-t bg-card mt-auto">
                  <Button asChild size="lg" className="w-full font-semibold">
                    <Link
                      to="/booking-form"
                      state={{
                        packageName: pkg.title,
                        packageUnit: pkg.unit,
                        packagePrice: pkg.price,
                      }}
                    >
                      Choose Plan
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- MOBILE VIEW (GRID) --- */}
        <div className="block md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence>
              {mobileVisiblePackages.map((pkg) => (
                <motion.div
                  key={pkg._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-card border rounded-lg flex flex-col p-2 relative ${pkg.isPopular ? "border-primary shadow-sm" : "border-border"}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full z-10 whitespace-nowrap">
                      POPULAR
                    </div>
                  )}
                  <div className="text-center mb-1 mt-1">
                    <h3 className="text-xs font-bold text-foreground truncate">
                      {pkg.title}
                    </h3>
                    <div className="flex justify-center items-baseline gap-0.5">
                      <span className="text-lg font-extrabold text-primary">
                        ₹{pkg.price}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        /{pkg.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow space-y-1 mb-2">
                    {[...(pkg.features || []), ...(pkg.includes || [])]
                      .slice(0, 3)
                      .map((feature, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-[9px] text-foreground leading-tight line-clamp-1">
                            {feature}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="mt-auto">
                    <Button
                      asChild
                      size="sm"
                      className="w-full h-7 text-[10px] font-semibold"
                    >
                      <Link
                        to="/booking-form"
                        state={{
                          packageName: pkg.title,
                          packageUnit: pkg.unit,
                          packagePrice: pkg.price,
                        }}
                      >
                        Select
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {hasMoreMobile && (
            <div className="text-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="text-xs gap-1 h-8 px-4"
              >
                {showAllMobile ? "Show Less" : "View All"}
                {showAllMobile ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PremiumPackagesSection;
