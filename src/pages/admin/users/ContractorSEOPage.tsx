import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, Search, Save, Globe, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import AdminSidebar from "@/pages/admin/AdminSidebar";

const ContractorSEOPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form state for individual project SEO
  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(null);
  const [seoForm, setSeoForm] = useState({
    title: "",
    description: "",
    keywords: "",
    h1: "",
    canonicalUrl: "",
    customLinks: [] as { label: string; url: string }[],
  });

  useEffect(() => {
    fetchContractor();
  }, [id]);

  const fetchContractor = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo") || "{}").token}`,
        },
      });
      setContractor(data);
    } catch (error) {
      toast.error("Failed to fetch contractor details");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSEO = (idx: number) => {
    const project = contractor.workSamples[idx];
    setSelectedProjectIdx(idx);
    setSeoForm({
      title: project.seo?.title || "",
      description: project.seo?.description || "",
      keywords: project.seo?.keywords?.join(", ") || "",
      h1: project.seo?.h1 || "",
      canonicalUrl: project.seo?.canonicalUrl || "",
      customLinks: project.seo?.customLinks || [],
    });
  };

  const handleAddLink = () => {
    setSeoForm({
      ...seoForm,
      customLinks: [...seoForm.customLinks, { label: "", url: "" }],
    });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...seoForm.customLinks];
    newLinks.splice(index, 1);
    setSeoForm({ ...seoForm, customLinks: newLinks });
  };

  const handleLinkChange = (index: number, field: string, value: string) => {
    const newLinks = [...seoForm.customLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSeoForm({ ...seoForm, customLinks: newLinks });
  };

  const handleUpdateSEO = async () => {
    if (selectedProjectIdx === null) return;
    try {
      setUpdating(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/contractors/${id}/seo`,
        {
          projectIdx: selectedProjectIdx,
          seo: seoForm,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo") || "{}").token}`,
          },
        }
      );
      toast.success("SEO updated successfully");
      fetchContractor();
      setSelectedProjectIdx(null);
    } catch (error) {
      toast.error("Failed to update SEO");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 lg:ml-64 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full h-12 w-12 p-0">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Project SEO Management</h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">
              {contractor.businessName || contractor.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Projects List */}
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                <Search className="w-6 h-6 text-orange-600" />
                Select Project to Edit SEO
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contractor.workSamples?.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${
                      selectedProjectIdx === idx ? "border-orange-600 bg-orange-50/30 shadow-lg" : "border-gray-100 hover:border-orange-200"
                    }`}
                    onClick={() => handleEditSEO(idx)}
                  >
                    <div className="h-40 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                      <img src={`${import.meta.env.VITE_BACKEND_URL}/${project.imageUrl}`} className="w-full h-full object-cover" alt="Project" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 mb-2 truncate">{project.title}</h3>
                    <div className="flex items-center gap-2">
                       <Globe className={`w-4 h-4 ${project.seo?.title ? "text-green-500" : "text-gray-300"}`} />
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                         {project.seo?.title ? "SEO CONFIGURED" : "NO CUSTOM SEO"}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Form */}
            {selectedProjectIdx !== null && (
              <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border-4 border-orange-600/10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <div className="flex items-center justify-between border-b pb-6">
                  <h2 className="text-2xl font-black text-gray-900">
                    SEO Configuration for: <span className="text-orange-600 italic">"{contractor.workSamples[selectedProjectIdx].title}"</span>
                  </h2>
                  <Button variant="ghost" onClick={() => setSelectedProjectIdx(null)} className="rounded-full text-gray-400">Close</Button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Meta Title</Label>
                    <Input
                      value={seoForm.title}
                      onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                      placeholder="Enter optimized title tag..."
                      className="h-14 rounded-2xl border-gray-100 focus:ring-orange-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Meta Description</Label>
                    <Textarea
                      value={seoForm.description}
                      onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                      placeholder="Enter meta description for search results..."
                      className="min-h-[120px] rounded-[2rem] border-gray-100 focus:ring-orange-600 p-6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">H1 Tag (Main Heading)</Label>
                    <Input
                      value={seoForm.h1}
                      onChange={(e) => setSeoForm({ ...seoForm, h1: e.target.value })}
                      placeholder="Enter the main H1 heading for the project page..."
                      className="h-14 rounded-2xl border-gray-100 focus:ring-orange-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Canonical URL</Label>
                    <Input
                      value={seoForm.canonicalUrl}
                      onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                      placeholder="https://houseplansfiles.com/projects/..."
                      className="h-14 rounded-2xl border-gray-100 focus:ring-orange-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Keywords (Comma separated)</Label>
                    <Input
                      value={seoForm.keywords}
                      onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                      placeholder="modern, architecture, bangalore, villa..."
                      className="h-14 rounded-2xl border-gray-100 focus:ring-orange-600"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> Internal/External Links Insertion
                      </Label>
                      <Button variant="outline" size="sm" onClick={handleAddLink} className="rounded-full gap-2 font-bold">
                        <Plus className="w-4 h-4" /> Add Link
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {seoForm.customLinks.map((link, lidx) => (
                        <div key={lidx} className="flex gap-4 items-end animate-in fade-in slide-in-from-left-2 duration-300">
                          <div className="flex-1 space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Label</span>
                            <Input
                              value={link.label}
                              onChange={(e) => handleLinkChange(lidx, "label", e.target.value)}
                              placeholder="e.g. View Similar Projects"
                              className="h-11 rounded-xl"
                            />
                          </div>
                          <div className="flex-[2] space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">URL</span>
                            <Input
                              value={link.url}
                              onChange={(e) => handleLinkChange(lidx, "url", e.target.value)}
                              placeholder="https://..."
                              className="h-11 rounded-xl"
                            />
                          </div>
                          <Button variant="ghost" onClick={() => handleRemoveLink(lidx)} className="h-11 w-11 p-0 text-red-500 rounded-xl hover:bg-red-50">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                      {seoForm.customLinks.length === 0 && (
                        <p className="text-center py-4 text-gray-400 text-sm italic font-medium">No custom links added yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleUpdateSEO}
                    disabled={updating}
                    className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-xl shadow-xl shadow-orange-600/30 gap-3"
                  >
                    {updating ? <Loader2 className="animate-spin w-6 h-6" /> : <Save className="w-6 h-6" />}
                    Save SEO Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorSEOPage;
