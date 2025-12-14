import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Download,
  Loader2,
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Lock,
  X,
} from "lucide-react";
import YouTube from "react-youtube";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product, fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import { useToast } from "@/components/ui/use-toast";
import house3 from "@/assets/house-3.jpg";
import DisplayPrice from "@/components/DisplayPrice";

// --- HELPER FUNCTIONS ---

const slugify = (text: any) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// --- VIDEO MODAL COMPONENT ---

const VideoModal = ({
  videoId,
  onClose,
}: {
  videoId: string | null;
  onClose: () => void;
}) => {
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
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const FeaturedProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const { products, listStatus, error } = useSelector(
    (state: RootState) => state.products
  );
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { orders } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    console.log("🔍 Featured Products Debug:", {
      productsCount: products?.length || 0,
      listStatus,
      error,
      hasProducts: Array.isArray(products) && products.length > 0,
    });
  }, [products, listStatus, error]);

  useEffect(() => {
    console.log("🚀 Fetching products...");
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchMyOrders());
    }
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

  const processedFeaturedProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      console.log("⚠️ No products to process");
      return [];
    }

    console.log(`✅ Processing ${products.length} products`);

    const sortedProducts = [...products]
      .sort((a, b) => {
        const numA = Number(String(a.productNo || "0").replace(/[^0-9]/g, ""));
        const numB = Number(String(b.productNo || "0").replace(/[^0-9]/g, ""));
        return numB - numA;
      })
      .slice(0, 8);

    return sortedProducts.map((product) => {
      const productName = product.name || product.Name || "Untitled Plan";
      const regularPrice =
        Number(product.price) || Number(product["Regular price"]) || 0;
      const salePrice =
        Number(product.salePrice) || Number(product["Sale price"]) || 0;

      const isSale = salePrice > 0 && salePrice < regularPrice;
      const displayPrice = isSale ? salePrice : regularPrice;

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
          product.category ||
          "Uncategorized",
        isSale,
        displayPrice,
        regularPrice,
        videoId: getYouTubeId(product.youtubeLink),
        isWishlisted: isInWishlist(product._id),
        hasPurchased: purchasedProductIds.has(product._id),
      };
    });
  }, [products, purchasedProductIds, isInWishlist]);

  const handleWishlistToggle = (product: Product) => {
    if (!userInfo) {
      toast({
        variant: "destructive",
        title: "Please Login",
        description: "You need to be logged in to manage your wishlist.",
      });
      return;
    }
    const isCurrentlyWishlisted = isInWishlist(product._id);
    if (isCurrentlyWishlisted) {
      removeFromWishlist(product._id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to Wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleDownload = (product: any) => {
    if (!product.hasPurchased) {
      toast({
        variant: "destructive",
        title: "Purchase Required",
        description: "You need to purchase this plan to download the files.",
      });
      return;
    }
    const filesToDownload = product.planFile || [];
    if (filesToDownload.length === 0) {
      toast({
        variant: "destructive",
        title: "No Files Available",
        description: "Sorry, there are no downloadable files for this plan.",
      });
      return;
    }

    filesToDownload.forEach((fileUrl: string) => {
      window.open(fileUrl, "_blank");
    });

    toast({
      title: "Download Started",
      description: "Your file(s) are opening in new tabs.",
    });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.offsetWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const isLoading = listStatus === "loading";
  const hasFailed =
    listStatus === "failed" && processedFeaturedProducts.length === 0;
  const hasProducts = processedFeaturedProducts.length > 0;

  return (
    <section className="py-15 bg-background">
      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Featured House Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular designs
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {hasFailed && (
          <div className="text-center py-12 text-destructive">
            <ServerCrash className="mx-auto h-12 w-12" />
            <p className="mt-4">Failed to load products.</p>
            {error && <p className="text-sm mt-2">{String(error)}</p>}
            <Button
              onClick={() => dispatch(fetchProducts({}))}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Products Display */}
        {hasProducts && (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory"
              style={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`.flex.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
              <div className="flex gap-6 md:gap-8">
                {processedFeaturedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="bg-card rounded-2xl overflow-hidden group transition-all duration-300 border-2 border-transparent hover:border-primary hover:shadow-2xl hover:-translate-y-2 flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[320px] snap-start"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative border-b bg-muted/20">
                      <Link
                        to={`/product/${product.slug}`}
                        className="block p-4"
                      >
                        <img
                          src={product.mainImage}
                          alt={product.displayName}
                          className="w-full h-56 object-contain group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      {product.isSale && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                          Sale!
                        </div>
                      )}
                      {product.hasPurchased && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
                          Purchased
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleWishlistToggle(product)}
                          className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                            product.isWishlisted
                              ? "text-red-500 scale-110"
                              : "text-foreground hover:text-primary hover:scale-110"
                          }`}
                          aria-label="Toggle Wishlist"
                        >
                          <Heart
                            className="w-5 h-5"
                            fill={
                              product.isWishlisted ? "currentColor" : "none"
                            }
                          />
                        </button>
                        {product.videoId && (
                          <button
                            onClick={() => setPlayingVideoId(product.videoId)}
                            className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
                            aria-label="Watch video"
                          >
                            <Youtube className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="p-4 border-b">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-gray-50 rounded-md p-2">
                          <p className="text-xs text-gray-500">Area</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {product.plotAreaDisplay}
                          </p>
                        </div>
                        <div className="bg-teal-50 rounded-md p-2">
                          <p className="text-xs text-gray-500">BHK</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {product.roomsDisplay}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-md p-2">
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {product.plotSizeDisplay}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-md p-2">
                          <p className="text-xs text-gray-500">Facing</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {product.directionDisplay || "Any"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase font-medium">
                          {product.categoryDisplay}
                        </p>
                        <h3 className="text-xl font-bold text-gray-800 mt-1 truncate">
                          {product.displayName}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                          {product.isSale && (
                            <span className="text-sm text-gray-400 line-through">
                              <DisplayPrice inrPrice={product.regularPrice} />
                            </span>
                          )}
                          <span className="text-xl font-bold text-gray-900">
                            <DisplayPrice inrPrice={product.displayPrice} />
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link to={`/product/${product.slug}`}>
                          <Button
                            size="sm"
                            className="w-full bg-slate-800 text-white hover:bg-slate-700 text-sm h-10"
                          >
                            Read more
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className={`w-full text-white text-sm h-10`}
                          onClick={() => handleDownload(product)}
                          disabled={!product.hasPurchased}
                        >
                          {product.hasPurchased ? (
                            <>
                              <Download className="mr-2 h-4 w-4" /> PDF
                            </>
                          ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" /> Download
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 rounded-full h-12 w-12 bg-card/80 backdrop-blur-sm hover:bg-card hidden md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* No Products State */}
        {!isLoading && !hasProducts && !hasFailed && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No featured products available at the moment.
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <Link to="/products">
            <Button size="lg" className="px-10 py-1 text-base btn-primary">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
