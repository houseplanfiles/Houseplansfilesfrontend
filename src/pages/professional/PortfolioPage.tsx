import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { updateProfile } from "@/lib/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Image as ImageIcon,
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

  useEffect(() => {
    if (userInfo) {
      if (userInfo.coverPhotoUrl) setCoverPhotoPreview(userInfo.coverPhotoUrl);
    }
  }, [userInfo]);

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

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Identity updated successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to update identity");
    }
  };

  const isLoading = actionStatus === "loading";

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Brand Identity</h1>
        <p className="mt-1 text-gray-600">
          Manage your professional cover photo and shareable portfolio PDF.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Cover Photo Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-500" /> Cover Photo
          </h2>
          <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group">
            {coverPhotoPreview ? (
              <img
                src={coverPhotoPreview}
                alt="Cover Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-bold uppercase">Click to upload brand cover</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-xs font-black uppercase shadow-xl tracking-tighter">Change Cover</span>
            </div>
            <input
              type="file"
              id="coverPhoto"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
            Recommended size: 1200x400. Professional covers attract more inquiries.
          </p>
        </section>

        {/* Portfolio PDF Section */}
        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" /> Professional Brochure (PDF)
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <Input
                type="file"
                id="portfolioPdf"
                accept=".pdf"
                className="font-bold text-gray-600 bg-gray-50 border-dashed"
                onChange={handleFileChange}
              />
            </div>
            {userInfo?.portfolioUrl && (
              <a
                href={userInfo.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-orange-50 text-orange-600 px-4 h-10 flex items-center rounded-lg border border-orange-200 text-xs font-black uppercase tracking-widest hover:bg-orange-100 transition-colors"
              >
                View PDF
              </a>
            )}
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Upload your detailed company brochure in PDF format.
          </p>
        </section>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 h-14 px-10 text-lg font-black shadow-xl shadow-orange-600/20 gap-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isLoading ? "Saving..." : "Save Identity"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioPage;
