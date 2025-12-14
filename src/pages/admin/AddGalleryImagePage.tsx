import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  createGalleryItem,
  resetActionStatus,
} from "@/lib/features/gallery/gallerySlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, UploadCloud, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddGalleryImagePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.gallery
  );

  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("General");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [productLink, setProductLink] = useState("");

  // <<< YAHAN BADLAV KIYA GAYA HAI >>>
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Step 1: Nayi select ki hui files ko array mein lein
      const newFiles = Array.from(e.target.files);

      // Step 2: Nayi files ko purane 'images' array mein jod dein
      setImages((prevImages) => [...prevImages, ...newFiles]);

      // Step 3: Sirf nayi files ke liye previews banayein
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      // Step 4: Naye previews ko purane 'previews' array mein jod dein
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removePreview = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prev[indexToRemove]);
      return newPreviews;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0) {
      toast.error("Title and at least one image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("altText", altText || title);
    formData.append("category", category);
    if (productLink) {
      formData.append("productLink", productLink);
    }
    images.forEach((file) => {
      formData.append("images", file);
    });

    dispatch(createGalleryItem(formData));
  };

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Images uploaded to the gallery successfully!");
      dispatch(resetActionStatus());
      navigate("/admin/gallery");
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Failed to upload images.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, navigate]);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/gallery">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Add to Gallery</h1>
          </div>
          <Button type="submit" disabled={actionStatus === "loading"}>
            {actionStatus === "loading" && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Upload Images
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Image Details</CardTitle>
            <CardDescription>
              Provide details and upload one or more images for the same
              project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., 30x50 Modern Home Design"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altText">SEO Alt Text</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the main image for SEO"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="productLink">Product Link (Optional)</Label>
                <Input
                  id="productLink"
                  value={productLink}
                  onChange={(e) => setProductLink(e.target.value)}
                  placeholder="E.g., /product/modern-home-123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Exteriors">Exteriors</SelectItem>
                    <SelectItem value="Interiors">Interiors</SelectItem>
                    <SelectItem value="Projects">Projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Image Files *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-500 transition-colors">
                <Label htmlFor="images" className="cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-orange-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  <Input
                    id="images"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    required={images.length === 0}
                    accept="image/*"
                    multiple
                  />
                </Label>
              </div>
            </div>

            {previews.length > 0 && (
              <div>
                <Label>Previews ({previews.length} selected)</Label>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {previews.map((previewUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePreview(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
export default AddGalleryImagePage;
