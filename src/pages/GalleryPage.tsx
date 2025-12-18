import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import useEmblaCarousel from "embla-carousel-react";
import {
  fetchGalleryItems,
  GalleryItem,
} from "@/lib/features/gallery/gallerySlice";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Loader2,
  ServerCrash,
  CameraOff,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Lock,
  Eye,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

// --- Customized Gallery Card (Thumbnails Clear rahenge taaki user attract ho) ---
const GalleryImageCard = ({
  items,
  onCardClick,
  index,
}: {
  items: GalleryItem[];
  onCardClick: () => void;
  index: number;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const firstItem = items[0];

  const scrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi && emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      emblaApi && emblaApi.scrollNext();
    },
    [emblaApi]
  );

  const isPriority = index < 4;

  return (
    <Card
      className="rounded-lg md:rounded-xl overflow-hidden group relative border-2 border-transparent hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer"
      onClick={onCardClick}
    >
      <div className="overflow-hidden relative" ref={emblaRef}>
        <div className="flex">
          {items.map((item, imgIndex) => (
            <div className="flex-grow-0 flex-shrink-0 w-full" key={item._id}>
              <div className="aspect-square w-full bg-gray-100 relative">
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  width="400"
                  height="400"
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  loading={isPriority && imgIndex === 0 ? "eager" : "lazy"}
                  // @ts-ignore
                  fetchPriority={isPriority && imgIndex === 0 ? "high" : "auto"}
                />
                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  <ZoomIn className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <div className="hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}

        {items.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full md:hidden">
            +{items.length - 1}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2 md:p-4 pointer-events-none">
        <div className="transition-transform duration-300 transform md:group-hover:-translate-y-2">
          <h3 className="text-white font-bold text-xs md:text-lg drop-shadow-md line-clamp-1">
            {firstItem.title}
          </h3>
          <p className="text-orange-300 text-[10px] md:text-sm font-semibold truncate">
            {firstItem.category}
          </p>
          {items.length > 1 && (
            <p className="text-white/80 text-[10px] md:text-xs mt-0.5 md:mt-1 hidden md:block">
              {items.length} images
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// --- Main Page Component ---
const GalleryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector(
    (state: RootState) => state.gallery
  );
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GalleryItem[] | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGalleryItems());
    }
  }, [status, dispatch]);

  const uniqueCategories = useMemo(() => {
    if (!items) return [];
    const categories = new Set(items.map((item) => item.category));
    return ["All", ...Array.from(categories), "Video"];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: GalleryItem[] } = {};
    filteredItems.forEach((item) => {
      const key = item.title.trim().toLowerCase();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return Object.values(groups).sort(
      (a, b) =>
        new Date(b[0].createdAt || 0).getTime() -
        new Date(a[0].createdAt || 0).getTime()
    );
  }, [filteredItems]);

  const totalPages = Math.ceil(groupedItems.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItemGroups = groupedItems.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleCategoryChange = (value: string) => {
    if (value === "Video") {
      navigate("/customize/3d-video-walkthrough");
    } else {
      setSelectedCategory(value);
      setCurrentPage(1);
    }
  };

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  const handleCardClick = (group: GalleryItem[]) => {
    setSelectedGroup(group);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    if (selectedGroup && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedGroup && currentImageIndex < selectedGroup.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
          <p className="mt-4 text-slate-600">Loading our gallery...</p>
        </div>
      );
    }
    if (status === "failed") {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-red-50/50 p-8 rounded-xl">
          <ServerCrash className="h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-red-700">
            Oh no! Something went wrong
          </h3>
          <p className="mt-2 text-red-600">{String(error)}</p>
        </div>
      );
    }
    if (status === "succeeded" && currentItemGroups.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-slate-100/50 p-8 rounded-xl">
          <CameraOff className="h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-semibold text-slate-700">
            No Images Found
          </h3>
          <p className="mt-2 text-slate-500">
            {selectedCategory === "All"
              ? "Our gallery seems to be empty at the moment."
              : `There are no images in the "${selectedCategory}" category.`}
          </p>
        </div>
      );
    }
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {currentItemGroups.map((group, index) => (
            <GalleryImageCard
              key={`${group[0].title}-${index}`}
              items={group}
              onCardClick={() => handleCardClick(group)}
              index={index}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 md:mt-12 flex flex-wrap justify-center items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-xs md:text-sm"
            >
              <ChevronLeft className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Prev
            </Button>
            <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="text-xs md:text-sm"
            >
              Next
              <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
            </Button>

            <form
              onSubmit={handlePageJump}
              className="flex items-center gap-2 ml-2"
            >
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                placeholder="Go to"
                className="w-16 h-8 md:h-10 text-xs md:text-sm"
                aria-label="Jump to page"
              />
            </form>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-[#F7FAFA] min-h-screen">
      <Navbar />
      <main className="pb-16">
        <div className="relative w-full h-48 md:h-80 overflow-hidden flex items-center justify-center mb-8 md:mb-12 bg-black">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Interior Design Gallery Banner"
            width="2070"
            height="800"
            // @ts-ignore
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 text-center px-4 text-white">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 md:mb-4 drop-shadow-lg">
              Our Project Gallery
            </h1>
            <p className="text-sm md:text-lg max-w-2xl mx-auto opacity-95 font-light drop-shadow-md">
              Explore a collection of our best designs and projects.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-3 md:px-4">
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="w-full max-w-xs">
              <label className="block text-center text-xs md:text-sm font-medium text-slate-700 mb-2">
                Filter by category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10 md:h-12 text-sm md:text-base bg-white shadow-sm border-slate-300 focus:ring-orange-500">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {uniqueCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-sm md:text-base"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
      <Footer />

      {/* --- PROTECTED MODAL START (Changes Here) --- */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-[100vw] h-[100vh] md:max-w-6xl md:h-auto md:max-h-[95vh] p-0 bg-black/95 border-none overflow-hidden flex flex-col justify-center">
          {selectedGroup && (
            <>
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h2 className="text-white text-lg md:text-3xl font-bold drop-shadow-lg line-clamp-1">
                      {selectedGroup[currentImageIndex].title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-orange-400 text-xs md:text-base font-semibold">
                        {selectedGroup[currentImageIndex].category}
                      </p>
                      <span className="flex items-center gap-1 text-[10px] text-red-400 border border-red-500/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        <Lock size={10} /> Preview Locked
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseModal}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full h-8 w-8 md:h-12 md:w-12 backdrop-blur-sm shrink-0"
                  >
                    <X className="h-4 w-4 md:h-6 md:w-6" />
                  </Button>
                </div>
              </div>

              {/* Main Image Container - BLURRED & WATERMARKED */}
              <div 
                className="relative w-full h-full flex items-center justify-center bg-zinc-900 overflow-hidden select-none"
                onContextMenu={(e) => e.preventDefault()} // Right Click Blocked
              >
                {/* 1. Blurred Image */}
                <img
                  src={selectedGroup[currentImageIndex].imageUrl}
                  alt="Protected Content"
                  loading="lazy"
                  className="max-w-full max-h-full object-contain pointer-events-none opacity-60"
                  style={{ 
                    filter: "blur(5px)", // 5px blur se image clear nahi dikhegi
                    transform: "scale(1.02)"
                  }}
                />

                {/* 2. Grid Pattern Overlay (to ruin screenshot quality) */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none opacity-20" 
                  style={{ 
                    backgroundImage: "linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px"
                  }}
                ></div>

                {/* 3. Text Watermark */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                  <Lock className="text-white/20 w-24 h-24 mb-4" />
                  <h1 className="text-white/30 text-4xl md:text-6xl font-black tracking-widest -rotate-12">
                    PREVIEW ONLY
                  </h1>
                  <p className="text-white/30 text-lg md:text-2xl font-bold mt-4 tracking-wider -rotate-12">
                    BUY TO VIEW CLEARLY
                  </p>
                </div>

                {/* Navigation Buttons */}
                {selectedGroup.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 md:h-14 md:w-14 backdrop-blur-sm z-30 border border-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      disabled={currentImageIndex === 0}
                    >
                      <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 md:h-14 md:w-14 backdrop-blur-sm z-30 border border-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      disabled={currentImageIndex === selectedGroup.length - 1}
                    >
                      <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                    </Button>
                  </>
                )}
              </div>

              {/* Bottom Section */}
              <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pb-6 pt-12 px-4">
                
                {/* Thumbnails (Also slightly blurred) */}
                {selectedGroup.length > 1 && (
                  <div className="flex justify-center mb-4">
                    <div className="flex gap-2 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/10 overflow-x-auto max-w-full scrollbar-hide">
                      {selectedGroup.map((item, index) => (
                        <button
                          key={item._id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`shrink-0 w-10 h-10 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all relative ${
                            index === currentImageIndex
                              ? "border-orange-500 scale-110"
                              : "border-white/20 opacity-50"
                          }`}
                        >
                          <div className="absolute inset-0 bg-black/20 z-10" />
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-full h-full object-cover blur-[1px]" // Thumbnails bhi thode blur
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                {selectedGroup[currentImageIndex].productLink?.trim() ? (
                  <div className="flex flex-col items-center gap-3">
                     <p className="text-white/70 text-xs md:text-sm text-center flex items-center gap-2">
                       <Eye className="w-4 h-4" /> Want to see the clear image?
                     </p>
                    <Link
                      to={selectedGroup[currentImageIndex].productLink}
                      onClick={handleCloseModal}
                      className="w-full md:max-w-md"
                    >
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold h-12 md:h-14 text-sm md:text-lg shadow-2xl rounded-full border-t border-orange-400 animate-pulse">
                        <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Buy Plan to Unlock
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
