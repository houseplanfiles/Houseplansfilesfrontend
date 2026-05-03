import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import {
  updateProfile,
  resetActionStatus,
} from "@/lib/features/users/userSlice";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type FormData = {
  name: string;
  phone: string;
  profession: string;
  companyName?: string;
  city: string;
  address?: string;
  experience: string;
  qualification?: string;
  skills?: string;
  charges?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
};

const ProfilePageProf = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  // professional, architect, contractor — sab ke liye extra fields dikhao
  const isProfessional = ["professional", "architect", "contractor"].includes(userInfo?.role?.toLowerCase() || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isLoading = actionStatus === "loading";

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name || "");
      setValue("phone", userInfo.phone || "");
      setValue("profession", userInfo.profession || "");
      setValue("companyName", userInfo.companyName || "");
      setValue("city", userInfo.city || "");
      setValue("address", userInfo.address || "");
      setValue("experience", userInfo.experience || "");
      if (isProfessional) {
        setValue("qualification", userInfo.qualification || "");
        setValue("skills", Array.isArray(userInfo.skills) ? userInfo.skills.join(", ") : userInfo.skills || "");
        setValue("charges", userInfo.charges || "");
        setValue("seoTitle", userInfo.seoTitle || "");
        setValue("seoDescription", userInfo.seoDescription || "");
        setValue("seoKeywords", userInfo.seoKeywords || "");
      }
      setPhotoPreview(userInfo.photoUrl || null);
    }
  }, [userInfo, setValue, isProfessional]);

  // Update hone ke baad success/error message dikhayein
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Profile updated successfully!");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to update profile."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const dataToSubmit = new FormData();
    // Form se saara data append karein
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        dataToSubmit.append(key, value);
      }
    });
    // Agar nayi photo hai to use bhi append karein
    if (photo) {
      dataToSubmit.append("photo", photo);
    }
    dispatch(updateProfile(dataToSubmit));
  };

  if (!userInfo) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="animate-spin h-8 w-8 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Helmet>
        <title>{`${userInfo.name || "Professional"} - Profile | HousePlanFiles`}</title>
        <meta name="description" content={`${userInfo.name} is a ${userInfo.profession || "Professional"} based in ${userInfo.city || "India"}. Update your profile on HousePlanFiles.`} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
      <p className="text-gray-600">
        Update your public profile and account details.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              This information will be displayed publicly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photoPreview} alt={userInfo.name} />
                <AvatarFallback className="text-4xl">
                  {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "P"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo">Change Profile Picture</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  A high-quality picture helps you get more clients.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={userInfo.email}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed.
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  id="role"
                  disabled
                  value={userInfo.role}
                  className="capitalize"
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  {...register("companyName")}
                  placeholder="Enter your company name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>
              Describe your expertise and experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="profession">Your Profession</Label>
              <Input
                id="profession"
                {...register("profession", {
                  required: "Profession is required",
                })}
              />
              {errors.profession && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.profession.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                placeholder="Your office or contact address"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                {...register("experience", {
                  required: "Experience is required",
                })}
                placeholder="e.g., 5-10 Years"
              />
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {isProfessional && (
              <>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    {...register("qualification")}
                    placeholder="e.g., B.Arch, M.Arch"
                  />
                </div>
                <div>
                  <Label htmlFor="charges">Consultation Charges</Label>
                  <Input
                    id="charges"
                    {...register("charges")}
                    placeholder="e.g., ₹2000 per visit"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="skills">Skills / Expertise (Comma separated)</Label>
                  <Input
                    id="skills"
                    {...register("skills")}
                    placeholder="e.g., AutoCAD, 3DS Max, Revit, SketchUp"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* SEO Settings Panel */}
        <Card className="border-orange-100 shadow-orange-50/50">
          <CardHeader className="bg-orange-50/30">
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">SEO</span> Search Engine Optimization
            </CardTitle>
            <CardDescription>
              Customize how your profile appears in Google and other search engines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="seoTitle" className="text-orange-900 font-bold">Meta Title</Label>
              <Input
                id="seoTitle"
                {...register("seoTitle")}
                placeholder="e.g., Best Architect in Mumbai | Your Name"
                className="focus:ring-orange-500"
              />
              <p className="text-[11px] text-gray-500">Recommended length: 50-60 characters.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoDescription" className="text-orange-900 font-bold">Meta Description</Label>
              <Textarea
                id="seoDescription"
                {...register("seoDescription")}
                placeholder="Describe your services to people searching on Google..."
                rows={3}
                className="focus:ring-orange-500 resize-none"
              />
              <p className="text-[11px] text-gray-500">Recommended length: 150-160 characters.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seoKeywords" className="text-orange-900 font-bold">Meta Keywords (Comma separated)</Label>
              <Input
                id="seoKeywords"
                {...register("seoKeywords")}
                placeholder="e.g., modern home design, interior architect mumbai, floor plans"
                className="focus:ring-orange-500"
              />
              <p className="text-[11px] text-gray-500">Add keywords related to your profession and location.</p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="btn-primary"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Update Profile
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePageProf;
