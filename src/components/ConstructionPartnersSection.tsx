"use client";

import React, {
  useState,
  useEffect,
  useMemo,
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
  Star,
  Briefcase,
  CheckCircle2,
  UserPlus,
  Search,
  Filter,
  HardHat,
  Paintbrush,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types ---
type CityPartnerType = {
  _id: string;
  name?: string;
  companyName?: string;
  city?: string;
  address?: string;
  experience?: string;
  photoUrl?: string;
  shopImageUrl?: string;
  phone?: string;
  profession?: string;
  status?: string;
  contractorType?: "Normal" | "Verified" | "Premium";
};

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://architect-backend.vercel.app";

const getImageUrl = (path?: string) =>
  !path
    ? "/contractor.jpeg"
    : path.startsWith("http")
      ? path
      : `${BACKEND_URL}/${path.replace(/^\//, "")}`;

// --- Contact Modal ---
const ContactModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  user: CityPartnerType | null;
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
        name: user.name || "Partner",
        role: "City Partner",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        detail: `${user.profession || "Contractor"} - ${user.experience || "Experienced"}`,
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
        toast.error(typeof result.payload === 'string' ? result.payload : "An error occurred.");
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
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Contact {user.name}</h2>
                <p className="text-gray-400 text-sm">Get a quote for your project</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" name="name" placeholder="John Doe" required className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" placeholder="you@email.com" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input type="tel" id="whatsapp" name="whatsapp" placeholder="+91..." required className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Requirement Details</Label>
                  <Textarea id="requirements" name="requirements" placeholder="Tell us about your project..." rows={4} required className="mt-1 resize-none" />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium bg-orange-600 hover:bg-orange-700" disabled={actionStatus === "loading"}>
                  {actionStatus === "loading" ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
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

// --- Partner Card ---
const PartnerCard: FC<{
  partner: CityPartnerType;
  onContact: (p: CityPartnerType) => void;
  index: number;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ partner, onContact, index, navigate }) => {
  const type = partner.contractorType || "Normal";
  const phoneStr = partner.phone ? partner.phone.replace(/\D/g, '') : '';
  const waLink = `https://wa.me/${phoneStr}?text=${encodeURIComponent(`Hi ${partner.name}, I found your profile on HousePlansFiles and would like to discuss a project.`)}`;
  const callLink = `tel:${phoneStr}`;

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
  >
    <div className="h-32 bg-gray-100 relative">
      <img src={getImageUrl(partner.shopImageUrl)} alt={partner.companyName} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
        {partner.contractorType === "Premium" && (
          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-none shadow-md">
            <Star className="w-3 h-3 mr-1 fill-current" /> Premium
          </Badge>
        )}
        {partner.contractorType === "Verified" && (
          <Badge className="bg-green-500 hover:bg-green-600 gap-1 pl-1 pr-2 shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </Badge>
        )}
      </div>
    </div>

    <div className="px-5 pb-5 flex flex-col flex-grow relative">
      <div className="-mt-10 mb-3">
        <Avatar className="w-20 h-20 border-4 border-white shadow-md">
          <AvatarImage src={getImageUrl(partner.photoUrl)} alt={partner.name} />
          <AvatarFallback className="text-xl font-bold bg-orange-100 text-orange-700">
            {partner.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {partner.name}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1 mb-4">
          <Building className="w-3.5 h-3.5" />
          <span className="font-medium line-clamp-1">{partner.companyName || "City Partner"}</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm text-gray-700 font-medium line-clamp-1">{partner.profession}</span>
          </div>
          <div className="flex items-center gap-3 px-2">
            <Star className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm text-gray-600">{partner.experience} Experience</span>
          </div>
          <div className="flex items-center gap-3 px-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-1">{partner.city || "Available locally"}</span>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-auto flex flex-col gap-2">
        {type === "Premium" && (
          <Button 
            onClick={() => navigate(`/contractors/${partner._id}`)}
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
              onClick={() => window.location.href = callLink}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors h-11 px-0"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Call Now
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
            onClick={() => onContact(partner)} 
            className="w-full bg-gray-800 hover:opacity-90 text-white transition-colors h-11"
          >
            Enquiry Now
          </Button>
        )}
      </div>
    </div>
  </motion.div>
)};

// --- MAIN COMPONENT: ConstructionPartnersSection ---
const ConstructionPartnersSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  
  const { contractors, contractorListStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<CityPartnerType | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchContractors({ 
        city: cityFilter, 
        status: "Approved",
        limit: 24 // Fetch a reasonable amount for the section
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, cityFilter]);

  const filteredPartners = useMemo(() => {
    if (!Array.isArray(contractors)) return [];
    
    return (contractors as CityPartnerType[]).filter((p) => {
      const isApproved = p.status === "Approved";
      const isValidType = ["Normal", "Verified", "Premium"].includes(p.contractorType || "");
      
      const matchesCity = !cityFilter || p.city?.toLowerCase().includes(cityFilter.toLowerCase());
      
      const lowerCaseProfession = p.profession?.toLowerCase() || "";
      const matchesProfession =
        professionFilter === "All" ||
        (professionFilter === "Building" &&
          (lowerCaseProfession.includes("civil") ||
            lowerCaseProfession.includes("general") ||
            lowerCaseProfession.includes("building"))) ||
        (professionFilter === "Interior" &&
          lowerCaseProfession.includes("interior"));

      return isApproved && isValidType && matchesCity && matchesProfession;
    });
  }, [contractors, cityFilter, professionFilter]);

  const handleContactClick = (partner: CityPartnerType) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="city-partners" className="bg-gray-50 py-16 md:py-24 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- HERO HEADER --- */}
          <div className="relative bg-gray-900 p-10 md:p-16 rounded-[2rem] overflow-hidden mb-12 shadow-2xl">
            <div className="absolute inset-0 opacity-20">
               <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80" alt="bg" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div>
                <Badge className="bg-orange-500 hover:bg-orange-600 mb-4 px-4 py-1.5 text-sm border-none">Trusted Network</Badge>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                  City Partners & Contractors
                </h2>
                <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl px-2 md:px-0">
                  Find verified professionals for your dream project. From civil work to interior design, we have the best partners.
                </p>
              </div>
              <Button
                onClick={() => navigate("/register")}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-8 px-12 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 text-lg flex items-center gap-3 whitespace-nowrap"
              >
                <UserPlus className="w-6 h-6" />
                Register With Us
              </Button>
            </div>
          </div>

          <main className="relative z-10">
            {/* --- FILTERS SECTION (Restored) --- */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-10 -mt-10 md:-mt-20">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                  {/* City Search */}
                  <div className="w-full md:w-1/2 text-left">
                    <Label htmlFor="city-filter" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Find by City
                    </Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="city-filter"
                        placeholder="Search City (e.g. Delhi, Mumbai)"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Profession Filter Toggle */}
                  <div className="w-full md:w-1/2 text-left">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                      <Filter className="w-3 h-3" /> Profession
                    </Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
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

            {/* --- GRID CONTENT --- */}
            {contractorListStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
                <p className="mt-4 text-gray-500">Loading partners...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredPartners.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No partners found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredPartners.slice(0, 8).map((partner, index) => (
                      <PartnerCard key={partner._id} partner={partner} onContact={handleContactClick} index={index} navigate={navigate} />
                    ))}
                  </div>
                )}
                
                <div className="text-center">
                  <Button 
                    onClick={() => navigate("/city-partners")}
                    variant="outline" 
                    className="border-gray-300 text-gray-600 hover:bg-gray-900 hover:text-white px-8 py-6 rounded-xl text-lg font-medium"
                  >
                    View All Partners
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </section>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedPartner}
      />
    </>
  );
};

export default ConstructionPartnersSection;
