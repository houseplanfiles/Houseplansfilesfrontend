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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPin,
  Star,
  Building,
  Phone,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
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

const contractorSubCategories = [
  "General Contractor",
  "Civil Contractor",
  "Interior Contractor",
  "Electrical Contractor",
  "Plumbing Contractor",
];
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://architect-backend.vercel.app";
const getImageUrl = (path?: string) =>
  !path
    ? "https://via.placeholder.com/300x200?text=No+Image"
    : path.startsWith("http")
      ? path
      : `${BACKEND_URL}/${path.replace(/^\//, "")}`;

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
        toast.success(`Inquiry sent to ${user.name}!`);
        dispatch(resetActionStatus());
        onClose();
      } else {
        toast.error(String(result.payload) || "Error occurred.");
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
                <p className="text-gray-500">Get a quote.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" required />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input type="tel" id="whatsapp" name="whatsapp" required />
              </div>
              <div>
                <Label htmlFor="requirements">Details</Label>
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
    ${isMobile ? "w-full p-2 shadow-sm" : "w-[280px] p-0 flex-shrink-0 snap-start pb-4 hover:-translate-y-2"}`}
  >
    <div
      className={`bg-gray-200 relative ${isMobile ? "h-20 rounded-lg overflow-hidden" : "h-40"}`}
    >
      <img
        src={getImageUrl(contractor.shopImageUrl)}
        alt="Shop"
        className="w-full h-full object-cover"
      />
    </div>
    <div
      className={`relative flex flex-col flex-grow ${isMobile ? "-mt-6 px-1" : "p-4 pt-12 -mt-10"}`}
    >
      <div
        className={`${isMobile ? "mx-auto" : "absolute -top-10 left-1/2 -translate-x-1/2"}`}
      >
        <Avatar
          className={`border-4 border-white shadow-md bg-white ${isMobile ? "w-12 h-12" : "w-20 h-20"}`}
        >
          <AvatarImage
            src={getImageUrl(contractor.photoUrl)}
            alt={contractor.name}
          />
          <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
            {contractor.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className={`text-center flex-grow ${isMobile ? "pt-1" : "pt-2"}`}>
        <h3
          className={`font-bold text-gray-800 leading-tight truncate ${isMobile ? "text-xs" : "text-lg"}`}
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
          <span className="truncate max-w-[100px]">
            {contractor.companyName || "Contractor"}
          </span>
        </div>
        <div
          className={`text-left text-gray-500 mx-auto ${isMobile ? "mt-2 space-y-1 text-[9px]" : "mt-4 space-y-1.5 text-sm"}`}
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
            <span className="truncate">{contractor.experience}</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin
              className={`${isMobile ? "w-3 h-3 mt-0.5" : "w-4 h-4 mt-0.5"} shrink-0 text-primary`}
            />
            <span className="line-clamp-1">
              {contractor.address}, {contractor.city}
            </span>
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

const ContractorsSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] =
    useState<ContractorType | null>(null);

  useEffect(() => {
    dispatch(fetchContractors());
  }, [dispatch]);

  const filteredContractors = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    return contractors.filter((c) => {
      const isApproved = c.status === "Approved";
      const isNormal = c.contractorType === "Normal" || !c.contractorType;
      const matchesCity =
        !cityFilter || c.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesSubCategory =
        subCategoryFilter === "all" || c.profession === subCategoryFilter;
      return isApproved && isNormal && matchesCity && matchesSubCategory;
    });
  }, [cityFilter, subCategoryFilter, contractors]);

  const handleContactClick = (contractor: ContractorType) => {
    setSelectedContractor(contractor);
    setIsModalOpen(true);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current)
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
  };

  return (
    <>
      {/* 
         ADDED: border-b border-gray-200 to section
         This adds the bottom line you requested.
      */}
      <section className="py-8 md:py-15 bg-soft-teal border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 md:px-8">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              Hire Local Contractors
            </h2>
            <p className="mt-2 md:mt-4 text-xs md:text-lg text-gray-600 max-w-2xl mx-auto">
              Find experienced contractors.
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
                  placeholder="e.g., Pune..."
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
              <div className="relative mt-1">
                <Select
                  value={subCategoryFilter}
                  onValueChange={setSubCategoryFilter}
                >
                  <SelectTrigger className="pl-9 h-9 text-sm">
                    <SelectValue placeholder="Select Profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Professions</SelectItem>
                    {contractorSubCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              {filteredContractors.length === 0 ? (
                <div className="w-full text-center py-12 text-gray-500 bg-white/50 rounded-xl">
                  <p className="text-sm">No contractors found.</p>
                </div>
              ) : (
                <>
                  {/* DESKTOP VIEW */}
                  <div className="hidden md:block">
                    {filteredContractors.length > 3 && (
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
                        {filteredContractors.map((contractor) => (
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
                    {/* Added gap-4 for partition effect */}
                    <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 snap-x scrollbar-hide">
                      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                      {filteredContractors.map((contractor) => (
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

export default ContractorsSection;
