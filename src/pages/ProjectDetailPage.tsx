import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const ProjectDetailPage = () => {
  const { id, projectIdx } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <title>{project.title || "Project Detail"} | {contractor.name}</title>
        <meta name="description" content={project.description || "View details of this amazing construction project."} />
        
        {/* Open Graph Tags for WhatsApp/Facebook */}
        <meta property="og:title" content={project.title || "Elite Construction Project"} />
        <meta property="og:description" content={project.description || "Premium structural execution with modern design standards."} />
        <meta property="og:image" content={getFileUrl(project.imageUrl)} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.title || "Elite Construction Project"} />
        <meta name="twitter:description" content={project.description || "Premium structural execution with modern design standards."} />
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
                   <p className="text-gray-500 font-bold">Category: <span className="text-gray-900 uppercase">{contractor.profession}</span></p>
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
                  <p className="text-sm font-bold text-gray-400 text-center italic">Interested in similar work?</p>
                  <Button onClick={() => navigate(`/contractors/${id}`)} className="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 text-lg font-extrabold shadow-xl shadow-orange-600/30">
                     Hiring Details
                  </Button>
                  <Button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: project.title || "Elite Construction Project",
                          text: project.description || "Check out this amazing project work!",
                          url: window.location.href,
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }
                    }}
                    variant="outline" 
                    className="w-full h-16 rounded-2xl border-white/20 text-gray-900 bg-white hover:bg-white/90 font-extrabold gap-2 shadow-lg transition-all"
                  >
                    <Share2 className="w-5 h-5" /> Share Project
                  </Button>
               </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
