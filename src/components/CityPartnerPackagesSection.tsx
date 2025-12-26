import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
interface Package {
  _id: string;
  title: string;
  price: number | string;
  unit: string;
  areaType?: string;
  isPopular?: boolean;
  features?: string[];
}

interface CityPartnerPackagesProps {
  packages: Package[];
}

const PackageCard = ({ pkg }: { pkg: Package }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const INITIAL_FEATURE_COUNT = 4;
  const features = pkg.features || [];
  const shouldShowToggle = features.length > INITIAL_FEATURE_COUNT;
  const visibleFeatures = isExpanded
    ? features
    : features.slice(0, INITIAL_FEATURE_COUNT);

  const renderPrice = (price: string | number) => {
    const isSimplePrice = !isNaN(Number(price));

    if (isSimplePrice) {
      return (
        <div className="flex justify-center items-start gap-1 text-orange-600">
          <span className="text-2xl font-bold mt-2">₹</span>
          <span className="text-4xl font-extrabold tracking-tighter">
            {price}
          </span>
        </div>
      );
    }

    const priceString = String(price);
    const lines = priceString
      .split(/(?=₹|Rs|rs|Rs\.|INR)/i)
      .filter((line) => line.trim().length > 0);

    return (
      <div className="flex flex-col w-full gap-2">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[-–—]\s*/, "").trim();
          return (
            <div
              key={idx}
              className="bg-white rounded-md px-2 py-1.5 shadow-sm border border-orange-100 flex items-center justify-center text-center"
            >
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {cleanLine}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      layout
      className={`flex-shrink-0 w-[320px] md:w-[350px] snap-center h-full flex flex-col bg-white rounded-2xl transition-all duration-300 relative overflow-hidden
        ${
          pkg.isPopular
            ? "border-2 border-orange-500 shadow-xl z-10"
            : "border border-gray-200 shadow-md hover:shadow-xl"
        }`}
    >
      {pkg.isPopular && (
        <div className="absolute top-0 w-full bg-orange-500 text-white text-[10px] font-bold py-1 text-center uppercase tracking-widest flex items-center justify-center gap-1 shadow-sm z-20">
          <Star className="w-3 h-3 fill-current" /> Best Value Partner
        </div>
      )}

      <div
        className={`p-5 flex flex-col h-full ${pkg.isPopular ? "pt-8" : ""}`}
      >
        <div className="text-center mb-3 min-h-[60px] flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-800 leading-tight line-clamp-2">
            {pkg.title}
          </h3>
          {pkg.areaType && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wide">
              {pkg.areaType}
            </span>
          )}
        </div>

        <div className="bg-orange-50 rounded-xl p-3 mb-4 text-center border border-orange-100 shadow-inner flex flex-col items-center justify-center h-[180px] overflow-hidden">
          <div className="w-full flex-grow flex flex-col items-center justify-center overflow-y-auto no-scrollbar">
            {renderPrice(pkg.price)}
          </div>
          <div className="w-full border-t border-orange-200/50 mt-2 pt-2 flex-shrink-0">
            <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider flex items-center justify-center gap-1">
              <Tag className="w-3 h-3" /> {pkg.unit}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-2 min-h-[100px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div layout className="space-y-2">
              {visibleFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle
                    size={16}
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-xs text-gray-700 leading-snug font-medium text-left">
                    {f}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mb-2 h-[24px] flex items-center justify-center">
          {shouldShowToggle ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-orange-600 flex items-center justify-center gap-1 hover:underline focus:outline-none w-full"
            >
              {isExpanded
                ? "Show Less"
                : `View ${features.length - INITIAL_FEATURE_COUNT} More Benefits`}
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          ) : (
            <div className="h-full"></div>
          )}
        </div>

        <div className="flex-grow"></div>

        <div className="mt-2">
          <Button
            asChild
            size="lg"
            className={`w-full font-bold h-11 rounded-xl shadow-md transition-transform active:scale-95 ${
              pkg.isPopular
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            <Link
              to="/partner-application"
              state={{
                packageName: pkg.title,
                packageUnit: pkg.unit,
                packagePrice: pkg.price,
                category: "City Partner",
              }}
            >
              Become a Partner
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const CityPartnerPackagesSection: React.FC<CityPartnerPackagesProps> = ({
  packages,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  if (!packages || packages.length === 0) return null;

  const initialMobileCount = 4;
  const mobileVisiblePackages = showAllMobile
    ? packages
    : packages.slice(0, initialMobileCount);
  const hasMoreMobile = packages.length > initialMobileCount;

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
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-2">
            <span className="bg-orange-100 text-orange-600 p-2 rounded-full">
              <Briefcase className="w-6 h-6" />
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            City Partner <span className="text-orange-600">Opportunities</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-500 mt-2 max-w-2xl mx-auto">
            Exclusive franchise models designed for high ROI and regional
            growth.
          </p>
        </motion.div>

        <div className="hidden md:block relative group px-2">
          {packages.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 rounded-full h-10 w-10 bg-white shadow-lg border-gray-200 hover:bg-orange-50 hover:text-orange-600 transition-all opacity-0 group-hover:opacity-100"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 rounded-full h-10 w-10 bg-white shadow-lg border-gray-200 hover:bg-orange-50 hover:text-orange-600 transition-all opacity-0 group-hover:opacity-100"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 px-4 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide items-stretch"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        </div>

        <div className="block md:hidden">
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {mobileVisiblePackages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </AnimatePresence>
          </div>

          {hasMoreMobile && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="text-xs font-medium gap-2 px-6 py-2 rounded-full"
              >
                {showAllMobile ? "Show Less" : "View All Partnerships"}
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

export default CityPartnerPackagesSection;

