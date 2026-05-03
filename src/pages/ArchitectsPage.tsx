"use client";

import React, { useState, useEffect, useMemo, FC, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchArchitects } from "@/lib/features/users/userSlice.tsx";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";

import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Components
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Animation & Icons
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  Star,
  Briefcase,
  Search,
  CheckCircle2,
  Filter,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  BookOpen,
  Zap,
} from "lucide-react";

// --- Types ---
type ArchitectType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  qualification?: string;
  skills?: string[];
  charges?: string;
  phone?: string;
  profession?: string;
  status?: string;
  contractorType?: "Normal" | "Verified" | "Premium";
};

// --- Contact Modal Component ---
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: ArchitectType | null;
}> = ({ isOpen, onClose, user }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus } = useSelector((state: RootState) => state.inquiries);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inquiryData = {
      recipient: user._id,
      recipientInfo: {
        name: user.name,
        role: "Architect",
        phone: user.phone,
        city: user.city,
        address: user.address,
        detail: `${user.profession} - ${user.qualification}`,
      },
      senderName: formData.get("name") as string,
      senderEmail: formData.get("email") as string,
      senderWhatsapp: formData.get("whatsapp") as string,
      requirements: formData.get("requirements") as string,
    };

    dispatch(createInquiry(inquiryData)).then((result) => {
      if (createInquiry.fulfilled.match(result)) {
        toast.success(`Your inquiry has been sent to ${user.name}!`);
        dispatch(resetActionStatus());
        onClose();
      } else {
        toast.error(String(result.payload) || "An error occurred.");
        dispatch(resetActionStatus());
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Contact {user.name}
                </h2>
                <p className="text-gray-400 text-sm">
                  Discuss your architectural requirements
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@email.com"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="+91..."
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Project Details</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="Describe your project, plot size, or specific requirements..."
                    rows={4}
                    required
                    className="mt-1 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium bg-orange-600 hover:bg-orange-700"
                  disabled={actionStatus === "loading"}
                >
                  {actionStatus === "loading" ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {actionStatus === "loading" ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main Page Component ---
const ArchitectsPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { architects, architectListStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArchitect, setSelectedArchitect] =
    useState<ArchitectType | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [revealedPhoneIds, setRevealedPhoneIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 8;
  
  const togglePhoneReveal = (id: string) => {
    setRevealedPhoneIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  useEffect(() => {
    dispatch(fetchArchitects({ page: 1, limit: 500 }));
  }, [dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [cityFilter, professionFilter]);

  const filteredArchitects = useMemo(() => {
    if (!Array.isArray(architects)) return [];

    const typedArchitects = architects as ArchitectType[];

    return typedArchitects.filter((c) => {
      const isApproved = c.status === "Approved";
      const matchesCity =
        !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());

      const matchesProfession =
        professionFilter === "All" ||
        c.profession?.toLowerCase() === professionFilter.toLowerCase();

      return isApproved && matchesCity && matchesProfession;
    });
  }, [architects, cityFilter, professionFilter]);

  const totalPages = Math.ceil(filteredArchitects.length / itemsPerPage);
  const paginatedArchitects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredArchitects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredArchitects, currentPage, itemsPerPage]);

  const handleContactClick = (architect: ArchitectType) => {
    setSelectedArchitect(architect);
    setIsModalOpen(true);
  };

  const categories = [
    "All",
    "Architect",
    "Civil Design Engineer",
    "Structure Engineer",
    "Interior Designer",
    "Site Engineer",
    "MEP Consultant",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Top Architects & Structural Designers | HousePlanFiles</title>
        <meta
          name="description"
          content="Find the best architects, structural engineers, and interior designers for your home construction project."
        />
      </Helmet>

      <Navbar />

      {/* --- Hero Section --- */}
      <div className="relative bg-slate-900 py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/architect_hero.png"
            alt="Architects Background"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-1 text-sm backdrop-blur-md">
            Design Experts
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 uppercase">
            Hire Your Top City Architects, Interior Designers & Professionals
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-medium">
            2D, 3D, Structural and Site Engineers
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/register")}
              className="bg-orange-600 text-white hover:bg-orange-700 font-bold py-6 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 text-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Join as a Professional
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-20">
        {/* --- Filters Section --- */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-10">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            {/* City Search */}
            <div className="w-full lg:w-1/3">
              <Label
                htmlFor="city-filter"
                className="text-xs font-bold text-gray-500 uppercase tracking-wide"
              >
                Search by City
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="city-filter"
                  placeholder="e.g. Delhi, Mumbai, Lucknow"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Profession Filter */}
            <div className="w-full lg:w-2/3">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-2">
                <Filter className="w-3 h-3" /> Specialization
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProfessionFilter(cat)}
                    className={`px-4 h-10 rounded-full text-sm font-medium transition-all border ${
                      professionFilter === cat
                        ? "bg-orange-600 text-white border-orange-600 shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Content Grid --- */}
        {architectListStatus === "loading" ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            <p className="mt-4 text-gray-500">Finding experts...</p>
          </div>
        ) : (
          <>
            {paginatedArchitects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedArchitects.map((architect, index) => {
                    const type = architect.contractorType || "Normal";
                    const phoneStr = architect.phone ? architect.phone.replace(/\D/g, '') : '';
                    const waLink = `https://wa.me/${phoneStr}?text=${encodeURIComponent(`Hi ${architect.name}, I found your profile on HousePlansFiles and would like to consult with you.`)}`;
                    const callLink = `tel:${phoneStr}`;

                    return (
                      <motion.div
                        key={architect._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                      >
                        {/* Cover Image */}
                        <div className="h-32 bg-orange-50 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-white flex items-center justify-center">
                             <Building className="w-12 h-12 text-orange-200" />
                          </div>
                          {architect.contractorType === "Premium" && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg px-3 py-1 font-bold">
                                <Zap className="w-3 h-3 mr-1 fill-current" /> Premium
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Profile Section */}
                        <div className="px-5 pb-5 flex flex-col flex-grow relative">
                          {/* Avatar Overlap */}
                          <div className="-mt-10 mb-3">
                            <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                              <AvatarImage
                                src={architect.photoUrl}
                                alt={architect.name}
                              />
                              <AvatarFallback className="text-xl font-bold bg-orange-600 text-white">
                                {architect.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* Info */}
                          <div className="flex-grow">
                            <div className="flex items-center gap-1.5 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                                {architect.name}
                              </h3>
                              {type === "Verified" && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                            </div>
                            
                            <p className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {architect.qualification || "Expert Designer"}
                            </p>

                            <div className="space-y-2.5">
                              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                                <Briefcase className="w-4 h-4 text-orange-600 shrink-0" />
                                <span className="text-sm text-orange-900 font-medium line-clamp-1">
                                  {architect.profession}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 px-2">
                                <Star className="w-4 h-4 text-orange-500 shrink-0" />
                                <span className="text-sm text-gray-600">
                                  {architect.experience} Experience
                                </span>
                              </div>
                              <div className="flex items-center gap-3 px-2">
                                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                <span className="text-sm text-gray-600 line-clamp-1">
                                  {architect.city || "Available locally"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Skills Tag Cloud */}
                            {architect.skills && architect.skills.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-1.5">
                                {architect.skills.slice(0, 3).map(skill => (
                                  <span key={skill} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                    {skill}
                                  </span>
                                ))}
                                {architect.skills.length > 3 && (
                                  <span className="text-[10px] px-2 py-0.5 text-gray-400">+{architect.skills.length - 3} more</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="pt-5 mt-auto flex flex-col gap-2">
                            {type === "Premium" && (
                              <Button
                                onClick={() => navigate(`/architects/${architect._id}`)}
                                variant="outline"
                                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-11"
                              >
                                View Profile
                              </Button>
                            )}

                            {type === "Premium" && (
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  onClick={() => window.open(waLink, "_blank")}
                                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-11 px-0"
                                >
                                  <MessageCircle className="w-4 h-4 mr-1.5" />
                                  WhatsApp
                                </Button>
                                <Button 
                                  onClick={() => {
                                    if (revealedPhoneIds.has(architect._id)) {
                                      window.location.href = callLink;
                                    } else {
                                      togglePhoneReveal(architect._id);
                                    }
                                  }}
                                  className={`w-full ${revealedPhoneIds.has(architect._id) ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors h-11 px-0`}
                                >
                                  <Phone className="w-4 h-4 mr-1.5" />
                                  {revealedPhoneIds.has(architect._id) ? architect.phone : "Call Now"}
                                </Button>
                              </div>
                            )}

                            {type === "Verified" && (
                              <Button 
                                onClick={() => window.open(waLink, "_blank")}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors h-11"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp Enquiry
                              </Button>
                            )}

                            {type === "Normal" && (
                              <Button 
                                onClick={() => handleContactClick(architect)} 
                                className="w-full bg-gray-800 hover:bg-gray-900 text-white transition-colors h-11 shadow-sm"
                              >
                                Request Quote
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-bold ${
                          currentPage === pageNum ? "bg-orange-600 hover:bg-orange-700" : ""
                        }`}
                      >
                        {pageNum}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="rounded-xl"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  No experts found
                </h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  We couldn't find any approved {professionFilter !== "All" ? professionFilter : "professionals"} matching "
                  <span className="font-medium text-gray-900">
                    {cityFilter || "All cities"}
                  </span>
                  ".
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCityFilter("");
                    setProfessionFilter("All");
                  }}
                  className="mt-6"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedArchitect}
      />

      <Footer />
    </div>
  );
};

export default ArchitectsPage;
