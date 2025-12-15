import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lock,
  X,
} from "lucide-react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg"; // Fallback Image
import DisplayPrice from "@/components/DisplayPrice";
// ✅ Import Currency Context
import { useCurrency } from "@/contexts/CurrencyContext";

// ✅ Import Actions
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";

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

// --- MAIN COMPONENT: HOME FLOOR PLANS ---
const HomeFloorPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // --- MOBILE PAGINATION STATE ---
  const [mobilePage, setMobilePage] = useState(1);
  const mobileItemsPerPage = 4;

  // Currency Hook
  const { symbol, rate } = useCurrency();

  // Redux Selectors
  const { products: adminProducts, listStatus: adminStatus } = useSelector(
    (state) => state.products
  );
  const { plans: professionalPlans, listStatus: profStatus } = useSelector(
    (state) => state.professionalPlans
  );
  const { userInfo } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.orders);

  // --- FETCH DATA (STRICTLY FLOOR PLANS) ---
  useEffect(() => {
    const params = {
      limit: 12, // Fetching limited items for homepage
      sortBy: "newest",
      planCategory: "floor-plans", // ✅ STRICTLY FLOOR PLANS
    };

    dispatch(fetchProducts(params));
    dispatch(fetchAllApprovedPlans(params));

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

  // --- MERGE & PROCESS DATA ---
  const processedData = useMemo(() => {
    // 1. Merge Lists
    const combinedList = [
      ...(Array.isArray(adminProducts) ? adminProducts : []),
      ...(Array.isArray(professionalPlans) ? professionalPlans : []),
    ];

    if (combinedList.length === 0) return [];

    // 2. Filter & Map Data
    return combinedList
      .filter((product) => {
        // ✅ EXTRA SECURITY: Ensure we DO NOT show elevations here
        const cat = String(
          product.category || product.Categories
        ).toLowerCase();
        return !cat.includes("elevation") && !cat.includes("3d");
      })
      .slice(0, 12)
      .map((product) => {
        const productName =
          product.name || product.planName || product.Name || "Untitled Plan";

        // Price Logic
        const regularPrice =
          product.price && product.price > 0
            ? product.price
            : product["Regular price"] &&
                parseFloat(String(product["Regular price"])) > 0
              ? parseFloat(String(product["Regular price"]))
              : 0;

        const salePrice =
          product.salePrice && product.salePrice > 0
            ? product.salePrice
            : product["Sale price"] &&
                parseFloat(String(product["Sale price"])) > 0
              ? parseFloat(String(product["Sale price"]))
              : null;

        const isSale =
          salePrice !== null &&
          salePrice > 0 &&
          regularPrice > 0 &&
          salePrice < regularPrice;

        const displayPrice = isSale ? salePrice : regularPrice;

        // Image Logic
        const getImageSource = () => {
          const primaryImage =
            product.mainImage || product.image || product.Images;
          if (primaryImage && typeof primaryImage === "string") {
            return primaryImage.split(",")[0].trim();
          }
          return house3;
        };

        // Category Display
        const categoryDisplay =
          (Array.isArray(product.category) && product.category[0]) ||
          product.Categories?.split(",")[0] ||
          "Floor Plan";

        return {
          ...product,
          id: product._id,
          displayName: productName,
          slug: `${slugify(productName)}-${product._id}`,
          mainImage: getImageSource(),

          // --- ATTRIBUTES (Floor Plans Specific) ---
          plotAreaDisplay:
            product.plotArea ||
            (product["Attribute 2 value(s)"]
              ? parseInt(
                  String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, "")
                )
              : "N/A"),

          roomsDisplay:
            product.rooms || product["Attribute 3 value(s)"] || "N/A",

          plotSizeDisplay:
            product.plotSize || product["Attribute 1 value(s)"] || "N/A",

          directionDisplay:
            product.direction || product["Attribute 4 value(s)"] || "Any",

          categoryDisplay,
          isSale,
          displayPrice,
          regularPrice,
          videoId: getYouTubeId(product.youtubeLink),
          isWishlisted: isInWishlist(product._id),
          hasPurchased: purchasedProductIds.has(product._id),
        };
      });
  }, [adminProducts, professionalPlans, purchasedProductIds, isInWishlist]);

  // --- MOBILE PAGINATION LOGIC ---
  const totalMobilePages = Math.ceil(processedData.length / mobileItemsPerPage);
  const currentMobileItems = processedData.slice(
    (mobilePage - 1) * mobileItemsPerPage,
    mobilePage * mobileItemsPerPage
  );

  const handleMobilePageChange = (page) => {
    setMobilePage(page);
  };

  const handleWishlistToggle = (product) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Login to manage wishlist.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const wishlistItem = {
      productId: product.id,
      name: product.displayName,
      price: product.regularPrice,
      salePrice: product.isSale ? product.displayPrice : null,
      image: product.mainImage,
      size: product.plotSizeDisplay,
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: "Removed from Wishlist" });
    } else {
      addToWishlist(wishlistItem);
      toast({ title: "Added to Wishlist!" });
    }
  };

  const handleDownload = (product) => {
    if (!userInfo) {
      toast({ variant: "destructive", title: "Login Required" });
      navigate("/login");
      return;
    }
    if (!product.hasPurchased)
      return toast({ variant: "destructive", title: "Purchase Required" });

    const files = product.planFile || product["Download 1 URL"] || [];
    const fileUrl = Array.isArray(files) ? files[0] : files;

    if (!fileUrl)
      return toast({ variant: "destructive", title: "No Files Found" });

    window.open(fileUrl, "_blank");
    toast({ title: "Download Started" });
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // --- CARD COMPONENT (Matching your Style) ---
  const ProductCard = ({ product, isMobile = false }) => (
    <div
      className={`bg-card rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isMobile ? "w-full" : "flex-shrink-0 w-[320px] snap-start"}`}
    >
      {/* Top Image Section */}
      <div className={`relative border-b ${isMobile ? "p-2" : "p-3 sm:p-4"}`}>
        <Link to={`/product/${product.slug}`}>
          <img
            src={product.mainImage}
            alt={product.displayName}
            className={`w-full object-contain group-hover:scale-105 transition-transform duration-500 ${isMobile ? "h-28" : "h-40 sm:h-56"}`}
          />
        </Link>
        {product.isSale && (
          <div
            className={`absolute top-2 left-2 bg-red-500 text-white font-semibold rounded-md shadow-md z-10 ${isMobile ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2 sm:px-3 py-1"}`}
          >
            Sale
          </div>
        )}
        {product.hasPurchased && (
          <div
            className={`absolute top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white font-semibold rounded-full shadow-md z-10 whitespace-nowrap ${isMobile ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2 sm:px-3 py-1"}`}
          >
            Purchased
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={`absolute top-2 right-2 flex space-x-2 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
        >
          <button
            onClick={() => handleWishlistToggle(product)}
            className={`bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isMobile ? "w-6 h-6" : "w-7 h-7 sm:w-9 sm:h-9"} ${product.isWishlisted ? "text-red-500 scale-110" : "text-foreground hover:text-primary hover:scale-110"}`}
          >
            <Heart
              className={isMobile ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"}
              fill={product.isWishlisted ? "currentColor" : "none"}
            />
          </button>
          {product.videoId && (
            <button
              onClick={() => setPlayingVideoId(product.videoId)}
              className={`bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600 ${isMobile ? "w-6 h-6" : "w-7 h-7 sm:w-9 sm:h-9"}`}
            >
              <Youtube
                className={isMobile ? "w-3 h-3" : "w-4 h-4 sm:w-5 sm:h-5"}
              />
            </button>
          )}
        </div>
      </div>

      {/* Attributes Section (Area, BHK, Size, Facing) */}
      <div className={`border-b ${isMobile ? "p-1.5" : "p-2 sm:p-4"}`}>
        <div
          className={`grid grid-cols-2 md:grid-cols-4 text-center ${isMobile ? "gap-1" : "gap-2"}`}
        >
          <div className="bg-gray-50 rounded-md p-1 md:p-2">
            <p className="text-[9px] md:text-xs text-gray-500">Area</p>
            <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
              {product.plotAreaDisplay}
            </p>
          </div>
          <div className="bg-teal-50 rounded-md p-1 md:p-2">
            <p className="text-[9px] md:text-xs text-gray-500">BHK</p>
            <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
              {product.roomsDisplay}
            </p>
          </div>
          <div className="bg-blue-50 rounded-md p-1 md:p-2">
            <p className="text-[9px] md:text-xs text-gray-500">Size</p>
            <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
              {product.plotSizeDisplay}
            </p>
          </div>
          <div className="bg-orange-50 rounded-md p-1 md:p-2">
            <p className="text-[9px] md:text-xs text-gray-500">Facing</p>
            <p className="text-[10px] md:text-sm font-semibold text-gray-800 truncate">
              {product.directionDisplay}
            </p>
          </div>
        </div>
      </div>

      {/* Info & Buttons */}
      <div className={`${isMobile ? "p-2" : "p-2 sm:p-4"}`}>
        <div className="mb-2 md:mb-3">
          <p
            className={`text-gray-500 uppercase font-medium line-clamp-1 ${isMobile ? "text-[9px]" : "text-xs"}`}
          >
            {product.categoryDisplay}
          </p>
          <h3
            className={`font-bold text-gray-800 mt-0.5 md:mt-1 line-clamp-1 ${isMobile ? "text-xs" : "text-lg md:text-xl"}`}
          >
            {product.displayName}
          </h3>
          <div className="flex items-baseline gap-1 md:gap-2 mt-1 flex-wrap">
            {product.isSale && (
              <span
                className={`text-gray-400 line-through ${isMobile ? "text-[10px]" : "text-sm"}`}
              >
                <DisplayPrice inrPrice={product.regularPrice} />
              </span>
            )}
            <span
              className={`font-bold text-gray-900 ${isMobile ? "text-sm" : "text-xl"}`}
            >
              <DisplayPrice inrPrice={product.displayPrice} />
            </span>

            {product.isSale && (
              <span
                className={`bg-green-100 text-green-800 rounded-full font-semibold ${isMobile ? "text-[8px] px-1 py-0.5" : "text-xs px-2 py-0.5"}`}
              >
                SAVE {symbol}
                {(
                  (product.regularPrice - product.displayPrice) *
                  rate
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${isMobile ? "gap-1.5" : "gap-2"}`}
        >
          <Link to={`/product/${product.slug}`} className="w-full">
            <Button
              size="sm"
              className={`w-full bg-slate-800 text-white hover:bg-slate-700 ${isMobile ? "text-[10px] h-7" : "text-sm h-10"}`}
            >
              Read more
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className={`w-full ${isMobile ? "text-[10px] h-7" : "text-sm h-10"} ${product.hasPurchased ? "border-green-500 text-green-600" : ""}`}
            onClick={() => handleDownload(product)}
            disabled={!product.hasPurchased}
          >
            {product.hasPurchased ? (
              <>
                <Download
                  className={`mr-1 ${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`}
                />{" "}
                PDF
              </>
            ) : (
              <>
                <Lock
                  className={`mr-1 ${isMobile ? "h-2.5 w-2.5" : "h-4 w-4"}`}
                />{" "}
                Purchase
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const isLoading = adminStatus === "loading" || profStatus === "loading";

  if (isLoading)
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

      <div className="max-w-7xl mx-auto px-1 md:px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-center items-end mb-4 md:mb-8 relative">
          <div className="text-center">
            <h2 className="text-lg md:text-3xl font-bold text-foreground">
              Latest Floor Plans
            </h2>
            <p className="text-[10px] md:text-base text-muted-foreground mt-1 md:mt-2">
              Explore our newest residential layouts
            </p>
            <div className="mt-2 md:mt-3 h-1 w-16 md:w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          {/* View All Button (Desktop) */}
          <Link
            to="/browse-plans"
            className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2"
          >
            <Button variant="outline">View All Plans</Button>
          </Link>
        </div>

        {/* --- DESKTOP VIEW: Slider --- */}
        <div className="hidden md:block relative group/carousel">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card flex shadow-md"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card flex shadow-md"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-6">
              {processedData.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isMobile={false}
                />
              ))}
            </div>
          </div>
        </div>

        {/* --- MOBILE VIEW: Grid --- */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <AnimatePresence mode="wait">
              {currentMobileItems.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} isMobile={true} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile Pagination */}
          {totalMobilePages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleMobilePageChange(Math.max(1, mobilePage - 1))
                }
                disabled={mobilePage === 1}
                className="h-7 px-2"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              {Array.from({ length: totalMobilePages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={mobilePage === idx + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMobilePageChange(idx + 1)}
                  className="h-7 w-7 p-0 text-xs"
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleMobilePageChange(
                    Math.min(totalMobilePages, mobilePage + 1)
                  )
                }
                disabled={mobilePage === totalMobilePages}
                className="h-7 px-2"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="mt-4 text-center">
            <Link to="/browse-plans">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
              >
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFloorPlans;
