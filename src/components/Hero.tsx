import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedStat from "./AnimatedStat";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slides = [
  { image: "/b11.jpg", alt: "Modern white house with a lawn" },
  { image: "/b12.jpg", alt: "Classic house with a beautiful garden" },
  { image: "/b13.jpg", alt: "Luxurious apartment building exterior" },
  { image: "/b14.jpg", alt: "Luxurious apartment building interior" },
];

const CATEGORIES = [
  "Modern Home Design",
  "Duplex House Plans",
  "Single Storey House Plan",
  "Bungalow / Villa House Plans",
  "Apartment / Flat Plans",
  "Farmhouse",
  "Cottage Plans",
  "Row House / Twin House Plans",
  "Village House Plans",
  "Contemporary / Modern House Plans",
  "Colonial / Heritage House Plans",
  "Classic House Plan",
  "Kerala House Plans",
  "Kashmiri House Plan",
  "Marriage Garden",
  "Hospitals",
  "Shops and Showrooms",
  "Highway Resorts and Hotels",
  "Schools and Colleges Plans",
  "Temple & Mosque",
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const searchContainerRef = useRef(null);

  const { products, listStatus } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch products once
  useEffect(() => {
    if (listStatus === "idle") {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, listStatus]);

  // Live search
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = products
        .filter(
          (product) =>
            product.plotSize &&
            product.plotSize.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
        .slice(0, 5);

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, products]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Optimized lightweight slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (searchTerm) queryParams.append("search", searchTerm);
    setSuggestions([]);
    navigate(`/products?${queryParams.toString()}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.plotSize);
    setSuggestions([]);
    navigate(`/products?search=${suggestion.plotSize}`);
  };

  return (
    <section className="relative h-[80vh] min-h-[550px] md:h-screen md:min-h-[700px] flex items-center justify-center text-white overflow-hidden">
      {/* === OPTIMIZED BACKGROUND SLIDER (NO UI CHANGE) === */}
      <div className="absolute inset-0">
        <img
          key={currentSlide}
          src={slides[currentSlide].image}
          alt={slides[currentSlide].alt}
          width={1920}
          height={1080}
          loading={currentSlide === 0 ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover object-center transition-opacity duration-700"
          style={{ opacity: 1 }}
        />

        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* === HERO CONTENT (UNCHANGED UI) === */}
      <div className="relative z-10 text-center max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full pt-10 md:pt-0">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-6 animate-slide-up leading-tight">
          Find Your Perfect
          <span
            className="block text-white animate-bounce-in mt-1"
            style={{ animationDelay: "0.3s" }}
          >
            House Plan
          </span>
        </h1>

        <p
          className="text-sm sm:text-lg md:text-xl mb-6 md:mb-8 text-white/90 font-light animate-fade-in max-w-lg mx-auto md:max-w-none"
          style={{ animationDelay: "0.6s" }}
        >
          Discover amazing architectural designs for your dream home
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-6 md:mb-8"
        >
          <Link to="/products">
            <Button
              size="lg"
              className="btn-primary w-full sm:w-auto px-8 md:px-10 py-4 md:py-6 text-base md:text-lg"
            >
              Explore The Plans
            </Button>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <div
          ref={searchContainerRef}
          className="bg-white rounded-xl md:rounded-2xl p-2 sm:p-4 shadow-large max-w-2xl w-full mx-auto animate-scale-in relative"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <Select
                onValueChange={setSelectedCategory}
                disabled={listStatus === "loading"}
              >
                <SelectTrigger className="w-full h-10 text-sm text-primary-gray border-0 bg-gray-50 sm:bg-transparent focus:ring-1 focus:ring-primary transition-all duration-300 hover:bg-primary/5">
                  <SelectValue
                    placeholder={
                      listStatus === "loading"
                        ? "Loading..."
                        : "Select Category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 relative">
              <Input
                placeholder="Search plot size e.g. 25x40"
                className="h-10 text-sm border-0 bg-gray-50 sm:bg-transparent focus:ring-1 focus:ring-primary text-primary-gray transition-all duration-300 hover:bg-primary/5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
              />

              {/* Suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl z-50 text-left border border-gray-100 max-h-48 overflow-y-auto"
                  >
                    <ul className="py-1">
                      {suggestions.map((s) => (
                        <li
                          key={s._id}
                          className="px-3 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-50 last:border-none"
                          onClick={() => handleSuggestionClick(s)}
                        >
                          <span className="font-semibold">{s.plotSize}</span> -{" "}
                          {s.name}
                        </li>
                      ))}
                      <li
                        className="px-3 py-2 cursor-pointer text-sm text-primary font-semibold hover:bg-gray-100 text-center"
                        onClick={handleSearch}
                      >
                        View all for "{searchTerm}"
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              className="btn-primary w-full sm:w-auto sm:px-8 group h-10"
              onClick={handleSearch}
            >
              <Search className="w-4 h-4 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="inline">Search</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 md:gap-8 mt-8 md:mt-12 max-w-lg mx-auto w-full">
          <AnimatedStat end={1000} suffix="+" label="House Plans" />
          <AnimatedStat end={1000} suffix="+" label="Happy Clients" />
          <AnimatedStat end={10} suffix="+" label="Years Exp." />
        </div>
      </div>
    </section>
  );
};

export default Hero;
