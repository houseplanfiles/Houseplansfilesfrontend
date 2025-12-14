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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <>
      {/* 
         ADDED: border-b border-gray-200 to section
         This adds the bottom line you requested.
      */}
      <section className="py-8 md:py-16 bg-soft-teal border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 md:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              Our City Partners
            </h2>
            <p className="mt-2 md:mt-4 text-xs md:text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with approved contractors.
            </p>
          </div>

          {/* Filters */}
          <div className="max-w-2xl mx-auto mb-6 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md space-y-3">
            <div>
              <Label className="font-semibold text-gray-700 text-xs">
                Filter by City
              </Label>
              <div className="relative mt-1">
                <Input
                  placeholder="e.g., Delhi..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label className="font-semibold text-gray-700 text-xs">
                Filter by Profession
              </Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Button
                  variant={professionFilter === "All" ? "default" : "outline"}
                  onClick={() => setProfessionFilter("All")}
                  className="h-8 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={
                    professionFilter === "Building" ? "default" : "outline"
                  }
                  onClick={() => setProfessionFilter("Building")}
                  className="h-8 text-xs"
                >
                  <HardHat className="w-3 h-3 mr-1" /> Building
                </Button>
                <Button
                  variant={
                    professionFilter === "Interior" ? "default" : "outline"
                  }
                  onClick={() => setProfessionFilter("Interior")}
                  className="h-8 text-xs"
                >
                  <Paintbrush className="w-3 h-3 mr-1" /> Interior
                </Button>
              </div>
            </div>
          </div>

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
      </section>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedContractor}
      />
    </>
  );
};

export default ConstructionPartnersSection;
