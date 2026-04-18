import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Building,
  Phone,
  Briefcase,
  Star,
  Download,
  Mail,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  X,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const ContractorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    const fetchContractor = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/contractor/${id}`
        );
        setContractor(data);
      } catch (error) {
        console.error("Error fetching contractor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContractor();
  }, [id]);

  const getFileUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${import.meta.env.VITE_BACKEND_URL}/${path.replace(/\\/g, "/")}`;
  };

  const handleInquiryAction = (pkg: any = null) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const onInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enquiry sent successfully! The contractor will contact you soon.");
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 italic">
          <h2 className="text-3xl font-black mb-4">Contractor not found</h2>
          <Button onClick={() => navigate("/city-partners")} variant="secondary">Back to Partners</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />

      <main className="pb-32">
        {/* --- LUXURY HERO SECTION --- */}
        <div className="relative h-[350px] md:h-[450px] w-full bg-slate-900 overflow-hidden">
          <img
            src={getFileUrl(contractor.coverPhotoUrl) || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80"}
            alt="Cover"
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc] via-transparent to-black/60" />
        </div>

        {/* --- PROFILE HEADER OVERLAY --- */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-30">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-12 border-b border-gray-100">
            <div className="relative group">
              <Avatar className="w-40 h-40 md:w-56 md:h-56 border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white">
                <AvatarImage src={getFileUrl(contractor.photoUrl)} alt={contractor.name} className="object-cover" />
                <AvatarFallback className="text-6xl font-black bg-orange-600 text-white">
                  {contractor.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-4 right-4 bg-green-500 w-10 h-10 rounded-full border-[6px] border-white shadow-lg" />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
                  {contractor.name}
                </h1>
                <Badge className="bg-orange-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 border-none mb-2">
                  <Star className="w-4 h-4 mr-2 fill-current" /> Premium Partner
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-bold">
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                  <Building className="w-5 h-5 text-orange-600" /> {contractor.companyName || "Professional"}
                </div>
                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                  <MapPin className="w-5 h-5 text-orange-600" /> {contractor.city}
                </div>
                <div className="flex items-center gap-2 bg-orange-50 px-5 py-2.5 rounded-2xl border border-orange-100 text-orange-700">
                  <Star className="w-5 h-5 fill-current" /> {contractor.experience || "Expert"} Experience
                </div>
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
            {/* Sidebar Column */}
            <div className="space-y-8">
              <Card className="p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border-none bg-white">
                <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Business info</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Profession</p>
                      <p className="text-xl font-bold text-gray-800">{contractor.profession}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Service Area</p>
                      <p className="text-xl font-bold text-gray-800">{contractor.city} & Surrounding</p>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-gray-50 space-y-4">
                    <Button onClick={() => handleInquiryAction()} className="w-full bg-orange-600 hover:bg-orange-700 h-16 rounded-2xl text-xl font-black shadow-2xl shadow-orange-600/30 transition-transform active:scale-95">
                      <Phone className="w-6 h-6 mr-3" /> Contact Now
                    </Button>
                    {contractor.portfolioUrl && (
                      <a href={getFileUrl(contractor.portfolioUrl)} target="_blank" rel="noreferrer" className="block w-full">
                        <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-black text-xl transition-all">
                          <Download className="w-6 h-6 mr-3" /> Get Portfolio
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                  <Star className="text-amber-400 fill-amber-400" />
                  Why Expert?
                </h3>
                <div className="space-y-6">
                  {["Top-Tier Verified", "Assured Materials", "Timely Delivery"].map((tx, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-300">{tx}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-16">
              <section>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                    <div className="w-3 h-12 bg-orange-600 rounded-full shadow-lg shadow-orange-600/20" />
                    Service Packages
                  </h2>
                </div>
                {contractor.packages && contractor.packages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {contractor.packages.map((pkg: any, idx: number) => (
                      <Card key={idx} className="relative overflow-hidden group border-none shadow-[0_15px_40px_rgba(0,0,0,0.04)] bg-white rounded-[2.5rem] flex flex-col hover:-translate-y-2 transition-all duration-500 hover:shadow-orange-600/5">
                        <div className="h-2.5 bg-orange-600" />
                        <div className="p-8 flex flex-col h-full">
                          <div className="mb-6">
                            <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-black rounded-full uppercase tracking-widest border border-orange-100 inline-block mb-3">
                              Exclusive Plan
                            </span>
                            <h4 className="text-2xl font-black text-gray-900 leading-tight">{pkg.name}</h4>
                          </div>
                          <div className="mb-8 text-center py-6 bg-[#fcfcfc] rounded-[2rem] border border-gray-50 shadow-inner">
                            <span className="text-4xl font-black text-orange-600">
                              {pkg.price.includes("₹") ? pkg.price : `₹${pkg.price}`}
                            </span>
                          </div>
                          <div className="space-y-4 mb-8 flex-grow">
                            {pkg.description.split(/[\n,;]/).map((f: string, i: number) => f.trim() && (
                              <div key={i} className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="font-bold text-sm text-gray-600">{f}</span>
                              </div>
                            ))}
                          </div>
                          <Button 
                            onClick={() => handleInquiryAction(pkg)}
                            className="h-14 rounded-2xl bg-gray-900 text-white font-black text-lg hover:bg-orange-600 shadow-2xl shadow-gray-900/10"
                          >
                            Enquire Now
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold text-2xl">No plans uploaded yet.</p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* --- WORK GALLERY (FULL WIDTH) --- */}
          <div className="mt-32">
            <h2 className="text-4xl font-black text-gray-900 mb-12 flex items-center gap-4">
              <div className="w-3 h-12 bg-orange-600 rounded-full shadow-lg" />
              Recent Works
            </h2>
            {contractor.workSamples && contractor.workSamples.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {contractor.workSamples.map((sw: any, i: number) => (
                  <div key={i} className="group relative rounded-[3rem] overflow-hidden aspect-video shadow-2xl bg-white border border-gray-50">
                    <img src={getFileUrl(sw.imageUrl)} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="Work" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                      <div className="flex items-center gap-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                        <div className="p-3 bg-orange-600 rounded-2xl shadow-xl">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Project Site</p>
                          <p className="text-2xl font-black leading-tight tracking-tight">{sw.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-24 bg-white rounded-[3rem] border border-gray-100 font-bold text-gray-400 italic">No gallery images available.</div>
            )}
          </div>
        </div>
      </main>

      {/* --- INQUIRY FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[3rem] border-none shadow-[0_30px_100px_rgba(0,0,0,0.2)]">
          <div className="bg-orange-600 p-10 text-white relative">
            <DialogHeader>
              <DialogTitle className="text-4xl font-black tracking-tighter">
                {selectedPackage ? "Plan Enquiry" : "Enquiry Form"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-orange-100 font-bold mt-2 opacity-80">
              {selectedPackage ? `Interested in: ${selectedPackage.name}` : `Contact ${contractor.name} for details`}
            </p>
            <div className="absolute top-8 right-8 cursor-pointer" onClick={() => setIsDialogOpen(false)}>
              <X className="w-8 h-8 opacity-50 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <form onSubmit={onInquirySubmit} className="p-10 space-y-8 bg-white">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Your Name</p>
              <Input placeholder="John Doe" className="h-16 px-6 rounded-2xl bg-gray-50 border-none text-lg font-bold outline-none ring-offset-0 focus-visible:ring-2 focus-visible:ring-orange-600 transition-all" required />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Phone Number</p>
              <Input placeholder="+91 999 999 9999" className="h-16 px-6 rounded-2xl bg-gray-50 border-none text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-orange-600 transition-all" required />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2">Your Message</p>
              <Textarea placeholder="How can we help you?" className="min-h-[150px] p-6 rounded-2xl bg-gray-50 border-none text-lg font-bold outline-none focus-visible:ring-2 focus-visible:ring-orange-600 transition-all" required />
            </div>
            <Button type="submit" className="w-full h-18 py-6 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white text-2xl font-black shadow-2xl shadow-orange-600/30 transition-transform active:scale-95 flex gap-4">
              Send Enquiry <Send className="w-6 h-6" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ContractorProfilePage;
