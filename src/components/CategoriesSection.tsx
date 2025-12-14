import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Home,
  Building2,
  Castle,
  Warehouse,
  TreePine,
  Hotel,
  School,
  Church,
} from "lucide-react";

const categories = [
  {
    name: "Modern Home Design",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
    href: "/products?category=Modern Home Design",
  },
  {
    name: "Duplex House Plans",
    image:
      "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Building2,
    color: "from-purple-500 to-pink-500",
    href: "/products?category=Duplex House Plans",
  },
  {
    name: "Single Storey House Plan",
    image:
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-green-500 to-emerald-500",
    href: "/products?category=Single Storey House Plan",
  },
  {
    name: "Bungalow / Villa House Plans",
    image:
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Castle,
    color: "from-orange-500 to-red-500",
    href: "/products?category=Bungalow / Villa House Plans",
  },
  {
    name: "Apartment / Flat Plans",
    image:
      "https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Building2,
    color: "from-indigo-500 to-purple-500",
    href: "/products?category=Apartment / Flat Plans",
  },
  {
    name: "Farmhouse",
    image:
      "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: TreePine,
    color: "from-teal-500 to-green-500",
    href: "/products?category=Farmhouse",
  },
  {
    name: "Cottage Plans",
    image:
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-yellow-500 to-orange-500",
    href: "/products?category=Cottage Plans",
  },
  {
    name: "Row House / Twin House Plans",
    image:
      "https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Building2,
    color: "from-pink-500 to-rose-500",
    href: "/products?category=Row House / Twin House Plans",
  },
  {
    name: "Village House Plans",
    image:
      "https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-lime-500 to-green-500",
    href: "/products?category=Village House Plans",
  },
  {
    name: "Contemporary / Modern House Plans",
    image:
      "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Building2,
    color: "from-cyan-500 to-blue-500",
    href: "/products?category=Contemporary / Modern House Plans",
  },
  {
    name: "Colonial / Heritage House Plans",
    image:
      "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Castle,
    color: "from-amber-500 to-orange-500",
    href: "/products?category=Colonial / Heritage House Plans",
  },
  {
    name: "Classic House Plan",
    image:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-red-500 to-pink-500",
    href: "/products?category=Classic House Plan",
  },
  {
    name: "Kerala House Plans",
    image:
      "https://images.pexels.com/photos/259593/pexels-photo-259593.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-emerald-500 to-teal-500",
    href: "/products?category=Kerala House Plans",
  },
  {
    name: "Kashmiri House Plan",
    image:
      "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Home,
    color: "from-blue-500 to-indigo-500",
    href: "/products?category=Kashmiri House Plan",
  },
  {
    name: "Marriage Garden",
    image:
      "https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: TreePine,
    color: "from-green-500 to-lime-500",
    href: "/products?category=Marriage Garden",
  },
  {
    name: "Hospitals",
    image:
      "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Building2,
    color: "from-red-500 to-rose-500",
    href: "/products?category=Hospitals",
  },
  {
    name: "Shops and Showrooms",
    image:
      "https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Warehouse,
    color: "from-purple-500 to-violet-500",
    href: "/products?category=Shops and Showrooms",
  },
  {
    name: "Highway Resorts and Hotels",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Hotel,
    color: "from-orange-500 to-amber-500",
    href: "/products?category=Highway Resorts and Hotels",
  },
  {
    name: "Schools and Colleges Plans",
    image:
      "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: School,
    color: "from-indigo-500 to-blue-500",
    href: "/products?category=Schools and Colleges Plans",
  },
  {
    name: "Temple & Mosque",
    image:
      "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: Church,
    color: "from-yellow-500 to-orange-500",
    href: "/products?category=Temple & Mosque",
  },
];

const CategoriesSection = () => {
  // --- PAGINATION LOGIC START ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // User requested 4 items at a time

  // Calculate total pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  // Change page function
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Optional: Scroll to top of section when page changes
    const section = document.getElementById("categories-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };
  // --- PAGINATION LOGIC END ---

  return (
    <section
      id="categories-section"
      className="py-10 md:py-20 bg-[#E8F5F3] relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-2 md:px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-5 py-2 md:px-8 md:py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-base font-bold rounded-lg mb-3 md:mb-4 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Explore Our Collection
          </motion.span>
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-2 md:mb-4">
            Browse Categories
          </h2>
          <p className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto">
            Discover architectural masterpieces across diverse categories
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 md:mt-6 h-1 md:h-1.5 w-24 md:w-32 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 mx-auto rounded-full"
          ></motion.div>
        </motion.div>

        {/* 
            GRID LAYOUT with AnimatePresence for smooth transitions between pages
            - grid-cols-2 for Mobile (2 items per row x 2 rows = 4 items)
            - lg:grid-cols-4 for Desktop (1 row = 4 items)
        */}
        <div className="min-h-[400px]">
          {" "}
          {/* Min height to prevent jumping */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {currentItems.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.name} // Key helps Framer Motion identify unique items
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="w-full"
                  >
                    <a href={category.href} className="group block h-full">
                      <div className="relative h-full bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-all duration-500 overflow-hidden transform hover:-translate-y-2 md:hover:-translate-y-4 border border-gray-100 hover:border-orange-200">
                        {/* Image Container */}
                        <div className="relative h-32 md:h-56 overflow-hidden">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-10`}
                          ></div>
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />

                          {/* Icon Badge */}
                          <div
                            className={`absolute top-2 right-2 md:top-5 md:right-5 p-2 md:p-4 bg-gradient-to-br ${category.color} rounded-lg md:rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-20`}
                          >
                            <IconComponent className="w-4 h-4 md:w-7 md:h-7 text-white" />
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 z-10"></div>
                          <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        </div>

                        {/* Content */}
                        <div className="p-3 md:p-7">
                          <h3 className="text-sm md:text-xl font-extrabold text-gray-900 mb-2 md:mb-3 group-hover:text-orange-600 transition-colors duration-300 min-h-[2.5rem] md:min-h-[3.5rem] flex items-start md:items-center leading-tight line-clamp-2">
                            {category.name}
                          </h3>

                          <div className="flex items-center justify-between mt-2 md:mt-5 pt-2 md:pt-5 border-t border-gray-100 group-hover:border-orange-100 transition-colors">
                            <span className="text-[10px] md:text-sm text-gray-600 font-bold group-hover:text-orange-600 transition-colors">
                              View Details
                            </span>
                            <div className="w-6 h-6 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 shadow-sm md:shadow-lg">
                              <ChevronRight className="w-3 h-3 md:w-6 md:h-6 text-white" />
                            </div>
                          </div>
                          <div className="h-1 md:h-1.5 w-0 group-hover:w-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 mt-2 md:mt-5 rounded-full shadow-md"></div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-sm"
            } transition-all duration-300`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`w-10 h-10 rounded-lg text-sm font-bold border transition-all duration-300 ${
                currentPage === i + 1
                  ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-600 shadow-lg transform scale-110"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 shadow-sm"
            } transition-all duration-300`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, categories.length)} of{" "}
            {categories.length} categories
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
