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
  Building2,
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
import { Helmet } from "react-helmet-async";

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

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderWhatsapp: "",
    requirements: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const onInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const inquiryData = {
        recipient: id,
        recipientInfo: {
          name: contractor.name,
          role: contractor.role,
          city: contractor.city,
          detail: selectedPackage ? `Service Plan: ${selectedPackage.name}` : "General Enquiry"
        },
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderWhatsapp: formData.senderWhatsapp,
        requirements: formData.requirements
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inquiries`, inquiryData);
      
      toast.success("Enquiry sent successfully! The contractor will contact you soon.");
      setFormData({ senderName: "", senderEmail: "", senderWhatsapp: "", requirements: "" });
      setIsDialogOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send enquiry.");
    } finally {
      setSubmitting(false);
    }
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
          <h2 className="text-3xl font-extrabold mb-4">Contractor not found</h2>
          <Button onClick={() => navigate("/city-partners")} variant="secondary">Back to Partners</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Helmet>
        <title>{contractor.seoTitle || `${contractor.name} | Expert Contractor in ${contractor.city}`}</title>
        <meta name="description" content={contractor.seoDescription || `Professional contractor with ${contractor.experience || 'Expert'} experience in ${contractor.city}. Book now for premium construction services.`} />
        {contractor.seoKeywords && <meta name="keywords" content={contractor.seoKeywords} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={contractor.seoTitle || `${contractor.name} - Professional Contractor`} />
        <meta property="og:description" content={contractor.seoDescription || `Top-rated construction expert in ${contractor.city}. Explore projects and service plans.`} />
        <meta property="og:image" content={getFileUrl(contractor.coverPhotoUrl)} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />

      <main className="pb-32">
        {/* --- HERO SECTION --- */}
        <div className="relative bg-gray-900 py-12 sm:pt-16 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={getFileUrl(contractor.coverPhotoUrl) || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80"}
              alt="Cover"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <Badge className="bg-orange-500 mb-6 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 mr-1.5 fill-current" /> Premium Partner
              </Badge>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                {contractor.name}
              </h1>
              <p className="text-gray-400 font-extrabold flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                <MapPin className="w-3 h-3 text-orange-500" /> {contractor.city} • {contractor.experience || "Expert"} Experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {/* Business Info Column */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-white shadow-2xl">
                <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3">
                  <Building className="w-6 h-6 text-orange-500" /> Business Info
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 border border-white/10">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Profession</p>
                      <p className="text-lg font-extrabold text-white uppercase">{contractor.profession}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 border border-white/10">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Service Area</p>
                      <p className="text-lg font-extrabold text-white uppercase">{contractor.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Expert Column */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-white shadow-2xl">
                <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3">
                  <Star className="w-6 h-6 text-orange-500 fill-orange-500" /> Why Expert?
                </h3>
                <div className="space-y-5">
                  {["Top-Tier Verified", "Assured Materials", "Timely Delivery"].map((tx, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                      <span className="text-base font-extrabold text-gray-100">{tx}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Column */}
              <div className="flex flex-col gap-6">
                <Button onClick={() => handleInquiryAction()} className="w-full bg-orange-600 hover:bg-orange-700 h-20 rounded-2xl text-xl font-extrabold shadow-2xl shadow-orange-600/40 text-white transition-all active:scale-95">
                  <Phone className="w-7 h-7 mr-4" /> Contact Now
                </Button>
                {contractor.portfolioUrl && (
                  <a href={getFileUrl(contractor.portfolioUrl)} target="_blank" rel="noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full h-20 rounded-2xl border-2 border-white/20 text-gray-900 bg-white/90 hover:bg-white backdrop-blur-md font-extrabold text-xl transition-all">
                      <Download className="w-7 h-7 mr-4" /> Get Portfolio
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- CONTENT SECTION BELOW BANNER --- */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* LEFT: Service Packages (3 stacked) */}
            <aside className="lg:col-span-3 space-y-8">
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-2 h-8 bg-orange-600 rounded-full" />
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Service Plans</h2>
              </div>
              {contractor.packages && contractor.packages.length > 0 ? (
                <div className="space-y-6">
                  {contractor.packages.map((pkg: any, idx: number) => (
                    <Card key={idx} className="bg-white border-2 border-gray-50 shadow-sm rounded-2xl overflow-hidden hover:border-orange-200 hover:shadow-xl transition-all p-6 group">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors uppercase leading-tight">{pkg.name}</h4>
                        <div className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                          <span className="text-orange-600 font-extrabold text-base">
                            {pkg.price.includes("₹") ? pkg.price : `₹${pkg.price}`}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-bold mb-6 line-clamp-3 leading-relaxed">{pkg.description}</p>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleInquiryAction(pkg)}
                          className="flex-grow bg-gray-900 text-white font-extrabold h-12 rounded-2xl hover:bg-orange-600 shadow-md transition-all active:scale-95"
                        >
                          Enquire Now
                        </Button>
                        {pkg.pdfUrl && (
                          <a href={getFileUrl(pkg.pdfUrl)} target="_blank" rel="noreferrer">
                            <Button
                              variant="outline"
                              size="icon"
                              title="Download Package PDF"
                              className="w-12 h-12 rounded-2xl border-2 border-gray-100 text-gray-400 hover:text-orange-600 hover:border-orange-200 transition-all"
                            >
                              <Download className="w-5 h-5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="p-10 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-200 italic font-bold text-gray-400">No packages available</div>
              )}
            </aside>

            {/* RIGHT: Recent Projects Grid */}
            <div className="lg:col-span-9 space-y-10">
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-2 h-8 bg-orange-600 rounded-full" />
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Recent Projects</h2>
              </div>
              {contractor.workSamples && contractor.workSamples.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  {contractor.workSamples.map((sw: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/contractors/${id}/project/${i}`)}
                      className="group relative bg-white rounded-3xl overflow-hidden aspect-[4/3] shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    >
                      {/* Image */}
                      <img
                        src={getFileUrl(sw.imageUrl)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={sw.title || "Project"}
                      />

                      {/* Permanent Bottom Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

                      {/* Center Decorative Icon */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
                          <Building2 className="w-7 h-7 text-blue-400 opacity-80" />
                        </div>
                      </div>

                      {/* Details on Image */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-center space-y-2">
                        <h3 className="text-xl md:text-2xl font-extrabold text-orange-500 tracking-tight uppercase line-clamp-1 leading-tight">
                          {sw.title || "Elite Project"}
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-white font-extrabold text-sm group-hover:gap-3 transition-all opacity-90">
                          Explore <span className="text-lg">→</span>
                        </div>
                      </div>

                      {/* Location Badge (Top Right) */}
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 font-bold px-4 py-1.5 rounded-full uppercase text-[10px] tracking-widest">
                          {sw.location}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 bg-white rounded-[3rem] text-center border-2 border-dashed border-gray-100 italic font-bold text-gray-400">No works showcased yet.</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- INQUIRY FORM MODAL --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
          <div className="bg-gray-900 p-8 text-white relative">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold tracking-tight">
                {selectedPackage ? "Inquiry for " + selectedPackage.name : "Send Inquiry"}
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-400 font-bold mt-2 text-sm">
              {selectedPackage ? `Get details for this plan` : `Contact ${contractor.name} for your project`}
            </p>
            <div className="absolute top-6 right-6 cursor-pointer" onClick={() => setIsDialogOpen(false)}>
              <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            </div>
          </div>

          <form onSubmit={onInquirySubmit} className="p-8 space-y-6 bg-white">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Your Name</p>
              <Input 
                placeholder="John Doe" 
                className="h-12 px-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                value={formData.senderName}
                onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Email Address</p>
                <Input 
                  type="email"
                  placeholder="john@example.com" 
                  className="h-12 px-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">WhatsApp Number</p>
                <Input 
                  placeholder="9998887776" 
                  className="h-12 px-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                  value={formData.senderWhatsapp}
                  onChange={(e) => setFormData({...formData, senderWhatsapp: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Your Message</p>
              <Textarea 
                placeholder="How can we help you?" 
                className="min-h-[120px] p-4 rounded-xl bg-gray-50 border-gray-200 text-base font-bold" 
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                required 
              />
            </div>
            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-14 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-lg font-extrabold shadow-md flex gap-2"
            >
              {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : <>Send Inquiry <Send className="w-5 h-5" /></>}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ContractorProfilePage;
