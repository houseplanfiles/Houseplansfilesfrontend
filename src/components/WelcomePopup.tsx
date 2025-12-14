import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";
const founderImage = "/founder.jpg";
const coFounderImage = "/cofounder.jpg";
const companyLogo = "/investor-logo.png";

interface WelcomePopupProps {
  onComplete: () => void;
}

const WelcomePopup: FC<WelcomePopupProps> = ({ onComplete }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[999]">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-auto md:h-[600px] m-4 overflow-hidden grid md:grid-cols-12"
      >
        {/* Left Side: Brand and Vision (Dark Theme) */}
        <div className="md:col-span-5 bg-gray-900 text-white p-8 sm:p-12 flex flex-col justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05)_0%,_transparent_50%)]">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col h-full justify-center"
          >
            <motion.img
              src={companyLogo}
              alt="Investors Deaal Logo"
              className="w-40 mb-8"
            />
            <motion.div className="flex items-center gap-3 mb-4">
              <Target className="text-red-500" size={28} />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                Our Vision
              </h2>
            </motion.div>
            <motion.p className="text-gray-300 leading-relaxed text-lg">
              To be the most trusted and transparent real estate partner,
              empowering clients to achieve their property dreams with
              confidence.
            </motion.p>
          </motion.div>
        </div>

        {/* Right Side: Founders (Light Theme) */}
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            <motion.h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
              Meet The Leadership
            </motion.h1>

            <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-10">
              {/* Founder */}
              <div className="text-center group">
                <div className="relative p-1 rounded-full bg-gradient-to-br from-red-500 to-orange-400">
                  <img
                    src={founderImage}
                    alt="Manish Tiwari - Founder"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4">
                  Manish Tiwari
                </h3>
                <p className="text-md text-red-600 font-semibold">Founder</p>
              </div>

              {/* Co-Founder */}
              <div className="text-center group">
                <div className="relative p-1 rounded-full bg-gradient-to-br from-red-500 to-orange-400">
                  <img
                    src={coFounderImage}
                    alt="Rashmi Rana - Co-Founder"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4">
                  Rashmi Rana
                </h3>
                <p className="text-md text-red-600 font-semibold">Co-Founder</p>
              </div>
            </motion.div>

            <motion.div className="mt-12 text-center">
              <Button
                onClick={onComplete}
                size="lg"
                className="group w-full sm:w-auto text-lg font-bold text-white px-12 py-6 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg shadow-red-500/30 transform hover:scale-105 transition-all duration-300"
              >
                Start Exploring
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePopup;
