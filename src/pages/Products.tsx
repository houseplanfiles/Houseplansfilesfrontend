import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Heart,
  Download,
  Loader2,
  ServerCrash,
  X,
  Youtube,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Search,
  Lock,
} from "lucide-react";
import { fetchProducts } from "@/lib/features/products/productSlice";
import { fetchMyOrders } from "@/lib/features/orders/orderSlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useWishlist } from "@/contexts/WishlistContext";
import house3 from "@/assets/house-3.jpg";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import DisplayPrice from "@/components/DisplayPrice";
import { Textarea } from "@/components/ui/textarea";
import { submitCustomizationRequest } from "@/lib/features/customization/customizationSlice";
import useDebounce from "@/hooks/useDebounce";

// --- 1. SEO DATA MAPPING ---
// Yahan humne har category ke liye alag se meta title aur description store kiya hai
const seoDataByCategory = {
  "Duplex House Plans": {
    title: "collection of Duplex House Plans",
    description:
      "Explore stylish duplex house plans — storys layouts perfect for family living. Find designs that fit your budget and space needs.",
  },
  "Single Storey House Plan": {
    title: "collection of single storey house plan",
    description:
      "Browse single storey house plans — one-floor layouts perfect for efficient, stylish homes. Choose designs that fit your space and budget",
  },
  "Bungalow / Villa House Plans": {
    title: "Bungalow & Villa House Plans",
    description:
      "Explore premium bungalow & villa house plans — spacious, stylish layouts for luxury living. Find designs that fit your vision and lifestyle.",
  },
  "Apartment / Flat Plans": {
    title: "Apartment & Flat residential plans",
    description:
      "Browse apartment & flat plans — efficient, stylish layouts for multi-unit living. Find the right plan for your space and lifestyle.",
  },
  Farmhouse: {
    title: "Farmhouse House Plannings",
    description:
      "Explore farmhouse house plans — rustic & modern layouts perfect for country living. Find designs that match your space and style.",
  },
  "Cottage Plans": {
    title: "modern cottage house plan",
    description:
      "Explore charming cottage house plans — cozy, efficient layouts perfect for small homes or vacation spaces. Find the ideal design for your needs.",
  },
  "Row House / Twin House Plans": {
    title: "Row & Twin House Plans",
    description:
      "Browse row house & twin house plans — smart, space-efficient layouts for connected living. Find designs that fit modern lifestyle and space needs.",
  },
  "Village House Plans": {
    title: "Modern Village House Plans",
    description:
      "Explore village house plans — traditional & modern layouts ideal for rural homes. Find designs that fit your land, budget & lifestyle.",
  },
  "Contemporary / Modern House Plans": {
    title: "Modern & Contemporary house Plans",
    description:
      "Discover modern & contemporary house plans — stylish, efficient designs for today’s living. Find the perfect layout to match your vision and space.",
  },
  "Colonial / Heritage House Plans": {
    title: "Colonial & Heritage House Plans",
    description:
      "Explore colonial & heritage house plans — classic symmetrical designs with timeless charm and architectural elegance. Find plans that suit traditional tastes",
  },
  "Classic House Plan": {
    title: "modern classic house plan",
    description:
      "Explore classic house plans — timeless designs with balanced layouts and traditional style. Find the perfect plan to build your dream home.",
  },
  "Kerala House Plans": {
    title: "modern kerela house plan",
    description:
      "Browse Kerala house plans — traditional & modern layouts with sloping roofs, verandas & functional designs inspired by Kerala architecture.",
  },
  "Kashmiri House Plan": {
    title: "kashmiri house plans designs",
    description:
      "Browse Kashmiri house plans — traditional & climate adapted layouts with timber, stone and intricate design elements inspired by Kashmir’s architectural heritage.",
  },
  "Marriage Garden": {
    title: "marriage garden plans banquet hall",
    description:
      "Explore marriage garden layouts — functional site plans and design options for wedding venues, events & celebrations. Find the perfect outdoor space design.",
  },
  Hospitals: {
    title: "Hospitals building plans and designs",
    description:
      "Browse hospital building plans — efficient healthcare layouts for clinics, multi specialty centers & more. Find designs that fit your facility needs.",
  },
  "Shops and Showrooms": {
    title: "Shop & Showroom building Plans",
    description:
      "Browse shop and showroom plans — smart commercial layouts for retail spaces, boutiques & display areas. Find the perfect design for your business.",
  },
  "Highway Resorts and Hotels": {
    title: "Highway Resort & Hotel building Plans",
    description:
      "Explore highway resort & hotel plans — functional layouts for roadside stays, boutique hotels & leisure spaces. Find plans that fit your business vision.",
  },
  "Schools and Colleges Plans": {
    title: "School & College Building Plans",
    description:
      "Browse school & college plans — efficient educational building layouts for classrooms, labs & campus facilities. Find designs that meet your institutional needs.",
  },
  "Temple & Mosque": {
    title: "Temple & Mosque building Plans",
    description:
      "Explore temple & mosque architectural plans — sacred space layouts with thoughtful design and cultural detail. Find plans for worship sites and spiritual projects.",
  },
};

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

const VideoModal = ({
  videoUrl,
  onClose,
}: {
  videoUrl: string;
  onClose: () => void;
}) => {
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId;
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      } else {
        videoId = urlObj.searchParams.get("v");
      }
    } catch (e) {
      const regex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      videoId = match ? match[1] : null;
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl) {
    onClose();
    toast.error("Invalid YouTube URL provided.");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title="YouTube video player"
            loading="lazy"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"
          aria-label="Close video player"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};

const staticCategories = [
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

const FilterSidebar = ({
  filters,
  setFilters,
  uniqueCategories,
  className = "",
  onClose,
}: any) => (
  <aside
    className={`w-full p-6 bg-white rounded-xl shadow-lg border border-gray-200 h-fit ${className}`}
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold flex items-center text-gray-800">
        <Filter className="w-5 h-5 mr-2 text-gray-500" />
        Filters
      </h3>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="lg:hidden"
        >
          <X className="w-5 h-5" />
        </Button>
      )}
    </div>
    <div className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2 -mr-2">
      <div className="space-y-6">
        <div>
          <Label htmlFor="searchTerm" className="font-semibold text-gray-600">
            Search
          </Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="searchTerm"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev: any) => ({
                  ...prev,
                  searchTerm: e.target.value,
                }))
              }
              className="pl-10 bg-gray-100 border-transparent h-12"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category" className="font-semibold text-gray-600">
            Category
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger
              id="category"
              className="mt-2 bg-gray-100 border-transparent h-12"
            >
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {uniqueCategories.map((cat: string) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plotSize" className="font-semibold text-gray-600">
            Plot Size
          </Label>
          <Select
            value={filters.plotSize}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, plotSize: value }))
            }
          >
            <SelectTrigger
              id="plotSize"
              className="mt-2 bg-gray-100 border-transparent h-12"
            >
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="26X45 SQFT">26X45 SQFT</SelectItem>
              <SelectItem value="30x40">30x40</SelectItem>
              <SelectItem value="40x60">40x60</SelectItem>
              <SelectItem value="50x80">50x80</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="plotArea" className="font-semibold text-gray-600">
            Plot Area (sqft)
          </Label>
          <Select
            value={filters.plotArea}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, plotArea: value }))
            }
          >
            <SelectTrigger
              id="plotArea"
              className="mt-2 bg-gray-100 border-transparent h-12"
            >
              <SelectValue placeholder="Select Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="500-1000">500-1000</SelectItem>
              <SelectItem value="1000-2000">1000-2000</SelectItem>
              <SelectItem value="2000+">2000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="direction" className="font-semibold text-gray-600">
            Direction
          </Label>
          <Select
            value={filters.direction}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, direction: value }))
            }
          >
            <SelectTrigger
              id="direction"
              className="mt-2 bg-gray-100 border-transparent h-12"
            >
              <SelectValue placeholder="Select Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Directions</SelectItem>
              <SelectItem value="East">East</SelectItem>
              <SelectItem value="West">West</SelectItem>
              <SelectItem value="North">North</SelectItem>
              <SelectItem value="South">South</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="floors" className="font-semibold text-gray-600">
            Floors
          </Label>
          <Select
            value={filters.floors}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, floors: value }))
            }
          >
            <SelectTrigger
              id="floors"
              className="mt-2 bg-gray-100 border-transparent h-12"
            >
              <SelectValue placeholder="Select Floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="propertyType" className="font-semibold text-gray-600">
            Property Type
          </Label>
          <Select
            value={filters.propertyType}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, propertyType: value }))
            }
          >
            <SelectTrigger
              id="propertyType"
              className="mt-2 bg-gray-100 border-transparent h-12"
            >
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Rental">Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-semibold text-gray-600">
            Budget: ₹{filters.budget[0].toLocaleString()} - ₹
            {filters.budget[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.budget}
            onValueChange={(value) =>
              setFilters((prev: any) => ({ ...prev, budget: value }))
            }
            max={50000}
            min={0}
            step={500}
            className="mt-3"
          />
        </div>
        <Button
          onClick={() => {
            setFilters({
              category: "all",
              searchTerm: "",
              plotSize: "all",
              plotArea: "all",
              direction: "all",
              floors: "all",
              propertyType: "all",
              budget: [0, 50000],
              sortBy: "newest",
            });
            if (onClose) onClose();
          }}
          variant="outline"
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  </aside>
);

const ProductCard = ({ product, userOrders, onPlayVideo, index }: any) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { symbol, rate } = useCurrency();

  const productName =
    product.name || product.planName || product.Name || "Untitled Plan";
  const linkTo = `/product/${slugify(productName)}-${product._id}`;
  const mainImage =
    product.mainImage || product.Images?.split(",")[0].trim() || house3;
  const plotSize = product.plotSize || product["Attribute 1 value(s)"] || "N/A";
  const plotArea =
    product.plotArea ||
    (product["Attribute 2 value(s)"]
      ? parseInt(String(product["Attribute 2 value(s)"]).replace(/[^0-9]/g, ""))
      : "N/A");
  const rooms = product.rooms || product["Attribute 3 value(s)"] || "N/A";
  const direction =
    product.direction || product["Attribute 4 value(s)"] || "N/A";
  const floors = product.floors || product["Attribute 5 value(s)"] || "N/A";
  const regularPrice =
    (product.price > 0 ? product.price : product["Regular price"]) ?? 0;
  const salePrice =
    (product.salePrice > 0 ? product.salePrice : product["Sale price"]) ?? null;
  const isSale =
    salePrice !== null &&
    parseFloat(String(salePrice)) > 0 &&
    parseFloat(String(salePrice)) < parseFloat(String(regularPrice));
  const displayPrice = isSale ? salePrice : regularPrice;
  const category =
    (Array.isArray(product.category)
      ? product.category[0]
      : product.category) ||
    product.Categories?.split(",")[0].trim() ||
    "House Plan";
  const city = product.city
    ? Array.isArray(product.city)
      ? product.city.join(", ")
      : product.city
    : null;
  const isWishlisted = isInWishlist(product._id);

  const hasPurchased = useMemo(() => {
    if (!userInfo || !userOrders || userOrders.length === 0) return false;
    return userOrders.some(
      (order: any) =>
        order.isPaid &&
        order.orderItems?.some(
          (item: any) => (item.productId?._id || item.productId) === product._id
        )
    );
  }, [userOrders, userInfo, product._id]);

  const handleWishlistToggle = () => {
    if (!userInfo) {
      toast.error("Please log in to add items to your wishlist.");
      navigate("/login");
      return;
    }
    const productForWishlist = {
      productId: product._id,
      name: productName,
      price: regularPrice,
      salePrice: salePrice,
      image: mainImage,
      size: plotSize,
    };
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(productForWishlist);
    }
  };

  const handleDownload = async () => {
    if (!userInfo) {
      toast.error("Please log in to download.");
      navigate("/login");
      return;
    }
    if (!hasPurchased) {
      toast.error("Please purchase this plan to download it.");
      navigate(linkTo);
      return;
    }
    const fileToDownload =
      (Array.isArray(product.planFile)
        ? product.planFile[0]
        : product.planFile) || product["Download 1 URL"];
    if (!fileToDownload) {
      toast.error("No downloadable file found for this product.");
      return;
    }
    try {
      toast.success("Your download is starting...");
      const link = document.createElement("a");
      link.href = fileToDownload;
      const fileExtension =
        fileToDownload.split(".").pop()?.split("?")[0] || "pdf";
      const fileName = `ArchHome-${productName.replace(/\s+/g, "-")}.${fileExtension}`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download the file.");
    }
  };

  const isPriority = index < 4;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative p-2">
        <Link to={linkTo}>
          <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden">
            <img
              src={mainImage}
              alt={productName}
              width="400"
              height="400"
              loading={isPriority ? "eager" : "lazy"}
              // @ts-ignore
              fetchPriority={isPriority ? "high" : "auto"}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute inset-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg text-center">
            <p>{plotSize}</p>
            <p className="text-xs font-normal">
              {hasPurchased ? "Download now" : "Purchase to download"}
            </p>
          </div>
        </Link>
        {isSale && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
            Sale!
          </div>
        )}
        {hasPurchased && (
          <div className="absolute top-2 right-12 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
            Purchased
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`w-9 h-9 bg-white/90 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${isWishlisted ? "text-red-500 scale-110" : "text-gray-600 hover:text-red-500 hover:scale-110"}`}
            aria-label="Toggle Wishlist"
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          {product.youtubeLink && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayVideo(product.youtubeLink);
              }}
              className="w-9 h-9 bg-red-500/90 rounded-full flex items-center justify-center shadow-sm text-white hover:bg-red-600"
            >
              <Youtube className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2 border-t text-center text-sm">
        <div>
          <p className="text-xs text-gray-500">Plot Area</p>
          <p className="font-bold">{plotArea} sqft</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Rooms</p>
          <p className="font-bold">{rooms}</p>
        </div>
        <div className="bg-teal-50 p-2 rounded-md">
          <p className="text-xs text-gray-500">Bathrooms</p>
          <p className="font-bold">{product.bathrooms || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Kitchen</p>
          <p className="font-bold">{product.kitchen || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Floors</p>
          <p className="font-bold">{floors}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Direction</p>
          <p className="font-bold">{direction}</p>
        </div>
      </div>
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500 uppercase">{category}</p>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          {product.productNo && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">Product No:</span>
              <span>{product.productNo}</span>
            </div>
          )}
          {city && (
            <div className="flex justify-between items-center">
              <span className="font-semibold">City:</span>
              <span className="text-right font-bold text-teal-700">{city}</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold text-teal-800 mt-1 truncate">
          {productName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          {isSale && parseFloat(String(regularPrice)) > 0 && (
            <s className="text-md text-gray-400">
              <DisplayPrice inrPrice={parseFloat(String(regularPrice))} />
            </s>
          )}
          <span className="text-xl font-bold text-gray-800">
            <DisplayPrice inrPrice={parseFloat(String(displayPrice))} />
          </span>
          {isSale &&
            parseFloat(String(regularPrice)) > 0 &&
            parseFloat(String(displayPrice)) > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                SAVE {symbol}
                {(
                  (parseFloat(String(regularPrice)) -
                    parseFloat(String(displayPrice))) *
                  rate
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto space-y-2">
        <Link to={linkTo}>
          <Button
            variant="outline"
            className="w-full bg-gray-800 text-white hover:bg-gray-700"
          >
            Read more
          </Button>
        </Link>
        <Button
          className={`w-full text-white rounded-md ${hasPurchased ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400 cursor-not-allowed"}`}
          onClick={handleDownload}
          disabled={!hasPurchased}
        >
          {hasPurchased ? (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Purchase to Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const CountryCustomizationForm = ({ countryName }: any) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector(
    (state: RootState) => state.customization
  );
  const [formData, setFormData] = useState({
    country: countryName || "",
    name: "",
    email: "",
    whatsappNumber: "",
    width: "",
    length: "",
    description: "",
  });
  const [referenceFile, setReferenceFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, country: countryName || "" }));
  }, [countryName]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReferenceFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, (formData as any)[key]);
    });
    if (referenceFile) {
      submitData.append("referenceFile", referenceFile);
    }
    submitData.append("requestType", "Floor Plan Customization");
    try {
      await dispatch(submitCustomizationRequest(submitData)).unwrap();
      toast.success(
        `Customization request for ${
          countryName || "your location"
        } sent successfully!`
      );
      setFormData({
        country: countryName || "",
        name: "",
        email: "",
        whatsappNumber: "",
        width: "",
        length: "",
        description: "",
      });
      setReferenceFile(null);
    } catch (rejectedError) {
      toast.error(
        String(rejectedError) || "Failed to submit customization request"
      );
    }
  };

  return (
    <div className="bg-gray-50 py-16 mb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Customize a Plan for {countryName || "Your Location"}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-200 border-gray-300 text-gray-500"
                  readOnly={!!countryName}
                />
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-100 border-transparent"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-100 border-transparent"
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
                <Input
                  type="tel"
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleInputChange}
                  className="mt-1 bg-gray-100 border-transparent"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    name="width"
                    value={formData.width}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-100 border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    name="length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="mt-1 bg-gray-100 border-transparent"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  className="mt-1 bg-gray-100 border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="referenceFile">
                  Upload Reference (Image or PDF)
                </Label>
                <Input
                  id="referenceFile"
                  name="referenceFile"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={actionStatus === "loading"}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-base disabled:opacity-50"
              >
                {actionStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </form>
          </div>
          <div className="w-full lg:w-1/2 hidden lg:block">
            <img
              src="/threeDfloor.jpg"
              alt="Beautiful modern house"
              width="600"
              height="450"
              loading="lazy"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.user);

  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const countryQuery = searchParams.get("country");
  const pageQuery = Number(searchParams.get("page")) || 1;

  const { products, page, pages, count, listStatus, error } = useSelector(
    (state: RootState) => state.products
  );

  const { orders: userOrders } = useSelector(
    (state: RootState) => state.orders
  );

  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: categoryQuery || "all",
    searchTerm: searchQuery || "",
    plotSize: "all",
    plotArea: "all",
    direction: "all",
    floors: "all",
    propertyType: "all",
    budget: [0, 50000] as [number, number],
    sortBy: "newest",
  });
  const [currentPage, setCurrentPage] = useState(pageQuery);
  const [jumpToPage, setJumpToPage] = useState("");
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  useEffect(() => {
    const params: any = {
      pageNumber: currentPage,
      limit: 12,
    };

    if (debouncedSearchTerm) params.searchTerm = debouncedSearchTerm;
    if (countryQuery) params.country = countryQuery;
    if (filters.category !== "all") params.category = filters.category;
    if (filters.plotSize !== "all") params.plotSize = filters.plotSize;
    if (filters.plotArea !== "all") params.plotArea = filters.plotArea;
    if (filters.direction !== "all") params.direction = filters.direction;
    if (filters.floors !== "all") params.floors = filters.floors;
    if (filters.propertyType !== "all")
      params.propertyType = filters.propertyType;
    if (filters.sortBy !== "newest") params.sortBy = filters.sortBy;
    if (filters.budget[0] !== 0 || filters.budget[1] !== 50000) {
      params.budget = `${filters.budget[0]}-${filters.budget[1]}`;
    }

    dispatch(fetchProducts(params));

    if (userInfo) {
      dispatch(fetchMyOrders());
    }
  }, [
    dispatch,
    userInfo,
    countryQuery,
    currentPage,
    debouncedSearchTerm,
    filters.category,
    filters.plotSize,
    filters.plotArea,
    filters.direction,
    filters.floors,
    filters.propertyType,
    filters.budget,
    filters.sortBy,
  ]);

  const prevFiltersRef = useRef({
    ...filters,
    searchTerm: debouncedSearchTerm,
    country: countryQuery,
  });

  useEffect(() => {
    const currentFiltersState = {
      ...filters,
      searchTerm: debouncedSearchTerm,
      country: countryQuery,
    };

    if (
      JSON.stringify(currentFiltersState) !==
      JSON.stringify(prevFiltersRef.current)
    ) {
      setCurrentPage(1);
      setSearchParams((prev) => {
        prev.set("page", "1");
        return prev;
      });
      prevFiltersRef.current = currentFiltersState;
    }
  }, [debouncedSearchTerm, filters, countryQuery, setSearchParams]);

  // --- 2. DYNAMIC SEO LOGIC ---
  const currentSeo = useMemo(() => {
    const defaultSeo = {
      title: "floor plan with 3d elevation design",
      description:
        "Explore detailed floor plan and 3D house elevation & to bring your dream home design to life. Perfect for builders, architects & homeowners. Download now",
    };

    // Check if the selected category has custom SEO data
    if (filters.category && seoDataByCategory[filters.category]) {
      return seoDataByCategory[filters.category];
    }

    // Fallback to default if no specific category is matched
    return defaultSeo;
  }, [filters.category]);

  const totalPages = pages > 0 ? pages : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSearchParams((prev) => {
        prev.set("page", String(newPage));
        return prev;
      });
      window.scrollTo(0, 0);
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(jumpToPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
    } else {
      toast.error(`Please enter a page number between 1 and ${totalPages}.`);
    }
    setJumpToPage("");
  };

  const handlePlayVideo = (url: string) => {
    setPlayingVideoUrl(url);
  };
  const handleCloseModal = () => {
    setPlayingVideoUrl(null);
  };

  const isLoading = listStatus === "loading";
  const isError = listStatus === "failed";
  const errorMessage = String(error);

  const pageTitle = countryQuery
    ? `${countryQuery} House Plans`
    : "House Plans & Designs";
  const pageDescription = countryQuery
    ? `Browse plans available in ${countryQuery}`
    : "Discover our complete collection of architectural masterpieces";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- 3. HELMET UPDATED WITH DYNAMIC DATA --- */}
      <Helmet>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
      </Helmet>

      <Navbar />

      <AnimatePresence>
        {playingVideoUrl && (
          <VideoModal videoUrl={playingVideoUrl} onClose={handleCloseModal} />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 lg:mb-8">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-xl text-muted-foreground hidden lg:block">
            {pageDescription}
          </p>
          <div className="lg:hidden mt-2 text-gray-500">
            Showing {products.length} of {count} results
          </div>

          {(countryQuery || categoryQuery || searchQuery) && (
            <div className="mt-4 hidden lg:block">
              <Link to="/products">
                <Button variant="destructive" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </Link>
            </div>
          )}
        </div>

        {countryQuery && (
          <CountryCustomizationForm countryName={countryQuery} />
        )}

        {/* Mobile Filter & Sort Bar */}
        <div className="lg:hidden flex gap-3 mb-6 items-center">
          <Button
            variant="outline"
            className="flex-1 bg-white h-12 text-base font-normal border-gray-200"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <div className="flex-1">
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sortBy: value }))
              }
            >
              <SelectTrigger className="w-full bg-white h-12 border-gray-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by latest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-12 ${countryQuery ? "pt-0 lg:pt-8" : "pt-0"}`}
        >
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-full lg:w-1/4 xl:w-1/5">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              uniqueCategories={staticCategories}
              className="lg:sticky lg:top-24"
            />
          </div>

          {/* Mobile Filter Drawer Overlay */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    uniqueCategories={staticCategories}
                    onClose={() => setIsMobileFiltersOpen(false)}
                    className="h-full rounded-none border-none shadow-none"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full lg:w-3/4 xl:w-4/5">
            <div className="hidden lg:flex flex-wrap gap-4 justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">All Plans</h2>
                <p className="text-gray-500 text-sm">
                  Showing {products.length} of {count} results on page{" "}
                  {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Sort by latest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              </div>
            )}
            {isError && (
              <div className="text-center py-20">
                <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-xl font-semibold text-red-500">
                  Failed to Load Products
                </h3>
                <p className="mt-2 text-gray-500">{errorMessage}</p>
              </div>
            )}

            {!isLoading && !isError && products.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold">No Plans Found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters.
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      category: "all",
                      searchTerm: "",
                      plotSize: "all",
                      plotArea: "all",
                      direction: "all",
                      floors: "all",
                      propertyType: "all",
                      budget: [0, 50000],
                      sortBy: "newest",
                    })
                  }
                  variant="outline"
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {!isLoading && !isError && products.length > 0 && (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {products.map((product: any, index: number) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    userOrders={userOrders}
                    onPlayVideo={handlePlayVideo}
                    index={index}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <form
                  onSubmit={handleJumpToPage}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="number"
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    placeholder="Go to..."
                    className="w-24 h-10"
                    min="1"
                    max={totalPages}
                  />
                  <Button type="submit">Go</Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Products;
