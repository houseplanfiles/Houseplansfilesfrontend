import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Globe, User, MapPin, Loader2, Image as ImageIcon } from "lucide-react";

const ContractorProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { userInfo } = useSelector((state: RootState) => state.user);

  // SEO Modal States
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: "",
  });
  const [savingSeo, setSavingSeo] = useState(false);

  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/admin/contractor-projects`,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch contractor projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const handleOpenSeoModal = (project: any) => {
    setSelectedProject(project);
    setSeoData({
      title: project.seo?.title || "",
      description: project.seo?.description || "",
      keywords: Array.isArray(project.seo?.keywords)
        ? project.seo.keywords.join(", ")
        : "",
    });
    setIsSeoModalOpen(true);
  };

  const handleUpdateSeo = async () => {
    if (!selectedProject) return;

    try {
      setSavingSeo(true);
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/contractors/${selectedProject.contractorId}/seo`,
        {
          projectIdx: selectedProject.projectIndex,
          seo: seoData,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );
      toast.success("SEO tags updated successfully");
      setIsSeoModalOpen(false);
      fetchAllProjects(); // Refresh to show updated data
    } catch (error) {
      toast.error("Failed to update SEO tags");
    } finally {
      setSavingSeo(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.contractorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contractor Projects</h1>
          <p className="text-gray-500 font-medium mt-1">Manage SEO and visibility for all contractor execution works.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by project, contractor or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
             <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
             <p className="font-bold animate-pulse">Loading all contractor projects...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest w-24">Preview</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Project Title</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Contractor</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Location</TableHead>
                <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">SEO Status</TableHead>
                <TableHead className="text-right font-black text-gray-900 uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                         {project.images?.[0] || project.imageUrl ? (
                           <img 
                            src={(project.images?.[0] || project.imageUrl).startsWith("http") ? (project.images?.[0] || project.imageUrl) : `${import.meta.env.VITE_BACKEND_URL}/${project.images?.[0] || project.imageUrl}`} 
                            className="w-full h-full object-cover" 
                            alt="" 
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-300" /></div>
                         )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{project.title}</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">idx: #{project.projectIndex}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <User className="w-4 h-4 text-blue-500" /> {project.contractorName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                        <MapPin className="w-3.5 h-3.5 text-orange-500" /> {project.location || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                       {project.seo?.title ? (
                         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-tighter border border-green-100">Configured</span>
                       ) : (
                         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase tracking-tighter border border-yellow-100">Missing SEO</span>
                       )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenSeoModal(project)}
                        className="font-bold border-gray-200 hover:border-orange-500 hover:text-orange-600 gap-2"
                      >
                        <Globe className="w-4 h-4" /> Manage SEO
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-gray-400 font-bold italic border-b-0">
                    No contractor projects found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* SEO MODAL */}
      <Dialog open={isSeoModalOpen} onOpenChange={setIsSeoModalOpen}>
        <DialogContent className="max-w-xl z-[1001]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Configure Project SEO</DialogTitle>
            <DialogDescription className="font-medium text-gray-500">
              Set custom metadata for <span className="font-bold text-orange-600">{selectedProject?.title}</span> by {selectedProject?.contractorName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">SEO Meta Title</Label>
              <Input
                placeholder="Unique browser title..."
                value={seoData.title}
                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                className="font-bold h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">SEO Meta Description</Label>
              <Textarea
                placeholder="Write a compelling search snippet..."
                value={seoData.description}
                onChange={(e) =>
                  setSeoData({ ...seoData, description: e.target.value })
                }
                className="min-h-[100px] font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Keywords (Comma separated)</Label>
              <Input
                placeholder="e.g. Modern Villa, Luxury Home, Construction Delhi"
                value={seoData.keywords}
                onChange={(e) =>
                  setSeoData({ ...seoData, keywords: e.target.value })
                }
                className="font-bold h-11"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsSeoModalOpen(false)} className="font-bold">Cancel</Button>
            <Button
              onClick={handleUpdateSeo}
              disabled={savingSeo}
              className="bg-gray-900 hover:bg-black text-white font-black px-10 shadow-lg"
            >
              {savingSeo ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save SEO Tags"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractorProjectsPage;
