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
  FileText,
} from "lucide-react";

const PortfolioPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, actionStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>("");
  const [portfolioPdf, setPortfolioPdf] = useState<File | null>(null);

  const [packages, setPackages] = useState<any[]>([]);
  const [workSamples, setWorkSamples] = useState<any[]>([]);

  useEffect(() => {
    if (userInfo) {
      setPackages(userInfo.packages || []);
      setWorkSamples(userInfo.workSamples || []);
      if (userInfo.coverPhotoUrl) setCoverPhotoPreview(userInfo.coverPhotoUrl);
    }
  }, [userInfo]);

  const handleAddPackage = () => {
    setPackages([...packages, { name: "", price: "", description: "" }]);
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const updated = [...packages];
    updated[index][field] = value;
    setPackages(updated);
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleAddWorkSample = () => {
    setWorkSamples([...workSamples, { 
      title: "", 
      description: "", 
      location: "", 
      images: [], 
      features: "", // Comma separated for simplicity if needed
      imageFiles: [] // Temporary storage for newly selected files
    }]);
  };

  const handleWorkSampleChange = (index: number, field: string, value: any) => {
    const updated = [...workSamples];
    updated[index][field] = value;
    setWorkSamples(updated);
  };

  const handleAddWorkSampleImage = (index: number, files: FileList | null) => {
    if (!files) return;
    const updated = [...workSamples];
    const newFiles = Array.from(files);
    updated[index].imageFiles = [...(updated[index].imageFiles || []), ...newFiles];
    setWorkSamples(updated);
    toast.info(`${newFiles.length} image(s) added to Sample #${index + 1}`);
  };

  const handleRemoveWorkSample = (index: number) => {
    setWorkSamples(workSamples.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (e.target.id === "coverPhoto") {
        setCoverPhoto(file);
        setCoverPhotoPreview(URL.createObjectURL(file));
      } else if (e.target.id === "portfolioPdf") {
        setPortfolioPdf(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (coverPhoto) formData.append("coverPhoto", coverPhoto);
    if (portfolioPdf) formData.append("portfolio", portfolioPdf);

    formData.append("packages", JSON.stringify(packages));
    
    // Prepare work samples: mark which ones have new images
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
      toast.success("Portfolio updated successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to update portfolio");
    }
  };

  const isLoading = actionStatus === "loading";

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Portfolio</h1>
        <p className="mt-1 text-gray-600">
          Manage your showcase gallery, packages, and cover photo for your
          premium profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Cover Photo Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-500" /> Cover Photo
          </h2>
          <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
            {coverPhotoPreview ? (
              <img
                src={coverPhotoPreview}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No cover photo uploaded</p>
              </div>
            )}
            <input
              type="file"
              id="coverPhoto"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <p className="text-xs text-gray-500 italic">
            Recommended size: 1200x400. Click on the area above to upload.
          </p>
        </section>

        {/* Portfolio PDF Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" /> Portfolio (PDF)
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                type="file"
                id="portfolioPdf"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
            {userInfo?.portfolioUrl && (
              <a
                href={userInfo.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="text-orange-600 hover:underline text-sm font-medium"
              >
                View Current Portfolio
              </a>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Upload your professional profile in PDF format for clients to
            download.
          </p>
        </section>

        {/* Packages Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Service Packages</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPackage}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Package
            </Button>
          </div>

          <div className="space-y-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-gray-50 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemovePackage(index)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Package Name</Label>
                    <Input
                      placeholder="e.g. Standard Construction"
                      value={pkg.name}
                      onChange={(e) =>
                        handlePackageChange(index, "name", e.target.value)
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (e.g. ₹1500/sqft)</Label>
                    <Input
                      placeholder="e.g. ₹1500/sqft"
                      value={pkg.price}
                      onChange={(e) =>
                        handlePackageChange(index, "price", e.target.value)
                      }
                      className="bg-white"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>Description (Features)</Label>
                    <Textarea
                      placeholder="List of what's included..."
                      value={pkg.description}
                      onChange={(e) =>
                        handlePackageChange(index, "description", e.target.value)
                      }
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
            {packages.length === 0 && (
              <p className="text-center text-gray-500 py-4 italic">
                No packages added yet.
              </p>
            )}
          </div>
        </section>

        {/* Work Samples Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Work Gallery</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddWorkSample}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Work Sample
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {workSamples.map((sample, index) => (
              <div key={index} className="p-6 border rounded-xl bg-gray-50 space-y-6 relative group border-gray-200">
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <span className="text-base font-extrabold text-orange-600">Project Sample #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWorkSample(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Project Title</Label>
                    <Input
                      placeholder="e.g. Modern Villa Design"
                      value={sample.title || ""}
                      onChange={(e) => handleWorkSampleChange(index, "title", e.target.value)}
                      className="bg-white border-gray-200 h-11 px-4 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1 font-bold">
                      <MapPin className="w-4 h-4 text-orange-500" /> Location
                    </Label>
                    <Input
                      placeholder="e.g. Rohini, Delhi"
                      value={sample.location}
                      onChange={(e) => handleWorkSampleChange(index, "location", e.target.value)}
                      className="bg-white border-gray-200 h-11 px-4 font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold">Project Description</Label>
                    <Textarea
                      placeholder="Tell clients about this project..."
                      value={sample.description || ""}
                      onChange={(e) => handleWorkSampleChange(index, "description", e.target.value)}
                      className="bg-white border-gray-200 min-h-[100px] p-4 font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold">Features (Comma separated)</Label>
                    <Input
                      placeholder="e.g. 5 Bedrooms, Eco-friendly, Smart Home"
                      value={Array.isArray(sample.features) ? sample.features.join(", ") : (sample.features || "")}
                      onChange={(e) => handleWorkSampleChange(index, "features", e.target.value)}
                      className="bg-white border-gray-200 h-11 px-4 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-bold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" /> Upload Project Images (Multiple)
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-all cursor-pointer relative bg-white">
                      <Plus className="w-6 h-6 text-gray-400" />
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => handleAddWorkSampleImage(index, e.target.files)}
                      />
                    </div>
                    {/* Previews or existing images */}
                    {sample.imageFiles?.map((file: File, fIdx: number) => (
                      <div key={fIdx} className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white relative group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 className="w-5 h-5 text-white cursor-pointer" onClick={() => {
                            const updated = [...workSamples];
                            updated[index].imageFiles.splice(fIdx, 1);
                            setWorkSamples(updated);
                          }} />
                        </div>
                      </div>
                    ))}
                    {!sample.imageFiles?.length && sample.imageUrl && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
                        <img src={sample.imageUrl} className="w-full h-full object-cover" alt="Current" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {workSamples.length === 0 && (
              <p className="text-center text-gray-500 py-4 italic col-span-2">
                No work samples added yet.
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500 italic">
            Tip: Use high quality images of your completed projects to attract more clients.
          </p>
        </section>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 h-12 px-8 text-lg font-bold shadow-lg shadow-orange-600/20"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Portfolio
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioPage;
