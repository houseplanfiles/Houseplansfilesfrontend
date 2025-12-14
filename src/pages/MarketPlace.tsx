"use client";

import React, { useState, useEffect, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  ServerCrash,
  Search,
  Package,
  X,
  Send,
  MapPin,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Store, // ✅ Added Store Icon
} from "lucide-react";

// ✅ Added useNavigate
import { useNavigate } from "react-router-dom";

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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- 1. FULL SCREEN IMAGE VIEWER ---
const ImageViewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-red-600/80 rounded-full p-3 transition-all cursor-pointer shadow-lg border border-white/20"
      >
        <X size={32} />
      </button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-7xl w-full h-full flex items-center justify-center pointer-events-none"
      >
        <img
          src={imageUrl}
          alt="Full View"
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-white/10 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </motion.div>
  );
};

// --- 2. INQUIRY MODAL ---
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
    message: `Hi, I saw your listing for "${product.name}" on the marketplace. Please send me the best price.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry Sent! Seller will contact you.");
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send."));
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Contact Seller</h2>
            <p className="text-sm text-gray-400 mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1"
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
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={3}
                className="mt-1 resize-none"
              />
            </div>
            <Button
              type="submit"
              disabled={actionStatus === "loading"}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-md font-medium"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Inquiry
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- 3. PRODUCT CARD (Optimized for Mobile 2-Cols) ---
const ProductCard = ({ product, onInquiryClick, onImageClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
  >
    {/* Image Section - Smaller height on mobile */}
    <div
      className="relative h-36 sm:h-64 overflow-hidden bg-gray-100 cursor-zoom-in"
      onClick={() => onImageClick(product.image)}
    >
      <img
        src={product.image || "https://via.placeholder.com/400x300"}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* City Badge - Smaller font on mobile */}
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-md px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 flex items-center gap-1 shadow-sm z-10">
        <MapPin size={10} className="sm:w-3 sm:h-3 text-orange-500" />{" "}
        <span className="truncate max-w-[60px] sm:max-w-none">
          {product.city}
        </span>
      </div>

      {/* Category Badge - Smaller on mobile */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-orange-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
        {product.category}
      </div>
    </div>

    {/* Content Section - Compact padding on mobile */}
    <div className="p-3 sm:p-5 flex flex-col flex-grow">
      <div className="mb-2">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2 sm:line-clamp-1 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
          By:{" "}
          <span className="font-medium text-gray-600">
            {product.seller?.businessName || "Verified Seller"}
          </span>
        </p>
      </div>

      <div className="mt-auto pt-2 sm:pt-4 border-t border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex flex-col">
          <span className="hidden sm:block text-xs text-gray-400">Price</span>
          <span className="text-sm sm:text-xl font-extrabold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onInquiryClick(product);
          }}
          className="w-full sm:w-auto h-8 sm:h-10 text-xs sm:text-sm bg-gray-900 hover:bg-orange-600 text-white rounded-lg px-3 sm:px-5 transition-colors"
        >
          Inquiry
        </Button>
      </div>
    </div>
  </motion.div>
);

// --- 4. MAIN PAGE ---
const MarketplacePage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize Navigation

  const { products, status, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("all-cities");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    dispatch(fetchPublicSellerProducts({ limit: 200 }));
  }, [dispatch]);

  // Derived Filtered Data
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCity]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const handleOpenInquiry = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar />

      {/* --- Banner --- */}
      <div className="relative h-[300px] md:h-[450px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-4">
            Marketplace
          </h1>
          <p className="text-gray-300 text-sm md:text-lg max-w-2xl mb-8">
            Find the best construction materials & sellers in one place.
          </p>

          {/* ✅ REGISTER SHOP BUTTON ADDED HERE */}
          <Button
            onClick={() => navigate("/register")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-full shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 text-lg"
          >
            <Store className="w-5 h-5 mr-2" />
            Register Your Shop
          </Button>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 -mt-10 md:-mt-16 relative z-20 pb-20">
        {/* --- Filters Card --- */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-lg md:shadow-xl border border-gray-100 p-3 md:p-6 mb-4 md:mb-10">
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 md:items-end">
            {/* Search - Full width on mobile */}
            <div className="md:col-span-2">
              <Label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 md:pl-10 h-9 md:h-11 bg-gray-50 border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Category & City - Side by side on mobile */}
            <div className="grid grid-cols-2 gap-2 md:contents">
              <div>
                <Label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-9 md:h-11 bg-gray-50 border-gray-200 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="text-xs md:text-sm"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-1 block">
                  City
                </Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-9 md:h-11 bg-gray-50 border-gray-200 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCities.map((c) => (
                      <SelectItem
                        key={c}
                        value={c === "All Cities" ? "all-cities" : c}
                        className="text-xs md:text-sm"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Active Filters Pills - Optional but nice to have */}
          {(selectedCategory !== "All" ||
            selectedCity !== "all-cities" ||
            searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                  <Search className="w-3 h-3" />
                  {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCity !== "all-cities" && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  <MapPin className="w-3 h-3" />
                  {selectedCity}
                  <button
                    onClick={() => setSelectedCity("all-cities")}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        {/* --- Product Grid (Updated for 2 Columns Mobile) --- */}
        {status === "loading" ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
          </div>
        ) : status === "failed" ? (
          <div className="py-20 text-center">
            <ServerCrash className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Failed to load data</h3>
            <p className="text-gray-500">{String(error)}</p>
          </div>
        ) : (
          <>
            {displayedProducts.length > 0 ? (
              // ✅ FIX: grid-cols-2 for mobile
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onInquiryClick={handleOpenInquiry}
                      onImageClick={setFullScreenImage}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try changing filters or search term.
                </p>
              </div>
            )}

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="mt-10 md:mt-16 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full h-8 w-8 sm:h-10 sm:w-10 border-gray-300 hover:border-orange-500 hover:text-orange-600"
                >
                  <ChevronLeft size={16} className="sm:w-[18px]" />
                </Button>

                <div className="flex gap-1 sm:gap-2 mx-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full text-xs sm:text-sm font-bold transition-all ${
                          currentPage === page
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 transform scale-110"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-orange-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-full h-8 w-8 sm:h-10 sm:w-10 border-gray-300 hover:border-orange-500 hover:text-orange-600"
                >
                  <ChevronRight size={16} className="sm:w-[18px]" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* --- Modals Overlay --- */}
      <AnimatePresence>
        {isModalOpen && (
          <InquiryModal
            product={selectedProduct}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        {fullScreenImage && (
          <ImageViewModal
            imageUrl={fullScreenImage}
            onClose={() => setFullScreenImage(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MarketplacePage;
