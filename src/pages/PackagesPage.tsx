import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StandardPackagesSection from "@/components/StandardPackagesSection";
import PremiumPackagesSection from "@/components/PremiumPackagesSection";
import CorporatePackagesSection from "@/components/CorporatePackagesSection";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const PackagesPage = () => {
  return (
    <>
      <Helmet>
        <title>
          Architectural Design Packages | Standard, Premium & Corporate
        </title>
        <meta
          name="description"
          content="Explore our comprehensive design packages."
        />
      </Helmet>

      <Navbar />
      <main className="overflow-x-hidden">
        {/* --- HERO SECTION WITH BACKGROUND IMAGE --- */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative py-16 md:py-32 text-center text-white"
          style={{
            // Aap yahan apni image ka URL daal sakte hain
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark Overlay for text readability */}
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

        <StandardPackagesSection />
        <PremiumPackagesSection />
        <CorporatePackagesSection />

        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
};

export default PackagesPage;
