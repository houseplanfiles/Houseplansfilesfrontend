"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  FC,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchContractors } from "@/lib/features/users/userSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/inquiries/inquirySlice";

// ✅ useNavigate added
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  Briefcase,
  Paintbrush,
  HardHat,
  UserPlus,
  Search,
  Filter,
} from "lucide-react";

type ContractorType = {
  _id: string;
  name: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  shopImageUrl?: string;
  phone?: string;
  profession?: string;
  status?: string;
  contractorType?: "Normal" | "Premium";
};

// --- Contact Modal ---
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: ContractorType | null;
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
        role: "Contractor",
        phone: user.phone,
        city: user.city,
        address: user.address,
        detail: `${user.profession} - ${user.experience}`,
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Contact {user.name}
                </h2>
                <p className="text-gray-500">
                  Share your project details to get a quote.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">Your Email</Label>
                <Input type="email" id="email" name="email" required />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input type="tel" id="whatsapp" name="whatsapp" required />
              </div>
              <div>
                <Label htmlFor="requirements">Project Details</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={actionStatus === "loading"}
              >
                {actionStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {actionStatus === "loading" ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Contractor Card ---
const ContractorCard: FC<{
  contractor: ContractorType;
  onContact: (c: ContractorType) => void;
  isMobile?: boolean;
}> = ({ contractor, onContact, isMobile = false }) => (
  <div
    className={`bg-white rounded-xl flex flex-col group transition-all duration-300 border border-gray-100 hover:border-primary hover:shadow-xl overflow-hidden
    ${
      isMobile
        ? "w-full p-2 shadow-sm"
        : "w-[280px] p-4 flex-shrink-0 snap-start hover:-translate-y-2"
    }`}
  >
    <div
      className={`bg-gray-100 rounded-lg overflow-hidden shrink-0 ${isMobile ? "h-20" : "h-40"}`}
    >
      <img
        src={
          contractor.shopImageUrl ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={contractor.companyName}
        className="w-full h-full object-cover"
      />
    </div>
    <div
      className={`relative flex-grow flex flex-col ${isMobile ? "-mt-6 px-1" : "-mt-10"}`}
    >
      <Avatar
        className={`mx-auto mb-2 border-4 border-white shadow-md bg-white ${isMobile ? "w-12 h-12" : "w-20 h-20 mb-3"}`}
      >
        <AvatarImage src={contractor.photoUrl} alt={contractor.name} />
        <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
          {contractor.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-center flex-grow">
        <h3
          className={`font-bold text-gray-800 leading-tight truncate px-1 ${isMobile ? "text-sm" : "text-lg"}`}
        >
          {contractor.name}
        </h3>
        <div
          className={`flex items-center justify-center gap-1 text-gray-500 ${isMobile ? "text-[10px] mt-0.5" : "text-sm mt-1"}`}
        >
          <Building
            className={
              isMobile ? "w-3 h-3 text-primary" : "w-4 h-4 text-primary"
            }
          />
          <span className="font-medium truncate max-w-[120px]">
            {contractor.companyName || "Freelancer"}
          </span>
        </div>
        <div
          className={`text-left text-gray-500 mx-auto ${isMobile ? "mt-2 space-y-1 text-[10px]" : "mt-4 space-y-1.5 text-sm"}`}
        >
          <div className="flex items-center gap-1.5">
            <Briefcase
              className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} shrink-0 text-primary`}
            />
            <span className="truncate">{contractor.profession}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star
              className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} shrink-0 text-primary`}
            />
            <span className="truncate">{contractor.experience} Exp.</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin
              className={`${isMobile ? "w-3 h-3 mt-0.5" : "w-4 h-4 mt-0.5"} shrink-0 text-primary`}
            />
            <span className="line-clamp-1">{contractor.city}</span>
          </div>
        </div>
      </div>
      <Button
        onClick={() => onContact(contractor)}
        className={`w-full btn-primary bg-slate-800 text-white hover:bg-slate-700 ${isMobile ? "mt-2 h-7 text-[10px]" : "mt-4 h-10"}`}
        type="button"
      >
        <Phone className={`${isMobile ? "w-3 h-3 mr-1" : "w-4 h-4 mr-2"}`} />{" "}
        Contact
      </Button>
    </div>
  </div>
);

const ConstructionPartnersSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<ContractorType | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  const approvedContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    return contractors.filter((c) => {
      const isApproved = c.status === "Approved";
      const isPremium = c.contractorType === "Premium";
      const matchesCity =
        !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const lowerCaseProfession = c.profession?.toLowerCase() || "";
      const matchesProfession =
        professionFilter === "All" ||
        (professionFilter === "Building" &&
          (lowerCaseProfession.includes("civil") ||
            lowerCaseProfession.includes("general"))) ||
        (professionFilter === "Interior" &&
          lowerCaseProfession.includes("interior"));
      return isApproved && isPremium && matchesCity && matchesProfession;
    });
  }, [contractors, cityFilter, professionFilter]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    // ✅ Reverted entire background to bg-soft-teal
    <div className="bg-soft-teal border-b border-gray-200 pb-16">
      {/* ✅ HERO BANNER SECTION (Changed from bg-gray-900 back to bg-soft-teal) */}
      <div className="relative bg-soft-teal pt-20 pb-32 sm:pt-24 sm:pb-40 overflow-hidden">
        {/* Background image removed, gradient removed */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <Badge className="bg-orange-500 hover:bg-orange-600 mb-6 px-4 py-1.5 text-sm font-medium rounded-full">
            Trusted Network
          </Badge>
          {/* ✅ Text colors changed to Dark (gray-900) since background is light */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            City Partners & Contractors
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Find verified professionals for your dream project. From civil work
            to interior design, we have the best partners.
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => navigate("/register")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-10 rounded-full shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1 text-lg flex items-center gap-2"
            >
              <UserPlus className="w-6 h-6" />
              Register With Us
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ OVERLAPPING FILTER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 mb-12">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* City Search */}
            <div className="w-full md:w-1/2">
              <Label
                htmlFor="city-filter"
                className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block"
              >
                Find by City
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="city-filter"
                  placeholder="Search City (e.g. Delhi, Mumbai)"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all text-base"
                />
              </div>
            </div>

            {/* Profession Filter */}
            <div className="w-full md:w-1/2">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Filter className="w-3 h-3" /> Profession
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setProfessionFilter("All")}
                  className={`h-12 rounded-lg text-sm font-medium transition-all border ${
                    professionFilter === "All"
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setProfessionFilter("Building")}
                  className={`h-12 rounded-lg text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                    professionFilter === "Building"
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <HardHat className="w-4 h-4" />
                  <span className="hidden sm:inline">Building</span>
                </button>
                <button
                  onClick={() => setProfessionFilter("Interior")}
                  className={`h-12 rounded-lg text-sm font-medium transition-all border flex items-center justify-center gap-2 ${
                    professionFilter === "Interior"
                      ? "bg-gray-900 text-white border-gray-900 shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Paintbrush className="w-4 h-4" />
                  <span className="hidden sm:inline">Interior</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section (Cards) */}
      <div className="max-w-7xl mx-auto px-2 md:px-8">
        {contractorListStatus === "loading" && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {contractorListStatus === "succeeded" && (
          <div className="relative">
            {approvedContractors.length === 0 ? (
              <div className="w-full text-center py-12 text-gray-500 bg-white/50 rounded-xl">
                <p className="text-sm">No approved partners found.</p>
              </div>
            ) : (
              <>
                {/* DESKTOP VIEW */}
                <div className="hidden md:block">
                  {approvedContractors.length > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80"
                        onClick={() => scroll("left")}
                      >
                        <ChevronLeft />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80"
                        onClick={() => scroll("right")}
                      >
                        <ChevronRight />
                      </Button>
                    </>
                  )}
                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scroll-smooth py-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
                  >
                    <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                    <div className="flex gap-8">
                      {approvedContractors.map((contractor) => (
                        <ContractorCard
                          key={contractor._id}
                          contractor={contractor}
                          onContact={handleContactClick}
                          isMobile={false}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* MOBILE VIEW - Partition Type Scroll */}
                <div className="md:hidden">
                  <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 snap-x scrollbar-hide">
                    <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                    {approvedContractors.map((contractor) => (
                      <div
                        key={contractor._id}
                        className="min-w-[46vw] max-w-[46vw] snap-start"
                      >
                        <ContractorCard
                          contractor={contractor}
                          onContact={handleContactClick}
                          isMobile={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedContractor}
      />
    </div>
  );
};

export default ConstructionPartnersSection;
