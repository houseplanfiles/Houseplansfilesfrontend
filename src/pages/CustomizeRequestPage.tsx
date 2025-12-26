import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, Send } from "lucide-react";
import { RootState, store } from "@/lib/store";

// UI Styles Update
const formStyles = {
  label: "block text-sm font-semibold text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm",
  textarea:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px] resize-y transition-all duration-200 shadow-sm",
  fileInputWrapper:
    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 transition-colors",
  fileInputText: "text-sm text-gray-500 mt-2",
};

const CustomizeFloorPlanPage = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );
  const [formKey, setFormKey] = useState(Date.now());
  const [fileName, setFileName] = useState<string | null>(null);

  // File change handler to show selected filename
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  // Form submission handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("requestType", "Floor Plan Customization");
    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
  };

  // Effect to show success/error toasts
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success(
        "Request submitted successfully! Our team will contact you shortly."
      );
      dispatch(resetStatus());
      setFormKey(Date.now());
      setFileName(null);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "Submission failed. Please try again.");
      dispatch(resetStatus());
    }
  }, [actionStatus, error, dispatch]);

  const isLoading = actionStatus === "loading";

  return (
    <>
      <Helmet>
        <title>
          Customize Your Floor Plan | Modern Layouts & Design Options
        </title>
        <meta
          name="description"
          content="Customize your floor plan with modern layouts and flexible design options. Easily create the perfect space to fit your needs."
        />
      </Helmet>

      <Navbar />

      {/* Main Background with light gradient */}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 md:px-8">
        {/* Container centered */}
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Complete house{" "}
              <span className="text-orange-600">plan file</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Share your plot details and requirements below. Our expert
              architects will design a floor plan tailored just for you.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                {/* Grid for Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className={formStyles.label}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className={formStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={formStyles.label}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      className={formStyles.input}
                      required
                    />
                  </div>
                </div>

                {/* Grid for Phone & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="whatsappNumber"
                      className={formStyles.label}
                    >
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      placeholder="+91 98765 43210"
                      className={formStyles.input}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="countryName" className={formStyles.label}>
                      Country
                    </label>
                    <input
                      type="text"
                      id="countryName"
                      name="countryName"
                      placeholder="India"
                      className={formStyles.input}
                      required
                    />
                  </div>
                </div>

                {/* Plot Size */}
                <div>
                  <label htmlFor="plotSize" className={formStyles.label}>
                    Plot Size (Dimensions)
                  </label>
                  <input
                    type="text"
                    id="plotSize"
                    name="plotSize"
                    className={formStyles.input}
                    placeholder="e.g., 30x40 ft, 1200 sq ft"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={formStyles.label}>
                    Your Requirements & Vastu Needs
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe number of rooms, floors, kitchen style, facing direction, etc..."
                    className={formStyles.textarea}
                    rows={5}
                  ></textarea>
                </div>

                {/* File Upload - Improved UI */}
                <div>
                  <label className={formStyles.label}>
                    Upload Reference Sketch/Image (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="referenceFile"
                      id="referenceFile"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                    <div className={formStyles.fileInputWrapper}>
                      <UploadCloud className="h-8 w-8 text-orange-500 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        {fileName ? (
                          <span className="text-orange-600">{fileName}</span>
                        ) : (
                          "Click to upload or drag and drop"
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Supports Images, PDF, Sketches
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full text-lg py-6 bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Send Request <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Our team typically responds within 24 hours.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CustomizeFloorPlanPage;
