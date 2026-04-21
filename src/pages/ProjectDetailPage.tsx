import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ChevronLeft, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Building2,
  Share2,
  Star,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

// --- Icon Components (same as ProductDetail) ---
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.48 3.4 1.35 4.85L2 22l5.42-1.47c1.41.82 3 1.29 4.62 1.29 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM12.04 20.15c-1.48 0-2.91-.41-4.15-1.16l-.3-.18-3.08.83.85-3.01-.2-.32c-.82-1.3-1.26-2.81-1.26-4.39 0-4.54 3.72-8.24 8.26-8.24s8.26 3.7 8.26 8.24-3.72 8.24-8.26 8.24zm4.52-6.19c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94s-.28.18-.52.06c-.24-.12-1.02-.38-1.94-1.2-1.03-.9-1.5-1.88-1.68-2.2v-.02c-.18-.32-.04-.5.1-.64.12-.12.26-.32.4-.42.12-.12.16-.2.24-.34s.04-.28-.02-.4c-.06-.12-.54-1.3-.74-1.78s-.4-.4-.54-.4h-.47c-.16 0-.42.06-.64.3s-.84.82-.84 2c0 1.18.86 2.32 1 2.48.12.16 1.67 2.55 4.05 3.56.58.24 1.05.38 1.41.48.58.16 1.11.14 1.52.08.45-.06 1.42-.58 1.62-1.14s.2-1.04.14-1.14c-.06-.1-.22-.16-.46-.28z" />
  </svg>
);
const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 7.15l-1.5 7.07c-.11.49-.4.61-.81.38l-2.26-1.67-1.09 1.05c-.12.12-.23.23-.47.23l.17-2.42 4.41-3.99c.19-.17-.04-.27-.29-.1l-5.45 3.43-2.35-.74c-.51-.16-.52-.51.11-.75l9.19-3.55c.43-.16.81.1.67.75z" />
  </svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
const PinterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.602-.167-1.592.034-2.327.185-.68.995-4.223.995-4.223s-.255-.51-.255-1.267c0-1.185.688-2.072 1.553-2.072.73 0 1.08.547 1.08 1.202 0 .73-.465 1.822-.705 2.832-.202.84.42 1.532 1.258 1.532 1.508 0 2.65-1.59 2.65-3.868 0-2.046-1.445-3.48-3.566-3.48-2.35 0-3.738 1.743-3.738 3.355 0 .64.246 1.332.558 1.727.06.074.068.103.05.178-.02.083-.07.28-.09.358-.026.09-.105.12-.24.06-1.1-.47-1.8-1.82-1.8-3.132 0-2.438 2.085-4.73 5.25-4.73 2.76 0 4.86 1.956 4.86 4.418 0 2.712-1.72 4.882-4.14 4.882-.828 0-1.606-.43-1.865-.934 0 0-.405 1.616-.502 2.01-.132.52-.25.99-.4 1.392.36.11.732.17 1.114.17 6.627 0 12-5.373 12-12S18.627 2 12 2z" />
  </svg>
);
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);
const ThreadsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />
    <path d="M4 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />
    <path d="M8 12.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5" />
  </svg>
);
const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const ProjectDetailPage = () => {
  const { id, projectIdx } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/contractor/${id}`
        );
        setContractor(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContractor();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("userInfo");
    if (!storedUser) {
      toast.error("Please login to leave a review");
      return;
    }

    setSubmittingReview(true);
    try {
      const { token } = JSON.parse(storedUser);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/contractors/${id}/reviews`,
        { rating, comment, projectIdx: Number(projectIdx) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted successfully!");
      setComment("");
      setRating(5);
      // Refresh data
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/contractor/${id}`);
      setContractor(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = contractor ? `Check out ${contractor.name}'s project: ${contractor.workSamples?.[Number(projectIdx)]?.title}` : "Construction Project";

  const getFileUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_BACKEND_URL}/${path.replace(/\\/g, "/")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  const project = contractor?.workSamples?.[Number(projectIdx)];

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h2 className="text-2xl font-extrabold text-gray-900 italic tracking-tight">Project details not found</h2>
        <Button onClick={() => navigate(-1)} variant="secondary" className="rounded-xl font-bold">
           Go Back
        </Button>
      </div>
    );
  }

  const images = project.images || [project.imageUrl];
  const features = project.features || ["Premium Finish", "Structural Stability", "Timely Delivery"];

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Helmet>
        <title>{project.seo?.title || project.title || "Project Detail"} | {contractor.name}</title>
        <meta name="description" content={project.seo?.description || project.description || "View details of this amazing construction project."} />
        {project.seo?.keywords?.length > 0 && (
          <meta name="keywords" content={project.seo.keywords.join(", ")} />
        )}
        
        {/* Open Graph Tags for WhatsApp/Facebook */}
        <meta property="og:title" content={project.seo?.title || project.title || "Elite Construction Project"} />
        <meta property="og:description" content={project.seo?.description || project.description || "Premium structural execution with modern design standards."} />
        <meta property="og:image" content={getFileUrl(project.imageUrl)} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.seo?.title || project.title || "Elite Construction Project"} />
        <meta name="twitter:description" content={project.seo?.description || project.description || "Premium structural execution with modern design standards."} />
        <meta name="twitter:image" content={getFileUrl(project.imageUrl)} />
      </Helmet>

      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-10 pb-32">
        {/* Back Button */}
        <Button 
          onClick={() => navigate(-1)} 
          variant="ghost" 
          className="mb-8 hover:bg-orange-50 text-gray-600 hover:text-orange-600 font-bold gap-2 rounded-xl transition-all"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Profile
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Project Content */}
          <div className="lg:col-span-9 space-y-10">
            {/* Main Featured Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[450px] md:h-[600px] bg-gray-100">
               <img src={getFileUrl(project.imageUrl)} className="w-full h-full object-cover" alt="Main" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
               <div className="absolute bottom-10 left-10 text-white">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
                    {project.title || "Project Excellence"}
                  </h1>
                  <Badge className="bg-orange-600 font-bold px-4 py-1.5 rounded-full text-sm">
                     {project.location}
                  </Badge>
               </div>
            </div>

            {/* Description & Specs */}
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-gray-900 border-b-2 border-orange-500 w-fit pb-1">About Project</h2>
                <p className="text-gray-600 font-bold text-lg leading-relaxed italic">
                  {project.description || "Every square foot of this space was designed for maximum impact and utility. Our team focused on a blend of aesthetics and reliability, ensuring a result that exceeds expectations."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                <div className="space-y-3">
                   <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange-600" /> Structure Info
                   </h3>
                   <p className="text-gray-500 font-bold">Category: <span className="text-gray-900 uppercase">{contractor.profession || "Contractor"}</span></p>
                   <p className="text-gray-500 font-bold">Project Site: <span className="text-gray-900 capitalize">{project.location}</span></p>
                </div>
                <div className="space-y-3">
                   <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" /> Timeline
                   </h3>
                   <p className="text-gray-500 font-bold">Duration: <span className="text-gray-900">Delivered On-Time</span></p>
                   <p className="text-gray-500 font-bold">Status: <span className="text-green-600 font-black">COMPLETED</span></p>
                </div>
              </div>
            </div>

            {/* Full Gallery */}
            <section className="space-y-8">
               <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <div className="w-2 h-8 bg-orange-600 rounded-full" />
                  Project Gallery
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {images.map((img: any, i: number) => (
                    <div key={i} className="rounded-2xl overflow-hidden aspect-video shadow-md border border-gray-100 hover:shadow-xl transition-all group">
                      <img 
                        src={getFileUrl(img)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        alt={`View ${i}`} 
                      />
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-2xl sticky top-28">
               <h3 className="text-xl font-extrabold mb-8 flex items-center gap-2">
                 <CheckCircle2 className="w-6 h-6 text-orange-500" /> Highlights
               </h3>
               <div className="space-y-4">
                  {features.map((f: string, i: number) => (
                    <div key={i} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="font-extrabold text-gray-200">{f}</span>
                    </div>
                  ))}
               </div>

                <div className="mt-10 pt-10 border-t border-white/10 space-y-4">
                   <h3 className="font-bold text-gray-300 mb-2">Share this project</h3>
                   <div className="flex items-center gap-2 flex-wrap">
                     {[
                       { name: "Facebook", icon: <FacebookIcon />, color: "bg-blue-800", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                       { name: "WhatsApp", icon: <WhatsAppIcon />, color: "bg-green-500", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}` },
                       { name: "Twitter", icon: <TwitterIcon />, color: "bg-black", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}` },
                       { name: "LinkedIn", icon: <LinkedinIcon />, color: "bg-sky-700", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}` },
                       { name: "Pinterest", icon: <PinterestIcon />, color: "bg-red-600", href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle)}` },
                       { name: "Telegram", icon: <TelegramIcon />, color: "bg-sky-500", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}` },
                       { name: "Threads", icon: <ThreadsIcon />, color: "bg-black", href: `https://www.threads.net/share?url=${encodeURIComponent(shareUrl)}` },
                       { name: "YouTube", icon: <YoutubeIcon />, color: "bg-red-600", href: "https://www.youtube.com/@houseplansfiles8308" },
                       { name: "Call Us", icon: <PhoneIcon />, color: "bg-gray-700", href: "tel:+918815939484" },
                     ].map((p) => (
                       <a
                         key={p.name}
                         href={p.href}
                         target="_blank"
                         rel="noopener noreferrer"
                         title={p.name}
                         className={`w-9 h-9 flex items-center justify-center rounded-md text-white ${p.color} transition-opacity hover:opacity-80`}
                       >
                         {p.icon}
                       </a>
                     ))}
                   </div>
                   <p className="text-sm font-bold text-gray-400 text-center italic mt-4">Interested in similar work?</p>
                   <Button onClick={() => navigate(`/contractors/${id}`)} className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-extrabold shadow-xl shadow-orange-600/30 transition-all active:scale-95">
                      Hiring Details
                   </Button>
                </div>
            </div>
          </aside>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-orange-600" />
                Customer Reviews
              </h2>
              <p className="text-gray-500 font-bold text-sm">Real feedback from past clients on this execution</p>
            </div>
            <div className="flex items-center gap-3 bg-orange-50/50 px-6 py-3 rounded-2xl border border-orange-100 shadow-inner">
              <Star className="w-5 h-5 text-orange-600 fill-orange-600" />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-orange-600">
                    {project.reviews?.length > 0
                      ? (project.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / project.reviews.length).toFixed(1)
                      : "0.0"}
                  </span>
                  <span className="text-orange-300 font-bold text-sm">/ 5.0</span>
                </div>
                <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest mt-0.5">
                  {project.reviews?.length || 0} valid reviews
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Review Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 rounded-[2rem] p-6 md:p-8 space-y-6 border border-gray-100 sticky top-32">
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-600" />
                    How would you rate this work?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform active:scale-90 ${
                          rating >= s
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105"
                            : "bg-white text-gray-300 border border-gray-100 hover:border-orange-300 hover:text-orange-300"
                        }`}
                      >
                        <Star className={`w-5 h-5 ${rating >= s ? "fill-white" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-600" />
                    Your feedback
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked about this project..."
                    className="w-full min-h-[120px] bg-white rounded-2xl border border-gray-100 p-6 text-gray-900 font-bold placeholder:text-gray-300 focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 outline-none transition-all resize-none shadow-sm text-sm"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg gap-3 transition-all shadow-xl shadow-gray-200 group"
                >
                  {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  Submit Review
                </Button>
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase">Authentic reviews help our community grow.</p>
              </form>
            </div>

            {/* Review List */}
            <div className="lg:col-span-7 space-y-6">
              {project.reviews?.length > 0 ? (
                project.reviews.slice().reverse().map((rev: any, i: number) => (
                  <div key={i} className="p-6 rounded-[1.5rem] bg-white border border-gray-50 flex flex-col sm:flex-row gap-6 hover:border-orange-100 hover:shadow-xl transition-all duration-500 group">
                    <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white text-xl font-black shrink-0 shadow-lg shadow-orange-600/20 group-hover:rotate-6 transition-transform">
                      {rev.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="text-lg font-black text-gray-900">{rev.name}</h4>
                        <div className="flex gap-0.5 bg-orange-50 px-2.5 py-1 rounded-full">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${rev.rating >= s ? "text-orange-600 fill-orange-600" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 font-bold text-sm leading-relaxed">{rev.comment}</p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-2">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center">
                  <div className="bg-white p-8 rounded-full shadow-lg mb-6">
                    <MessageSquare className="w-16 h-16 text-gray-200" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-400 font-bold max-w-xs mx-auto italic">Be the first client to share your experience with this project.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Suggested Projects Section */}
        <section className="mt-20 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                <div className="w-1.5 h-8 bg-orange-600 rounded-full" />
                More Projects by {contractor.name}
              </h2>
              <p className="text-gray-500 font-bold text-sm">Explore other landmark executions from this professional</p>
            </div>
            <Button 
               variant="outline" 
               onClick={() => navigate(`/contractors/${id}`)}
               className="hidden md:flex rounded-full px-6 h-10 border-gray-200 font-black text-gray-500 hover:border-orange-600 hover:text-orange-600 gap-2 transition-all text-xs uppercase tracking-widest"
            >
               View All Work <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {contractor.workSamples
              ?.filter((_: any, idx: number) => idx !== Number(projectIdx))
              .slice(0, 3)
              .map((sample: any) => {
                const originalIdx = contractor.workSamples.findIndex((s: any) => s === sample);
                return (
                  <motion.div
                    key={originalIdx}
                    whileHover={{ y: -15 }}
                    onClick={() => {
                      navigate(`/contractors/${id}/project/${originalIdx}`);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
                  >
                    <div className="h-72 bg-gray-100 relative overflow-hidden">
                      <img
                        src={getFileUrl(sample.imageUrl)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        alt={sample.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-2 mb-3">
                           <Badge className="bg-orange-600/90 text-white border-none rounded-full px-3 py-1">
                              {sample.location}
                           </Badge>
                        </div>
                        <h4 className="text-white font-black text-2xl group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                           {sample.title}
                        </h4>
                      </div>
                    </div>
                    <div className="p-8 flex items-center justify-between mt-auto">
                      <span className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Explore Details</span>
                      <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                        <ArrowRight className="w-5 h-5 text-orange-600 group-hover:text-white transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
