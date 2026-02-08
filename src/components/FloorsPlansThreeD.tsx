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
import house3 from "@/assets/house-3.jpg";
import DisplayPrice from "@/components/DisplayPrice";
import { useCurrency } from "@/contexts/CurrencyContext";
import { fetchProducts, fetchHomeElevations } from "@/lib/features/products/productSlice";
import { fetchAllApprovedPlans, fetchHomeProfessionalElevations } from "@/lib/features/professional/professionalPlanSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";

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

import { AppDispatch, RootState } from "@/lib/store";

const HomeElevations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [mobilePage, setMobilePage] = useState(1);
  const mobileItemsPerPage = 4;
  const { symbol, rate } = useCurrency();

  const { homeElevations: adminProducts, listStatus: adminStatus } = useSelector(
    (state: any) => state.products
  );
  const { homeElevations: professionalPlans, listStatus: profStatus } = useSelector(
    (state: any) => state.professionalPlans
  );
  const { userInfo } = useSelector((state: any) => state.user);
  const { orders } = useSelector((state: any) => state.orders);

  // ✅ FETCH ONLY ELEVATIONS (3D PLANS)
  useEffect(() => {
    const params = {
      limit: 12,
      sortBy: "newest",
      planCategory: "elevations", // ✅ Only elevations
    };

    dispatch(fetchHomeElevations(params));
    dispatch(fetchHomeProfessionalElevations(params));

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
    const combinedList = [
      ...(Array.isArray(adminProducts) ? adminProducts : []),
      ...(Array.isArray(professionalPlans) ? professionalPlans : []),
    ];

    console.log(
      "🔍 HomeElevations - Total products fetched:",
      combinedList.length
    );

    if (combinedList.length === 0) return [];

    // ✅ Filter for elevation/3D products
    const filtered = combinedList.filter((product) => {
      const cat = String(product.category || "").toLowerCase();
      const categoriesStr = String(product.Categories || "").toLowerCase();
      const planCat = String(product.planCategory || "").toLowerCase();
      const pType = String(product.planType || "").toLowerCase();

      const isElevation =
        cat.includes("elevation") ||
        cat.includes("3d") ||
        categoriesStr.includes("elevation") ||
        categoriesStr.includes("3d") ||
        planCat.includes("elevation") ||
        planCat.includes("3d") ||
        pType.includes("elevation") ||
        pType.includes("3d");

      // Debug log
      if (product._id) {
        console.log(
          `Product: ${product.name || product.planName}, IsElevation: ${isElevation}`
        );
      }

      return isElevation;
    });

    console.log("✅ Filtered elevation products:", filtered.length);

    return filtered.slice(0, 12).map((product) => {
      const productName =
        product.name || product.planName || product.Name || "Untitled Plan";

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

      const getImageSource = () => {
        const primaryImage =
          product.mainImage || product.image || product.Images;
        if (primaryImage && typeof primaryImage === "string") {
          return primaryImage.split(",")[0].trim();
        }
        return house3;
      };

      return {
        ...product,
        id: product._id,
        displayName: productName,
        slug: `${slugify(productName)}-${product._id}`,
        mainImage: getImageSource(),
        plotAreaDisplay:
          product.plotArea ||
          (product["Attribute 2 value(s)"]
            ? parseInt(
              String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, "")
            )
            : "N/A"),
        roomsDisplay: product.rooms || product["Attribute 3 value(s)"] || "N/A",
        bathrooms: product.bathrooms || "N/A",
        kitchen: product.kitchen || "N/A",
        plotSizeDisplay:
          product.plotSize || product["Attribute 1 value(s)"] || "N/A",
        categoryDisplay: "Floor Plan + 3D",
        isSale,
        displayPrice,
        regularPrice,
        videoId: getYouTubeId(product.youtubeLink),
        isWishlisted: isInWishlist(product._id),
        hasPurchased: purchasedProductIds.has(product._id),
      };
    });
  }, [adminProducts, professionalPlans, purchasedProductIds, isInWishlist]);

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
        description: "Please log in to add items to your wishlist.",
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
      addToWishlist(product.id);
      toast({ title: "Added to Wishlist!" });
    }
  };

  const handleDownload = (product) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to download.",
        variant: "destructive",
      });
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

  const ProductCard = ({ product, isMobile = false }) => (
    <div
      className={`bg-card rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isMobile ? "w-full" : "flex-shrink-0 w-[320px] snap-start"}`}
    >
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
            Sale!
          </div>
        )}
        {product.hasPurchased && (
          <div
            className={`absolute top-2 right-2 bg-green-500 text-white font-semibold rounded-full shadow-md z-10 ${isMobile ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2 sm:px-3 py-1"}`}
          >
            Purchased
          </div>
        )}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-bold rounded-md shadow-lg z-10 text-center max-w-[95%] ${isMobile ? "px-2 py-0.5 text-[9px]" : "px-4 py-1.5 text-sm"}`}
        >
          <p className="truncate">{product.plotSizeDisplay}</p>
          {!isMobile && (
            <p className="text-xs font-normal">
              {product.hasPurchased ? "Download pdf" : "Purchase to download"}
            </p>
          )}
        </div>
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

      <div className={`border-b ${isMobile ? "p-1.5" : "p-2 sm:p-4"}`}>
        <div
          className={`grid grid-cols-2 text-center ${isMobile ? "gap-1" : "gap-2 sm:gap-4"}`}
        >
          <div className={`rounded-md ${isMobile ? "p-1" : "p-1 sm:p-2"}`}>
            <p
              className={`text-gray-500 ${isMobile ? "text-[9px]" : "text-xs sm:text-sm"}`}
            >
              Area
            </p>
            <p
              className={`font-semibold text-gray-800 ${isMobile ? "text-[10px]" : "text-xs sm:text-base"}`}
            >
              {product.plotAreaDisplay}
            </p>
          </div>
          <div
            className={`bg-teal-50 rounded-md ${isMobile ? "p-1" : "p-1 sm:p-2"}`}
          >
            <p
              className={`text-gray-500 ${isMobile ? "text-[9px]" : "text-xs sm:text-sm"}`}
            >
              Rooms
            </p>
            <p
              className={`font-semibold text-gray-800 ${isMobile ? "text-[10px]" : "text-xs sm:text-base"}`}
            >
              {product.roomsDisplay}
            </p>
          </div>
          <div
            className={`bg-teal-50 rounded-md ${isMobile ? "p-1" : "p-1 sm:p-2"}`}
          >
            <p
              className={`text-gray-500 ${isMobile ? "text-[9px]" : "text-xs sm:text-sm"}`}
            >
              Baths
            </p>
            <p
              className={`font-semibold text-gray-800 ${isMobile ? "text-[10px]" : "text-xs sm:text-base"}`}
            >
              {product.bathrooms}
            </p>
          </div>
          <div className={`rounded-md ${isMobile ? "p-1" : "p-1 sm:p-2"}`}>
            <p
              className={`text-gray-500 ${isMobile ? "text-[9px]" : "text-xs sm:text-sm"}`}
            >
              Kitchen
            </p>
            <p
              className={`font-semibold text-gray-800 ${isMobile ? "text-[10px]" : "text-xs sm:text-base"}`}
            >
              {product.kitchen}
            </p>
          </div>
        </div>
      </div>

      <div className={`${isMobile ? "p-2" : "p-2 sm:p-4"}`}>
        <p
          className={`text-gray-500 uppercase truncate ${isMobile ? "text-[9px]" : "text-xs sm:text-sm"}`}
        >
          {product.categoryDisplay}
        </p>
        <h3
          className={`font-bold text-gray-800 mt-0.5 truncate ${isMobile ? "text-xs" : "text-sm sm:text-lg"}`}
        >
          {product.displayName}
        </h3>

        <div
          className={`flex items-baseline flex-wrap ${isMobile ? "gap-1 mt-1" : "gap-2 mt-2"}`}
        >
          {product.isSale && parseFloat(String(product.regularPrice)) > 0 && (
            <s
              className={`text-gray-400 ${isMobile ? "text-[10px]" : "text-xs sm:text-md"}`}
            >
              <DisplayPrice
                inrPrice={parseFloat(String(product.regularPrice))}
              />
            </s>
          )}
          <span
            className={`font-bold text-gray-900 ${isMobile ? "text-sm" : "text-base sm:text-xl"}`}
          >
            <DisplayPrice inrPrice={parseFloat(String(product.displayPrice))} />
          </span>
          {product.isSale && (
            <span
              className={`bg-green-100 text-green-800 rounded-full font-semibold ${isMobile ? "text-[8px] px-1 py-0.5" : "text-xs px-1.5 sm:px-2 py-0.5 sm:py-1"}`}
            >
              SAVE {symbol}
              {(
                (parseFloat(String(product.regularPrice)) -
                  parseFloat(String(product.displayPrice))) *
                rate
              ).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          )}
        </div>

        <div
          className={`grid grid-cols-1 ${isMobile ? "gap-1.5 mt-2" : "gap-2 mt-3 sm:mt-4"}`}
        >
          <Link to={`/product/${product.slug}`}>
            <Button
              className={`w-full bg-slate-800 text-white hover:bg-slate-700 ${isMobile ? "text-[10px] h-7" : "text-xs sm:text-base h-8 sm:h-auto"}`}
            >
              Read more
            </Button>
          </Link>
          <Button
            className={`w-full text-white ${isMobile ? "text-[10px] h-7" : "text-xs sm:text-base h-8 sm:h-auto"} ${product.hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
            onClick={() => handleDownload(product)}
            disabled={!product.hasPurchased}
          >
            {product.hasPurchased ? (
              <>
                <Download
                  className={`mr-1 ${isMobile ? "h-2.5 w-2.5" : "h-3 w-3 sm:h-4 sm:w-4"}`}
                />
                PDF
              </>
            ) : (
              <>
                <Lock
                  className={`mr-1 ${isMobile ? "h-2.5 w-2.5" : "h-3 w-3 sm:h-4 sm:w-4"}`}
                />
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
    <section className="py-6 md:py-12 bg-background border-b border-gray-200">
      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />
      <div className="max-w-7xl mx-auto px-2 md:px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-end mb-4 md:mb-8 relative">
          <div className="text-center">
            <h2 className="text-lg md:text-3xl font-bold text-foreground">
              Latest Floor Plans + 3D
            </h2>
            <p className="text-[10px] md:text-base text-muted-foreground mt-1 md:mt-2">
              Explore our newest residential layouts
            </p>
          </div>
          <Link
            to="/3d-plans"
            className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2"
          >
            <Button variant="outline">View All Designs</Button>
          </Link>
        </div>

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
            <div className="flex gap-8">
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
            <Link to="/3d-plans">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
              >
                View All Designs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeElevations;
