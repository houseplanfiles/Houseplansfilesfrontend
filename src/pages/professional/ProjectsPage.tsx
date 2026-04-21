import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { updateProfile } from "@/lib/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  MapPin,
  Save,
  Briefcase,
  MoreVertical,
  Edit2,
  Search,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProjectsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, actionStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [packages, setPackages] = useState<any[]>([]);
  const [workSamples, setWorkSamples] = useState<any[]>([]);

  // Modal States
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingPackageIdx, setEditingPackageIdx] = useState<number | null>(null);
  const [editingProjectIdx, setEditingProjectIdx] = useState<number| null>(null);

  // Form states for modals
  const [tempPackage, setTempPackage] = useState({ name: "", price: "", description: "" });
  const [tempProject, setTempProject] = useState({ 
    title: "", 
    description: "", 
    location: "", 
    features: "", 
    imageFiles: [] as File[],
    imageUrl: ""
  });

  useEffect(() => {
    if (userInfo) {
      setPackages(userInfo.packages || []);
      setWorkSamples(userInfo.workSamples || []);
    }
  }, [userInfo]);

  const handleOpenPackageModal = (idx: number | null = null) => {
    if (idx !== null) {
      setEditingPackageIdx(idx);
      setTempPackage({ ...packages[idx] });
    } else {
      setEditingPackageIdx(null);
      setTempPackage({ name: "", price: "", description: "" });
    }
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = () => {
    if (!tempPackage.name) return toast.error("Package name is required");
    const updated = [...packages];
    if (editingPackageIdx !== null) {
      updated[editingPackageIdx] = tempPackage;
    } else {
      updated.push(tempPackage);
    }
    setPackages(updated);
    setIsPackageModalOpen(false);
    toast.success(editingPackageIdx !== null ? "Package updated" : "Package added");
  };

  const handleOpenProjectModal = (idx: number | null = null) => {
    if (idx !== null) {
      setEditingProjectIdx(idx);
      const proj = workSamples[idx];
      setTempProject({
        ...proj,
        features: Array.isArray(proj.features) ? proj.features.join(", ") : (proj.features || ""),
        imageFiles: []
      });
    } else {
      setEditingProjectIdx(null);
      setTempProject({ 
        title: "", 
        description: "", 
        location: "", 
        features: "", 
        imageFiles: [],
        imageUrl: ""
      });
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!tempProject.title) return toast.error("Project title is required");
    const updated = [...workSamples];
    if (editingProjectIdx !== null) {
      updated[editingProjectIdx] = tempProject;
    } else {
      updated.push(tempProject);
    }
    setWorkSamples(updated);
    setIsProjectModalOpen(false);
    toast.success(editingProjectIdx !== null ? "Project updated" : "Project added");
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
    toast.success("Package removed");
  };

  const handleRemoveWorkSample = (index: number) => {
    setWorkSamples(workSamples.filter((_, i) => i !== index));
    toast.success("Project removed");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("packages", JSON.stringify(packages));
    
    const samplesToSubmit = workSamples.map((sample, idx) => {
      const { imageFiles, ...rest } = sample;
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file: File) => {
          formData.append(`workSample_images_${idx}`, file);
        });
        return { ...rest, hasNewImages: true, newImagesCount: imageFiles.length };
      }
      return rest;
    });

    formData.append("workSamples", JSON.stringify(samplesToSubmit));

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Portfolio published successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to update projects");
    }
  };

  const isLoading = actionStatus === "loading";

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Execution Management</h1>
          <p className="mt-1 text-gray-500 font-medium">Manage your service packages and projects gallery in one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleOpenPackageModal()}
            variant="outline"
            className="border-gray-200 text-gray-700 font-bold hover:bg-gray-50 gap-2"
          >
            <Plus className="w-4 h-4" /> Add Package
          </Button>
          <Button
            onClick={() => handleOpenProjectModal()}
            className="bg-orange-600 hover:bg-orange-700 text-white font-black gap-2 shadow-lg shadow-orange-600/20"
          >
            <Plus className="w-4 h-4" /> Add New Project
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gray-900 hover:bg-black text-white font-black px-8 shadow-xl gap-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Publish Updates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Packages List View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-blue-600" /> My Service Packages
            </h2>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Package Name</TableHead>
                  <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Rate / Price</TableHead>
                  <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.length > 0 ? (
                  packages.map((pkg, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-bold text-gray-800">{pkg.name}</TableCell>
                      <TableCell className="font-black text-blue-600">{pkg.price}</TableCell>
                      <TableCell className="text-gray-500 text-sm hidden md:table-cell line-clamp-1 max-w-[300px]">{pkg.description}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => handleOpenPackageModal(idx)} className="gap-2 font-bold cursor-pointer">
                              <Edit2 className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemovePackage(idx)} className="gap-2 font-bold text-red-600 cursor-pointer hover:bg-red-50">
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-400 font-bold italic">No packages added yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Projects List View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
               <Briefcase className="w-5 h-5 text-orange-600" /> Projects Gallery
            </h2>
          </div>
          <div className="p-0">
             <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest w-24">Image</TableHead>
                    <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Project Details</TableHead>
                    <TableHead className="font-black text-gray-900 uppercase text-[10px] tracking-widest hidden md:table-cell">Location</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {workSamples.length > 0 ? (
                      workSamples.map((sample, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50/50 transition-colors">
                           <TableCell>
                              <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                 {sample.imageUrl ? (
                                   <img src={sample.imageUrl.startsWith("http") ? sample.imageUrl : `${import.meta.env.VITE_BACKEND_URL}/${sample.imageUrl}`} className="w-full h-full object-cover" alt="" />
                                 ) : (sample.imageFiles?.length > 0) ? (
                                   <img src={URL.createObjectURL(sample.imageFiles[0])} className="w-full h-full object-cover" alt="" />
                                 ) : (
                                   <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-300" /></div>
                                 )}
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex flex-col">
                                 <span className="font-bold text-gray-900">{sample.title}</span>
                                 <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{sample.features ? (Array.isArray(sample.features) ? sample.features[0] : sample.features.split(',')[0]) : 'Execution'}</span>
                              </div>
                           </TableCell>
                           <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1.5 text-gray-600 font-bold text-sm">
                                <MapPin className="w-3.5 h-3.5 text-orange-600" /> {sample.location || "N/A"}
                              </div>
                           </TableCell>
                           <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => handleOpenProjectModal(idx)} className="gap-2 font-bold cursor-pointer">
                                    <Edit2 className="w-4 h-4" /> Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRemoveWorkSample(idx)} className="gap-2 font-bold text-red-600 cursor-pointer hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                           </TableCell>
                        </TableRow>
                      ))
                   ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-gray-400 font-bold italic">No projects added yet.</TableCell>
                      </TableRow>
                   )}
                </TableBody>
             </Table>
          </div>
        </div>
      </div>

      {/* PACKAGE MODAL */}
      <Dialog open={isPackageModalOpen} onOpenChange={setIsPackageModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
               {editingPackageIdx !== null ? "Edit Package" : "Create New Package"}
            </DialogTitle>
            <DialogDescription className="font-medium text-gray-500">
               Define the details for your construction service package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Package Name</Label>
              <Input
                placeholder="e.g. Standard Construction"
                value={tempPackage.name}
                onChange={(e) => setTempPackage({ ...tempPackage, name: e.target.value })}
                className="font-bold h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Price / Rate</Label>
              <Input
                placeholder="e.g. ₹1500/sqft"
                value={tempPackage.price}
                onChange={(e) => setTempPackage({ ...tempPackage, price: e.target.value })}
                className="font-bold h-11 text-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">What's Included</Label>
              <Textarea
                placeholder="Briefly list features..."
                value={tempPackage.description}
                onChange={(e) => setTempPackage({ ...tempPackage, description: e.target.value })}
                className="min-h-[120px] font-medium"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsPackageModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleSavePackage} className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8">
               {editingPackageIdx !== null ? "Update Package" : "Add to List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PROJECT MODAL */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
               {editingProjectIdx !== null ? "Edit Project Details" : "Upload New Execution"}
            </DialogTitle>
            <DialogDescription className="font-medium text-gray-500">
               Add high-quality photos and detailed descriptions of your past work.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Project Title</Label>
              <Input
                placeholder="e.g. Modern Villa Design"
                value={tempProject.title}
                onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
                className="font-bold h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Execution Location</Label>
              <Input
                placeholder="e.g. Rohini, Delhi"
                value={tempProject.location}
                onChange={(e) => setTempProject({ ...tempProject, location: e.target.value })}
                className="font-bold h-11"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">About this Work</Label>
              <Textarea
                placeholder="Detailed description of the project scope and results..."
                value={tempProject.description}
                onChange={(e) => setTempProject({ ...tempProject, description: e.target.value })}
                className="min-h-[100px] font-medium"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Key Features (Comma separated)</Label>
              <Input
                placeholder="e.g. 5 Bedrooms, Eco-friendly, Smart Home"
                value={tempProject.features}
                onChange={(e) => setTempProject({ ...tempProject, features: e.target.value })}
                className="font-bold h-11"
              />
            </div>
            <div className="md:col-span-2 space-y-4">
               <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Upload Project Images</Label>
               <div className="flex flex-wrap gap-4">
                 <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer relative bg-white group">
                   <Plus className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
                   <input 
                     type="file" 
                     multiple 
                     accept="image/*"
                     className="absolute inset-0 opacity-0 cursor-pointer" 
                     onChange={(e) => {
                       if (e.target.files) {
                         setTempProject({
                           ...tempProject,
                           imageFiles: [...tempProject.imageFiles, ...Array.from(e.target.files)]
                         });
                       }
                     }}
                   />
                 </div>
                 {/* Preview Strip */}
                 {tempProject.imageFiles.map((file, fIdx) => (
                    <div key={fIdx} className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white relative group">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                      <div 
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity" 
                        onClick={() => {
                           const updated = [...tempProject.imageFiles];
                           updated.splice(fIdx, 1);
                           setTempProject({ ...tempProject, imageFiles: updated });
                        }}
                      >
                         <Trash2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                 ))}
                 {!tempProject.imageFiles.length && tempProject.imageUrl && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm opacity-60">
                      <img src={tempProject.imageUrl.startsWith("http") ? tempProject.imageUrl : `${import.meta.env.VITE_BACKEND_URL}/${tempProject.imageUrl}`} className="w-full h-full object-cover" alt="" />
                      <span className="absolute bottom-1 right-1 bg-white text-[8px] font-black uppercase px-1 rounded">Current</span>
                    </div>
                 )}
               </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsProjectModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleSaveProject} className="bg-orange-600 hover:bg-orange-700 text-white font-black px-10 shadow-lg shadow-orange-600/20">
               {editingProjectIdx !== null ? "Update Project" : "Add to Portfolio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
