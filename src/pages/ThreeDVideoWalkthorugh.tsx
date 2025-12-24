import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import { fetchVideos, fetchTopics } from "@/lib/features/videos/videoSlice";
import { RootState, AppDispatch } from "@/lib/store";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Loader2,
  PlayCircle,
  X,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Send,
  Video,
} from "lucide-react";
import YouTube from "react-youtube";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Modern UI Styles
const formStyles = {
  label: "block text-sm font-semibold text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm",
  select:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm appearance-none",
  textarea:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px] resize-y transition-all duration-200 shadow-sm",
  fileInputWrapper:
    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 transition-colors",
};

// Video Modal Component
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
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl aspect-video bg-black rounded-lg shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 h-10 w-10 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-200 z-10 shadow-lg transition-transform hover:scale-110"
          aria-label="Close video player"
        >
          <X size={24} />
        </button>
        <YouTube
          videoId={videoId}
          opts={opts}
          className="w-full h-full rounded-lg overflow-hidden"
        />
      </div>
    </div>
  );
};

const ThreeDWalkthroughPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );
  const [formKey, setFormKey] = useState(Date.now());
  const [fileName, setFileName] = useState<string | null>(null);

  // Video State
  const {
    videos,
    topics,
    listStatus: videoListStatus,
  } = useSelector((state: RootState) => state.videos);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToPage, setJumpToPage] = useState("");
  const VIDEOS_PER_PAGE = 6;

  useEffect(() => {
    dispatch(fetchVideos());
    dispatch(fetchTopics());
  }, [dispatch]);

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "3D Video Walkthrough");
    dispatch(submitCustomizationRequest(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now());
      setFileName(null);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  // Video Filtering & Pagination
  const filteredVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    if (selectedTopic === "All") return videos;
    return videos.filter((video) => video.topic === selectedTopic);
  }, [videos, selectedTopic]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic]);

  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const indexOfLastVideo = currentPage * VIDEOS_PER_PAGE;
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_PER_PAGE;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo
  );

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  const thumbnailOptions = (videoId: string) => ({
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
    },
  });

  const isLoading = actionStatus === "loading";

  return (
    <>
      <Helmet>
        <title>
          3D Elevation & Video Walkthrough | Interactive Home Designs
        </title>
        <meta
          name="description"
          content="Explore stunning 3D elevations and immersive video walkthroughs to visualize your dream home. Experience detailed designs and interactive tours."
        />
      </Helmet>

      <VideoModal
        videoId={playingVideoId}
        onClose={() => setPlayingVideoId(null)}
      />

      <Navbar />

      {/* --- FORM SECTION --- */}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Customize Your{" "}
              <span className="text-orange-600">3D Walkthrough</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Get a stunning 3D elevation and cinematic video walkthrough for
              your plan. Fill the details below.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={formStyles.label}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={formStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={formStyles.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      className={formStyles.input}
                      required
                    />
                  </div>
                </div>

                {/* Phone & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="whatsappNumber"
                      className={formStyles.label}
                    >
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      placeholder="+91 98765 43210"
                      className={formStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="countryName" className={formStyles.label}>
                      Country
                    </label>
                    <input
                      type="text"
                      id="countryName"
                      name="countryName"
                      defaultValue="India"
                      className={formStyles.input}
                      required
                    />
                  </div>
                </div>

                {/* Plot Size */}
                <div>
                  <label htmlFor="plotSize" className={formStyles.label}>
                    Plot Size (e.g., 30x40 ft)
                  </label>
                  <input
                    type="text"
                    id="plotSize"
                    name="plotSize"
                    placeholder="e.g., 30x40 ft or 1200 sq ft"
                    className={formStyles.input}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={formStyles.label}>
                    Describe Your Vision
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about the number of rooms, style preference (Modern, Classical), Vastu needs, etc."
                    className={formStyles.textarea}
                    rows={4}
                  ></textarea>
                </div>

                {/* File Upload */}
                <div>
                  <label className={formStyles.label}>
                    Upload Reference File (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="referenceFile"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                    <div className={formStyles.fileInputWrapper}>
                      <UploadCloud className="h-8 w-8 text-orange-500 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        {fileName ? (
                          <span className="text-orange-600">{fileName}</span>
                        ) : (
                          "Click to upload or drag and drop"
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Hand sketch, Image, or PDF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full text-lg py-6 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Request Walkthrough <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* --- PORTFOLIO SECTION (Kept as is, but styled cleaner) --- */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <Video className="text-orange-600" /> Our 3D Walkthrough Portfolio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Watch our latest project videos to see what we can do for you.
            </p>
          </div>

          <div className="mt-8 flex justify-center mb-12">
            <div className="w-full max-w-sm">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={formStyles.select}
                aria-label="Filter videos by topic"
              >
                <option value="All">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            {videoListStatus === "loading" ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              </div>
            ) : currentVideos.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">
                  No videos found for this category.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentVideos.map((video) => {
                    const buyNowLink = video.productLink
                      ? `/product/${video.productLink._id}`
                      : "/products";
                    return (
                      <div
                        key={video._id}
                        className="group flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                      >
                        <div
                          className="relative aspect-video bg-gray-900 cursor-pointer overflow-hidden"
                          onClick={() =>
                            setPlayingVideoId(video.youtubeVideoId)
                          }
                        >
                          {video.youtubeVideoId ? (
                            <>
                              <YouTube
                                videoId={video.youtubeVideoId}
                                opts={thumbnailOptions(video.youtubeVideoId)}
                                className="absolute top-0 left-0 w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                                iframeClassName="pointer-events-none"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <PlayCircle className="h-16 w-16 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              Invalid Video Link
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <span className="text-xs font-bold tracking-wide uppercase text-orange-600 mb-2">
                            {video.topic}
                          </span>
                          <h3
                            className="font-bold text-lg leading-snug text-gray-900 mb-2 line-clamp-2"
                            title={video.title}
                          >
                            {video.title}
                          </h3>
                          <button
                            onClick={() =>
                              setPlayingVideoId(video.youtubeVideoId)
                            }
                            className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors mb-4 text-left"
                          >
                            Watch Preview
                          </button>

                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <Link to={buyNowLink} className="w-full block">
                              <Button className="w-full bg-gray-900 hover:bg-orange-600 text-white transition-colors">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                {video.productLink
                                  ? "Buy This Plan"
                                  : "Explore Plans"}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-wrap justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="rounded-full px-6"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Prev
                    </Button>

                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="rounded-full px-6"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>

                    <form
                      onSubmit={handlePageJump}
                      className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200"
                    >
                      <span className="text-sm text-gray-500">Go to:</span>
                      <Input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={jumpToPage}
                        onChange={(e) => setJumpToPage(e.target.value)}
                        className="w-16 h-9 text-center"
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3"
                      >
                        Go
                      </Button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThreeDWalkthroughPage;
