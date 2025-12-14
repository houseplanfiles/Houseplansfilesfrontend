import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutTemplate, Building2, Sofa, Video } from "lucide-react";

const customServices = [
  {
    name: "Customize Floor Plans",
    description:
      "Tailor any floor plan to match your exact needs and lifestyle.",
    image: "/cutomizefloor.jpg",
    icon: LayoutTemplate,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
    href: "/customize/floor-plans",
  },
  {
    name: "Customize Floor Plan + 3D Elevation",
    description:
      "Modify the exterior look of your home with custom 3D renders.",
    image: "/floor+3d.jpg",
    icon: Building2,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
    href: "/customize/3d-elevation",
  },
  {
    name: "Complete House Plan File",
    description:
      "Personalize your living spaces with our expert interior designers.",
    image: "/completehouse.jpg",
    icon: Sofa,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-500",
    href: "/customize/interior-designs",
  },
  {
    name: "3D Elevation and Video WalkThrough",
    description:
      "Experience your future home with immersive 3D video walkthroughs.",
    image: "/elevation3d.jpg",
    icon: Video,
    bgColor: "bg-red-100",
    iconColor: "text-red-500",
    href: "/customize/3d-video-walkthrough",
  },
];

const CustomDesignSection = () => {
  return (
    <section className="py-10 md:py-20 bg-soft-teal">
      <div className="container mx-auto px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            We Design with Your Requirements
          </h2>
          <div className="mt-3 h-1 w-24 bg-primary mx-auto rounded-full"></div>
        </motion.div>

        {/* 
           GRID SYSTEM:
           - grid-cols-2: Mobile par 2 cards ek line mein.
           - gap-3: Mobile par gap kam rakha hai.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 max-w-7xl mx-auto">
          {customServices.map((service, index) => (
            <motion.div
              key={service.name}
              className="w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={service.href} className="group block h-full">
                <div className="bg-card rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Section - Height kam ki mobile ke liye */}
                  <div className="relative overflow-hidden h-32 md:h-56 shrink-0">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/30">
                      {/* Icon Circle - Size adjust kiya mobile ke liye */}
                      <div
                        className={`p-2 md:p-4 rounded-full ${service.bgColor} transition-transform duration-300 group-hover:scale-110 shadow-md`}
                      >
                        <service.icon
                          className={`w-6 h-6 md:w-12 md:h-12 ${service.iconColor}`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Section - Padding & Font adjust kiya */}
                  <div className="p-3 md:p-6 text-center flex-grow flex flex-col justify-start md:justify-center bg-white">
                    <h3 className="text-sm md:text-xl font-bold text-foreground mb-1 md:mb-2 leading-tight line-clamp-2 md:line-clamp-none">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm line-clamp-3 md:line-clamp-none">
                      {service.description}
                    </p>
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

export default CustomDesignSection;
