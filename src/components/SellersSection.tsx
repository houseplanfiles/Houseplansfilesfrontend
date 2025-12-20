"use client";

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
  Store, // Shop Icon
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Redux Imports (Ensure paths are correct)
import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicSellerProducts } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

// UI Components
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
// import DisplayPrice from "@/components/DisplayPrice"; // Uncomment if needed

// --- Inquiry Modal ---
const InquiryModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector((state) => state.sellerInquiries);
  const { userInfo } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: `I am interested in your product: "${product.name}". Please provide more details.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry sent successfully!");
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
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
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
            For: <span className="font-semibold">{product.name}</span>
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
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Send Inquiry"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- Product Card ---
const ProductCard = ({ product, onInquiryClick, isMobile = false }) => (
  <div
    className={`bg-white rounded-xl flex flex-col group transition-all duration-300 border border-gray-100 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1
    ${isMobile ? "w-full p-2 shadow-sm" : "w-80 flex-shrink-0 snap-start p-4 shadow-md"}`}
  >
    <div className="relative overflow-hidden rounded-lg bg-gray-100">
      <img
        src={product.image || "https://via.placeholder.com/400x300"}
        alt={product.name}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${isMobile ? "h-32" : "h-48"}`}
      />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm">
        <MapPin size={10} className="text-orange-500" /> {product.city}
      </div>
    </div>

    <div className={`flex flex-col flex-grow ${isMobile ? "pt-2" : "pt-3"}`}>
      <p className="text-orange-600 font-bold uppercase tracking-wider text-[10px] sm:text-xs mb-1">
        {product.category}
      </p>
      <h3
        className={`font-bold text-gray-900 leading-tight mb-1 ${isMobile ? "text-xs line-clamp-2 h-8" : "text-lg truncate"}`}
      >
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400">Seller</span>
          <span className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[100px]">
            {product.seller?.businessName || "Verified"}
          </span>
        </div>
        <div className="ml-auto font-extrabold text-gray-900 text-sm sm:text-lg">
          ₹{product.price?.toLocaleString()}
        </div>
      </div>

      <Button
        onClick={() => onInquiryClick(product)}
        className={`w-full bg-gray-900 hover:bg-orange-600 text-white mt-3 ${isMobile ? "h-8 text-xs" : "h-10 text-sm"}`}
      >
        Send Inquiry
      </Button>
    </div>
  </div>
);

// --- MAIN COMPONENT: SellersSection ---
const SellersSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, status, error } = useSelector(
    (state) => state.sellerProducts
  );
  const scrollContainerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("all-cities");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mobile Pagination
  const [mobilePage, setMobilePage] = useState(1);
  const mobileItemsPerPage = 4;

  useEffect(() => {
    dispatch(fetchPublicSellerProducts({ limit: 50 }));
  }, [dispatch]);

  const uniqueCategories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
      ).sort(),
    ],
    [products]
  );
  const uniqueCities = useMemo(
    () => [
      "All Cities",
      ...Array.from(
        new Set(products.map((p) => p.city).filter(Boolean))
      ).sort(),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let items = products;
    if (selectedCategory !== "All")
      items = items.filter((p) => p.category === selectedCategory);
    if (selectedCity !== "all-cities")
      items = items.filter((p) => p.city === selectedCity);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.seller?.businessName?.toLowerCase().includes(lower)
      );
    }
    return items;
  }, [products, searchTerm, selectedCategory, selectedCity]);

  // Mobile Pagination Logic
  const totalMobilePages = Math.ceil(
    filteredProducts.length / mobileItemsPerPage
  );
  const currentMobileItems = filteredProducts.slice(
    (mobilePage - 1) * mobileItemsPerPage,
    mobilePage * mobileItemsPerPage
  );

  const handleOpenInquiryModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -344 : 344,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="bg-gray-50 pb-16">
        {/* --- 1. HERO BANNER --- */}
        <div className="relative py-16 sm:py-24 overflow-hidden">
          {/* Background Image: Using exactly what you had before */}
          <div className="absolute inset-0">
            <img
              src="/marketplace.png"
              alt="Marketplace"
              className="w-full h-full object-cover"
            />
            {/* Dark Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/30" />
          </div>

          {/* Banner Content (Text + Button) */}
          <div className="relative max-w-7xl mx-auto px-4 text-center z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
              Marketplace
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light">
              Find the best construction materials & sellers in one place.
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/register")}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 text-lg flex items-center gap-2"
              >
                <Store className="w-5 h-5" />
                Register Your Shop
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* --- 2. OVERLAPPING FILTERS --- */}
          {/* -mt-16 moves it UP over the banner */}
          <div className="relative -mt-16 z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Search */}
              <div className="md:col-span-2">
                <Label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white text-base"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 bg-gray-50 text-sm focus:bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div>
                <Label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wide">
                  City
                </Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-12 bg-gray-50 text-sm focus:bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCities.map((c) => (
                      <SelectItem
                        key={c}
                        value={c === "All Cities" ? "all-cities" : c}
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* --- 3. PRODUCTS CONTENT --- */}
          {status === "loading" && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
          )}

          {status === "failed" && (
            <div className="text-center py-12">
              <ServerCrash className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <p className="text-gray-600">Failed to load products.</p>
            </div>
          )}

          {status === "succeeded" && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No products found.</p>
                </div>
              ) : (
                <>
                  {/* DESKTOP CAROUSEL */}
                  <div className="hidden md:block relative px-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 shadow-lg bg-white border-gray-100 hover:bg-gray-50"
                      onClick={() => scroll("left")}
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </Button>
                    <div
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto scroll-smooth py-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                      style={{ scrollbarWidth: "none" }}
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
                      className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 shadow-lg bg-white border-gray-100 hover:bg-gray-50"
                      onClick={() => scroll("right")}
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </Button>
                  </div>

                  {/* MOBILE GRID + PAGINATION */}
                  <div className="md:hidden">
                    <div className="grid grid-cols-2 gap-3">
                      <AnimatePresence mode="wait">
                        {currentMobileItems.map((product) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
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
                    {/* Mobile Pagination */}
                    {totalMobilePages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setMobilePage((p) => Math.max(1, p - 1))
                          }
                          disabled={mobilePage === 1}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium text-gray-600">
                          Page {mobilePage} of {totalMobilePages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setMobilePage((p) =>
                              Math.min(totalMobilePages, p + 1)
                            )
                          }
                          disabled={mobilePage === totalMobilePages}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

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
