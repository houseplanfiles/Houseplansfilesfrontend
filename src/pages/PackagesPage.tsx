// 📁 src/pages/PackagesPage.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, ChevronDown } from "lucide-react";

import { AppDispatch, RootState } from "@/lib/store";
import { fetchAllPackages } from "@/lib/features/packages/packageSlice";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StandardPackagesSection from "@/components/StandardPackagesSection";
import PremiumPackagesSection from "@/components/PremiumPackagesSection";
import CityPartnerPackagesSection from "@/components/CityPartnerPackagesSection";
import MarketplacePackagesSection from "@/components/MarketplacePackagesSection";
import CorporatePackagesSection from "@/components/CorporatePackagesSection";

import { Button } from "@/components/ui/button";

// --- FAQ aur CTA Sections (Aapke original code se) ---
const faqData = [
  {
    question: "How long does it take to get a house plan?",
    answer:
      "Standard plans are instant. Custom plans take 2-4 weeks depending on complexity.",
  },
  {
    question: 'What is included in the "Complete File"?',
    answer:
      "Includes 2D floor plans, 3D elevations, structural drawings, electrical/plumbing layouts, and BOQ.",
  },
  {
    question: "Can I make changes to a readymade plan?",
    answer: "Yes! Buy a plan and opt for our 'Customize Floor Plans' service.",
  },
  {
    question: "Do you provide construction services?",
    answer:
      "We focus on design & planning drawings. We support your team but don't build directly.",
  },
];

const FaqSection = () => {
  // YAHAN PAR ERROR THA, MAINE = LAGA DIYA HAI
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const handleToggle = (index: number) =>
    setOpenIndex(openIndex === index ? null : index);
  return (
    <section className="py-10 md:py-20 bg-soft-teal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            FAQs
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-2 md:space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-card rounded-lg shadow-sm border border-border"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex justify-between items-center p-3 md:p-5 text-left font-semibold text-foreground text-xs md:text-base"
                >
                  <span className="pr-2">{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-3 md:px-5 md:pb-5 text-[10px] md:text-sm text-muted-foreground"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
const CtaSection = () => (
  <section className="gradient-orange py-10 md:py-20">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="container mx-auto px-4 text-center text-primary-foreground"
    >
      <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">
        Ready to Build?
      </h2>
      <p className="text-xs md:text-xl max-w-xl mx-auto mb-4 md:mb-8 opacity-90">
        Contact us today for a free consultation.
      </p>
      <Link to="/contact">
        <Button
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold px-6 h-9 md:h-12 text-sm md:text-lg"
        >
          Get a Free Quote
        </Button>
      </Link>
    </motion.div>
  </section>
);
// --- End of FAQ and CTA Sections ---

const PackagesPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { packages, status, error } = useSelector(
    (state: RootState) => state.packages
  );

  // Sirf ek baar data fetch karein jab page load ho
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllPackages());
    }
  }, [status, dispatch]);

  // Data ko yahin filter karein
  const standardPackages = packages.filter(
    (pkg) => pkg.packageType === "standard"
  );
  const premiumPackages = packages.filter(
    (pkg) => pkg.packageType === "premium"
  );

  return (
    <>
      <Helmet>
        <title>Multiple home designing packages</title>
        <meta
          name="description"
          content="Explore affordable design packages — ready-made house plans, custom layouts & add-ons to fit your build needs. Start your dream home project today!"
        />
      </Helmet>
      <Navbar />
      <main className="overflow-x-hidden">
        {/* --- HERO SECTION --- */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative py-16 md:py-32 text-center text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-3xl md:text-6xl font-extrabold mb-3 md:mb-6">
              Our Architectural Packages
            </h1>
            <p className="text-sm md:text-2xl max-w-3xl mx-auto opacity-90 font-light">
              Find the perfect design package that fits your needs, from
              standard plans to corporate solutions.
            </p>
          </div>
        </motion.section>

        {/* Loading aur Error State ko handle karein */}
        {status === "loading" && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-20 text-red-500">
            <p>Error loading packages: {error}</p>
          </div>
        )}

        {/* Jab data aa jaye, tab sections ko render karein */}
        {status === "succeeded" && (
          <>
            <StandardPackagesSection packages={standardPackages} />
            <PremiumPackagesSection packages={premiumPackages} />
            <CityPartnerPackagesSection />
            <MarketplacePackagesSection />
            <CorporatePackagesSection />
          </>
        )}

        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default PackagesPage;
