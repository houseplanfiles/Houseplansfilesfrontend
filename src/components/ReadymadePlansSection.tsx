import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  LayoutTemplate,
  Building2,
  Sofa,
  HardHat,
} from "lucide-react";

const planTypes = [
  {
    name: "Floor Plans",
    icon: LayoutTemplate,
    image: "/floorplan.jpg",
    href: "/floor-plans",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    name: "Floor Plan + 3D", // Thoda short naam kiya mobile ke liye
    icon: Building2,
    image: "/3d.jpg",
    href: "/3d-plans",
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
  {
    name: "Interior Designs",
    icon: Sofa,
    image: "/c3.jpeg",
    href: "/interior-designs",
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
  },
  {
    name: "Download",
    icon: HardHat,
    image: "/r4.avif",
    href: "/download",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
];

const ReadymadePlansSection = () => {
  return (
    <section className="py-10 md:py-20 bg-background">
      <div className="container mx-auto px-2 md:px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            Readymade House Plans
          </h2>
          <div className="mt-3 h-1 w-20 md:w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        {/* 
           GRID LAYOUT CHANGES:
           1. grid-cols-2: Mobile par 2 cards ek sath dikhenge.
           2. gap-3: Mobile par gap kam rakha hai taaki cards bade dikhein.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {planTypes.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={plan.href}
                className="group block relative rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[3/4] md:aspect-[3/4]"
              >
                {/* Background Image */}
                <img
                  src={plan.image}
                  alt={plan.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Card Content */}
                <div className="relative h-full flex flex-col p-3 md:p-6 text-white justify-between">
                  {/* Icon Wrapper (Adjusted size for mobile) */}
                  <div className="flex-grow flex items-center justify-center">
                    <div
                      className={`p-3 md:p-5 rounded-full ${plan.bgColor} transition-transform duration-300 group-hover:scale-110 shadow-lg backdrop-blur-sm bg-opacity-90`}
                    >
                      <plan.icon
                        className={`h-6 w-6 md:h-12 md:w-12 ${plan.iconColor}`}
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="text-center">
                    {/* Font size chota kiya mobile ke liye taaki 2 line mein na tute */}
                    <h3 className="text-sm md:text-2xl font-bold leading-tight mb-1 transition-colors duration-300 group-hover:text-primary">
                      {plan.name}
                    </h3>

                    {/* 'Explore' text small screens par hide kar sakte hain ya chota dikha sakte hain */}
                    <div className="hidden md:flex items-center justify-center gap-2 mt-2 text-primary-foreground/80 group-hover:text-white transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReadymadePlansSection;
