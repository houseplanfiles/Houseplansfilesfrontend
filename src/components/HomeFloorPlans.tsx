import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  Youtube,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg";
import DisplayPrice from "@/components/DisplayPrice";

// --- HELPER FUNCTIONS ---
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// --- VIDEO MODAL ---
const VideoModal = ({ videoId, onClose }) => {
  if (!videoId) return null;
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, controls: 1 },
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video bg-black rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 z-10"
        >
          <X size={24} />
        </button>
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const HomeFloorPlans = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { products, listStatus } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(
      fetchProducts({
        planCategory: "floor-plans",
        limit: 50,
        sortBy: "newest",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) dispatch(fetchMyOrders());
  }, [dispatch, userInfo]);

  const purchasedProductIds = useMemo(() => {
    if (!userInfo || !Array.isArray(orders)) return new Set();
    const paidItems = orders
      .filter((order) => order.isPaid)
      .flatMap((order) => order.orderItems);
    return new Set(
      paidItems.map((item) => item.productId?._id || item.productId)
    );
  }, [orders, userInfo]);

  const processedData = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    const floorPlansOnly = products.filter((p) => {
      const cat = String(p.category || p.Categories).toLowerCase();
      return cat.includes("floor") || cat.includes("house plan");
    });

    return floorPlansOnly.map((product) => {
      const productName = product.name || product.Name || "Untitled Plan";
      const regularPrice =
        Number(product.price) || Number(product["Regular price"]) || 0;
      const salePrice =
        Number(product.salePrice) || Number(product["Sale price"]) || 0;
      const isSale = salePrice > 0 && salePrice < regularPrice;

      return {
        ...product,
        id: product._id,
        displayName: productName,
        slug: `${slugify(productName)}-${product._id}`,
        mainImage:
          product.mainImage ||
          product.image ||
          product.Images?.split(",")[0]?.trim() ||
          house3,
        plotAreaDisplay:
          product.plotArea || String(product["Attribute 2 value(s)"] || "N/A"),
        roomsDisplay:
          product.rooms || String(product["Attribute 3 value(s)"] || "N/A"),
        plotSizeDisplay:
          product.plotSize || String(product["Attribute 1 value(s)"] || "N/A"),
        directionDisplay:
          product.direction || String(product["Attribute 4 value(s)"] || "N/A"),
        categoryDisplay:
          (Array.isArray(product.category) && product.category[0]) ||
          product.Categories?.split(",")[0] ||
          "Floor Plan",
        isSale,
        displayPrice: isSale ? salePrice : regularPrice,
        regularPrice,
        videoId: getYouTubeId(product.youtubeLink),
        isWishlisted: isInWishlist(product._id),
        hasPurchased: purchasedProductIds.has(product._id),
      };
    });
  }, [products, purchasedProductIds, isInWishlist]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const section = document.getElementById("floor-plans-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const handleWishlistToggle = (product) => {
    if (!userInfo)
      return toast({
        variant: "destructive",
        title: "Please Login",
        description: "Login to manage wishlist.",
      });
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist" });
    } else {
      addToWishlist(product);
      toast({ title: "Added to Wishlist!" });
    }
  };

  const handleDownload = (product) => {
    if (!product.hasPurchased)
      return toast({ variant: "destructive", title: "Purchase Required" });
    const files = product.planFile || [];
    const fileUrl = Array.isArray(files) ? files[0] : files;

    if (!fileUrl)
      return toast({ variant: "destructive", title: "No Files Found" });

    window.open(fileUrl, "_blank");
    toast({ title: "Download Started" });
  };

  if (listStatus === "loading")
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  if (processedData.length === 0) return null;

  return (
    <section
      id="floor-plans-section"
      className="py-6 md:py-12 bg-background border-b"
    >
      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />

      {/* 
         CHANGED: px-1 (Reduced padding) to make container wider on mobile 
      */}
      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-end mb-4 md:mb-8">
          <div className="text-center">
            <h2 className="text-lg md:text-3xl font-bold text-foreground">
              Latest Floor Plans
            </h2>
            <p className="text-[10px] md:text-base text-muted-foreground mt-1 md:mt-2">
              Explore our newest residential layouts
            </p>
            <div className="mt-2 md:mt-3 h-1 w-16 md:w-24 bg-primary mx-auto rounded-full"></div>
          </div>
        </div>

        {/* 
            GRID LAYOUT CHANGES:
            - gap-2: Reduced gap between cards to make them wider.
        */}
        <div className="min-h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            <AnimatePresence mode="wait">
              {currentItems.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-card rounded-lg md:rounded-2xl overflow-hidden group transition-all duration-300 border border-gray-100 hover:border-primary hover:shadow-xl w-full flex flex-col"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* --- TOP IMAGE SECTION --- */}
                  {/* CHANGED: h-28 (Height Reduced) */}
                  <div className="relative border-b bg-muted/20 h-28 md:h-56 shrink-0">
                    <Link
                      to={`/product/${product.slug}`}
                      className="block h-full w-full"
                    >
                      <img
                        src={product.mainImage}
                        alt={product.displayName}
                        className="w-full h-full object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    {product.isSale && (
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white text-[9px] md:text-xs font-semibold px-1.5 py-0.5 md:px-3 md:py-1 rounded-md shadow-md z-10">
                        Sale
                      </div>
                    )}
                    {product.hasPurchased && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] md:text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md z-10 whitespace-nowrap">
                        Purchased
                      </div>
                    )}

                    {/* Action Buttons (Heart/Video) */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col space-y-1.5 md:space-y-2">
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`w-6 h-6 md:w-9 md:h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                          product.isWishlisted
                            ? "text-red-500"
                            : "text-foreground hover:text-primary"
                        }`}
                      >
                        <Heart
                          className="w-3 h-3 md:w-5 md:h-5"
                          fill={product.isWishlisted ? "currentColor" : "none"}
                        />
                      </button>
                      {product.videoId && (
                        <button
                          onClick={() => setPlayingVideoId(product.videoId)}
                          className="w-6 h-6 md:w-9 md:h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
                        >
                          <Youtube className="w-3 h-3 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* --- ATTRIBUTES SECTION --- */}
                  {/* CHANGED: p-1.5 (Reduced Padding) */}
                  <div className="p-1.5 md:p-4 border-b">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 text-center">
                      <div className="bg-gray-50 rounded-md p-1 md:p-2">
                        <p className="text-[9px] md:text-xs text-gray-500">
                          Area
                        </p>
                        <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
                          {product.plotAreaDisplay}
                        </p>
                      </div>
                      <div className="bg-teal-50 rounded-md p-1 md:p-2">
                        <p className="text-[9px] md:text-xs text-gray-500">
                          BHK
                        </p>
                        <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
                          {product.roomsDisplay}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-md p-1 md:p-2">
                        <p className="text-[9px] md:text-xs text-gray-500">
                          Size
                        </p>
                        <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
                          {product.plotSizeDisplay}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-md p-1 md:p-2">
                        <p className="text-[9px] md:text-xs text-gray-500">
                          Facing
                        </p>
                        <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
                          {product.directionDisplay || "Any"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* --- INFO & BUTTONS SECTION --- */}
                  <div className="p-2 md:p-4 flex flex-col flex-grow justify-between">
                    <div className="mb-2 md:mb-3">
                      <p className="text-[9px] md:text-xs text-gray-500 uppercase font-medium line-clamp-1">
                        {product.categoryDisplay}
                      </p>
                      <h3 className="text-xs md:text-xl font-bold text-gray-800 mt-0.5 md:mt-1 line-clamp-1">
                        {product.displayName}
                      </h3>
                      <div className="flex items-baseline gap-1 md:gap-2 mt-1 flex-wrap">
                        {product.isSale && (
                          <span className="text-[10px] md:text-sm text-gray-400 line-through">
                            <DisplayPrice inrPrice={product.regularPrice} />
                          </span>
                        )}
                        <span className="text-sm md:text-xl font-bold text-gray-900">
                          <DisplayPrice inrPrice={product.displayPrice} />
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2 mt-auto">
                      <Link to={`/product/${product.slug}`} className="w-full">
                        {/* CHANGED: h-7 (Reduced button height), text-[10px] */}
                        <Button
                          size="sm"
                          className="w-full bg-slate-800 text-white hover:bg-slate-700 text-[10px] md:text-sm h-7 md:h-10"
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`w-full text-[10px] md:text-sm h-7 md:h-10 ${
                          product.hasPurchased
                            ? "border-green-500 text-green-600"
                            : ""
                        }`}
                        onClick={() => handleDownload(product)}
                        disabled={!product.hasPurchased}
                      >
                        {product.hasPurchased ? (
                          <>
                            <Download className="mr-1 h-2.5 w-2.5 md:h-4 md:w-4" />{" "}
                            PDF
                          </>
                        ) : (
                          <>
                            <Lock className="mr-1 h-2.5 w-2.5 md:h-4 md:w-4" />{" "}
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="mt-6 md:mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`p-1.5 md:p-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-primary/10 hover:text-primary hover:border-primary shadow-sm"
              } transition-all duration-300`}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              if (
                totalPages > 5 &&
                Math.abs(currentPage - (i + 1)) > 2 &&
                i + 1 !== 1 &&
                i + 1 !== totalPages
              ) {
                return null;
              }
              if (
                totalPages > 5 &&
                Math.abs(currentPage - (i + 1)) === 3 &&
                i + 1 !== 1 &&
                i + 1 !== totalPages
              ) {
                return (
                  <span key={i} className="px-1 text-xs text-gray-400">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-7 h-7 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-bold border transition-all duration-300 ${
                    currentPage === i + 1
                      ? "bg-primary text-primary-foreground border-primary shadow-lg transform scale-110"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-primary/10 hover:text-primary hover:border-primary"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`p-1.5 md:p-2 rounded-lg border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-primary/10 hover:text-primary hover:border-primary shadow-sm"
              } transition-all duration-300`}
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        )}

        <div className="text-center mt-2 md:mt-4">
          <p className="text-[10px] md:text-xs text-muted-foreground">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, processedData.length)} of{" "}
            {processedData.length} plans
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeFloorPlans;
