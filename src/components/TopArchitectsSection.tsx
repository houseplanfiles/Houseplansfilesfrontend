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
import { fetchArchitects } from "@/lib/features/users/userSlice";
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
  MessageCircle,
  Zap,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Types ---
type ArchitectType = {
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
  qualification?: string;
  skills?: string[];
  status?: string;
  contractorType?: "Normal" | "Verified" | "Premium";
};

// --- Contact Modal ---
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
        name: user.name || "Architect",
        role: "Architect",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        detail: `${user.profession || "Architect"} - ${user.qualification || "Expert"}`,
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
            <div className="bg-orange-600 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h2 className="text-xl font-bold">Contact {user.name}</h2>
                <p className="text-orange-100 text-sm">Design your dream home</p>
              </div>
              <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
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
                  <Textarea id="requirements" name="requirements" placeholder="Plot size, floor preference, or design style..." rows={4} required className="mt-1 resize-none" />
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

// --- Architect Card ---
const ArchitectCard: FC<{
  architect: ArchitectType;
  onContact: (p: ArchitectType) => void;
  index: number;
  navigate: ReturnType<typeof useNavigate>;
}> = ({ architect, onContact, index, navigate }) => {
  const type = architect.contractorType || "Normal";
  const phoneStr = architect.phone ? architect.phone.replace(/\D/g, '') : '';
  const waLink = `https://wa.me/${phoneStr}?text=${encodeURIComponent(`Hi ${architect.name}, I found your profile on HousePlansFiles and would like to discuss a design project.`)}`;
  const callLink = `tel:${phoneStr}`;

  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
  >
    <div className="h-32 bg-orange-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-white flex items-center justify-center">
        <Building className="w-12 h-12 text-orange-200" />
      </div>
      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
        {architect.contractorType === "Premium" && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md px-3 py-1 font-bold">
            <Zap className="w-3 h-3 mr-1 fill-current" /> Premium
          </Badge>
        )}
        {architect.contractorType === "Verified" && (
          <Badge className="bg-blue-600 hover:bg-blue-700 gap-1 pl-1 pr-2 shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> Verified
          </Badge>
        )}
      </div>
    </div>

    <div className="px-5 pb-5 flex flex-col flex-grow relative">
      <div className="-mt-10 mb-3">
        <Avatar className="w-20 h-20 border-4 border-white shadow-md">
          <AvatarImage src={architect.photoUrl} alt={architect.name} />
          <AvatarFallback className="text-xl font-bold bg-orange-600 text-white">
            {architect.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
          {architect.name}
        </h3>
        <p className="text-gray-500 text-xs font-medium mb-4 flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> {architect.qualification || "Expert Designer"}
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="text-sm text-orange-900 font-medium line-clamp-1">{architect.profession}</span>
          </div>
          <div className="flex items-center gap-3 px-2">
            <Star className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm text-gray-600">{architect.experience} Experience</span>
          </div>
          <div className="flex items-center gap-3 px-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-sm text-gray-600 line-clamp-1">{architect.city || "Available locally"}</span>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-auto flex flex-col gap-2">
        {type === "Premium" && (
          <Button 
            onClick={() => navigate(`/architects/${architect._id}`)}
            variant="outline" 
            className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 h-11"
          >
            View Portfolio
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
              Call
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
            onClick={() => onContact(architect)} 
            className="w-full bg-gray-900 hover:opacity-90 text-white transition-colors h-11 rounded-xl"
          >
            Request Quote
          </Button>
        )}
      </div>
    </div>
  </motion.div>
)};

// --- MAIN COMPONENT: TopArchitectsSection ---
const TopArchitectsSection: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  
  const { architects, architectListStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArchitect, setSelectedArchitect] = useState<ArchitectType | null>(null);
  const [cityFilter, setCityFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchArchitects({ 
        city: cityFilter, 
        status: "Approved",
        limit: 12
      }));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, cityFilter]);

  const filteredArchitects = useMemo(() => {
    if (!Array.isArray(architects)) return [];
    
    return (architects as ArchitectType[]).filter((p) => {
      const isApproved = p.status === "Approved";
      const matchesCity = !cityFilter || p.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesProfession =
        professionFilter === "All" ||
        p.profession?.toLowerCase() === professionFilter.toLowerCase();

      return isApproved && matchesCity && matchesProfession;
    });
  }, [architects, cityFilter, professionFilter]);

  const handleContactClick = (architect: ArchitectType) => {
    setSelectedArchitect(architect);
    setIsModalOpen(true);
  };

  const professions = ["All", "Architect", "Interior Designer", "Structure Engineer"];

  return (
    <>
      <section id="top-architects" className="bg-white py-16 md:py-24 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* --- HERO HEADER --- */}
          <div className="relative bg-orange-600 p-10 md:p-16 rounded-[2rem] overflow-hidden mb-12 shadow-xl shadow-orange-100">
            <div className="absolute inset-0 opacity-20">
               <img src="/architect_hero.png" alt="Architectural Background" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-4 px-4 py-1.5 text-sm backdrop-blur-md">Expert Design Team</Badge>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                  Top Architects & Designers
                </h2>
                <p className="mt-4 text-lg md:text-xl text-orange-50 max-w-2xl">
                  Consult with India's most talented architects, interior designers and structural engineers for your dream home.
                </p>
              </div>
              <Button
                onClick={() => navigate("/register")}
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold py-8 px-12 rounded-full shadow-2xl transition-all transform hover:-translate-y-1 text-lg flex items-center gap-3 whitespace-nowrap"
              >
                <UserPlus className="w-6 h-6" />
                Join as Architect
              </Button>
            </div>
          </div>

          <main className="relative z-10">
            {/* --- FILTERS SECTION --- */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-10 -mt-10 md:-mt-20">
                <div className="flex flex-col lg:flex-row gap-6 items-end">
                  {/* City Search */}
                  <div className="w-full lg:w-1/3 text-left">
                    <Label htmlFor="arch-city-filter" className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Find Experts by City
                    </Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="arch-city-filter"
                        placeholder="Search City (e.g. Lucknow, Delhi)"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Profession Filter Toggle */}
                  <div className="w-full lg:w-2/3 text-left">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2 mb-2">
                      <Filter className="w-3 h-3" /> Select Category
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {professions.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setProfessionFilter(cat)}
                          className={`px-6 h-12 rounded-xl text-sm font-medium transition-all border ${
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

            {/* --- GRID CONTENT --- */}
            {architectListStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
                <p className="mt-4 text-gray-500">Connecting to experts...</p>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredArchitects.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No designers found matching your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredArchitects.slice(0, 8).map((architect, index) => (
                      <ArchitectCard key={architect._id} architect={architect} onContact={handleContactClick} index={index} navigate={navigate} />
                    ))}
                  </div>
                )}
                
                <div className="text-center">
                  <Button 
                    onClick={() => navigate("/architects")}
                    className="bg-gray-900 hover:bg-orange-600 text-white px-10 py-7 rounded-2xl text-lg font-bold shadow-lg transition-all"
                  >
                    View All Architects & Designers
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
        user={selectedArchitect}
      />
    </>
  );
};

export default TopArchitectsSection;
