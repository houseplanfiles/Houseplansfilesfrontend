import React, { useState, useEffect, useMemo, useRef, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  ServerCrash,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  MapPin,
} from "lucide-react";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicSellerProducts } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Import DisplayPrice for currency conversion
import DisplayPrice from "@/components/DisplayPrice";

// --- Inquiry Modal (No changes) ---
const InquiryModal = ({ product, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.sellerInquiries
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: `I am interested in your product: "${product.name}". Please provide more details.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Inquiry sent successfully! The seller will contact you soon."
      );
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send inquiry."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInquiry({ ...formData, productId: product._id }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800">Send Inquiry</h2>
          <p className="text-gray-500 mt-1">
            For product: <span className="font-semibold">{product.name}</span>
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- OPTIMIZED PRODUCT CARD (Wider Mobile Look) ---
// Now uses DisplayPrice for currency support
const ProductCard = ({ product, onInquiryClick, isMobile = false }) => (
  <div
    className={`bg-white rounded-lg flex flex-col group transition-all duration-300 border hover:border-orange-500 hover:shadow-xl hover:-translate-y-2
    ${
      isMobile
        ? "w-full p-2 shadow-sm border-gray-200"
        : "w-80 flex-shrink-0 snap-start p-4 shadow-md rounded-xl"
    }`}
  >
    {/* Image Container */}
    <div className="relative">
      <img
        src={product.image || "https://via.placeholder.com/400x300"}
        alt={product.name}
        className={`w-full object-cover rounded-md bg-gray-50
          ${isMobile ? "h-28" : "h-48"} 
        `}
      />
      <div
        className={`absolute top-1.5 right-1.5 bg-white/95 backdrop-blur-sm rounded-full font-semibold text-gray-800 flex items-center gap-1 shadow-sm
        ${isMobile ? "px-1.5 py-0.5 text-[9px]" : "px-3 py-1 text-xs"}
      `}
      >
        <MapPin className={isMobile ? "w-2 h-2" : "w-3 h-3"} />
        {product.city}
      </div>
    </div>

    {/* Content Container */}
    <div className={`flex flex-col flex-grow ${isMobile ? "pt-2" : "pt-3"}`}>
      {/* Category */}
      <p
        className={`text-orange-600 font-bold uppercase tracking-wider truncate
        ${isMobile ? "text-[8px] mb-0.5" : "text-xs mb-1"}
      `}
      >
        {product.category}
      </p>

      {/* Title */}
      <h3
        className={`font-bold text-gray-900 leading-tight
        ${isMobile ? "text-xs line-clamp-2 h-8" : "text-lg truncate"}
      `}
        title={product.name}
      >
        {product.name}
      </h3>

      {/* Seller Info */}
      <div
        className={`flex items-center text-gray-600 border-t mt-auto
        ${isMobile ? "gap-1.5 pt-1.5 mt-1.5" : "gap-3 pt-3 mt-3"}
      `}
      >
        <img
          src={product.seller?.photoUrl || "https://via.placeholder.com/40"}
          alt={product.seller?.businessName || "Seller"}
          className={`rounded-full object-cover border border-gray-200
            ${isMobile ? "w-5 h-5" : "w-10 h-10"}
          `}
        />
        <div className="flex flex-col justify-center overflow-hidden">
          <p
            className={`${isMobile ? "text-[8px]" : "text-xs"} text-gray-400 leading-none`}
          >
            Sold by:
          </p>
          <p
            className={`font-semibold text-gray-700 truncate
            ${isMobile ? "text-[10px]" : "text-sm"}
          `}
          >
            {product.seller?.businessName || "Trusted Seller"}
          </p>
        </div>
      </div>

      {/* Price with Currency Support */}
      <div
        className={`font-extrabold text-gray-800 ${isMobile ? "mt-1.5 text-sm" : "mt-3 text-2xl"}`}
      >
        {/* Changed from manual ₹ to DisplayPrice component */}
        <DisplayPrice inrPrice={product.price} />
      </div>

      {/* Action Button */}
      <Button
        onClick={() => onInquiryClick(product)}
        className={`w-full bg-gray-900 hover:bg-orange-600 text-white font-medium rounded-md transition-colors
          ${isMobile ? "mt-2 h-8 text-xs" : "mt-3 h-10 text-sm rounded-lg"}
        `}
      >
        Send Inquiry
      </Button>
    </div>
  </div>
);

// --- Main Section ---
const SellersSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- MOBILE PAGINATION STATE ---
  const [mobilePage, setMobilePage] = useState(1);
  const mobileItemsPerPage = 4;

  useEffect(() => {
    dispatch(
      fetchPublicSellerProducts({
        limit: 15,
        city: selectedCity || undefined,
      })
    );
  }, [dispatch, selectedCity]);

  const uniqueCategories = useMemo(() => {
    const categories = products.map((p) => p.category).filter(Boolean);
    return ["All", ...Array.from(new Set(categories)).sort()];
  }, [products]);

  const uniqueCities = useMemo(() => {
    const cities = products.map((p) => p.city).filter(Boolean);
    return ["All Cities", ...Array.from(new Set(cities)).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let items = products;
    if (selectedCategory !== "All") {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.seller?.businessName?.toLowerCase().includes(searchLower)
      );
    }
    return items;
  }, [products, searchTerm, selectedCategory]);

  const totalMobilePages = Math.ceil(
    filteredProducts.length / mobileItemsPerPage
  );
  const currentMobileItems = filteredProducts.slice(
    (mobilePage - 1) * mobileItemsPerPage,
    mobilePage * mobileItemsPerPage
  );

  const handleMobilePageChange = (page) => {
    setMobilePage(page);
  };

  const handleOpenInquiryModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 344;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="py-8 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-1 md:px-8">
          {/* --- BANNER --- */}
          <div className="px-2 md:px-0 mb-6 md:mb-12">
            <div
              className="relative h-40 md:h-80 rounded-lg md:rounded-2xl overflow-hidden bg-cover bg-center shadow-md"
              style={{ backgroundImage: "url(/marketplace.png)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-4">
                <h2
                  className="text-2xl md:text-5xl font-extrabold tracking-tight"
                  style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
                >
                  Our Marketplace
                </h2>
                <p className="mt-1 md:mt-4 max-w-2xl mx-auto text-xs md:text-lg text-gray-200">
                  Discover amazing materials and designs for your dream home.
                </p>
              </div>
            </div>
          </div>

          {/* --- FILTERS --- */}
          <div className="mx-2 md:mx-auto bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-xl shadow-sm mb-6 md:mb-10 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 items-end max-w-4xl border border-gray-100">
            <div className="md:col-span-1">
              <Label htmlFor="search-filter" className="text-xs md:text-sm">
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search-filter"
                  placeholder="Product or Seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 md:h-10 text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter" className="text-xs md:text-sm">
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  id="category-filter"
                  className="h-9 md:h-10 text-sm"
                >
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city-filter" className="text-xs md:text-sm">
                City
              </Label>
              <Select
                value={selectedCity}
                onValueChange={(value) =>
                  setSelectedCity(value === "all-cities" ? "" : value)
                }
              >
                <SelectTrigger id="city-filter" className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCities.map((city) => (
                    <SelectItem
                      key={city}
                      value={city === "All Cities" ? "all-cities" : city}
                    >
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {status === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          )}

          {status === "failed" && (
            <div className="text-center py-12">
              <ServerCrash className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Failed to Load Products
              </h3>
              <p className="text-gray-600">{String(error)}</p>
            </div>
          )}

          {status === "succeeded" && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="w-full flex items-center justify-center text-center py-12 text-gray-500 bg-white/50 rounded-xl border border-dashed mx-2">
                  <div>
                    <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="font-semibold text-sm">No products found.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* =====================================
                      DESKTOP VIEW: Carousel
                     ===================================== */}
                  <div className="hidden md:block relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/90 shadow-lg hover:bg-white border-orange-100"
                      onClick={() => scroll("left")}
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </Button>
                    <div
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto scroll-smooth py-6 -mx-4 px-4 snap-x snap-mandatory"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      <div className="flex gap-6">
                        {filteredProducts.map((product) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            onInquiryClick={handleOpenInquiryModal}
                            isMobile={false}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-white/90 shadow-lg hover:bg-white border-orange-100"
                      onClick={() => scroll("right")}
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </Button>
                  </div>

                  {/* =====================================
                      MOBILE VIEW: Grid + Pagination
                     ===================================== */}
                  <div className="md:hidden">
                    <div className="grid grid-cols-2 gap-2">
                      <AnimatePresence mode="wait">
                        {currentMobileItems.map((product) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ProductCard
                              product={product}
                              onInquiryClick={handleOpenInquiryModal}
                              isMobile={true}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Mobile Pagination Controls */}
                    {totalMobilePages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleMobilePageChange(Math.max(1, mobilePage - 1))
                          }
                          disabled={mobilePage === 1}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: totalMobilePages }).map(
                          (_, idx) => {
                            if (
                              totalMobilePages > 5 &&
                              Math.abs(mobilePage - (idx + 1)) > 1 &&
                              idx !== 0 &&
                              idx !== totalMobilePages - 1
                            )
                              return null;
                            if (
                              totalMobilePages > 5 &&
                              Math.abs(mobilePage - (idx + 1)) === 2 &&
                              idx !== 0 &&
                              idx !== totalMobilePages - 1
                            )
                              return (
                                <span
                                  key={idx}
                                  className="text-xs text-gray-400"
                                >
                                  ..
                                </span>
                              );

                            return (
                              <Button
                                key={idx}
                                variant={
                                  mobilePage === idx + 1 ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => handleMobilePageChange(idx + 1)}
                                className={`h-8 w-8 p-0 rounded-full text-xs font-bold ${mobilePage === idx + 1 ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                              >
                                {idx + 1}
                              </Button>
                            );
                          }
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleMobilePageChange(
                              Math.min(totalMobilePages, mobilePage + 1)
                            )
                          }
                          disabled={mobilePage === totalMobilePages}
                          className="h-8 w-8 p-0 rounded-full"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
      {isModalOpen && (
        <InquiryModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default SellersSection;
