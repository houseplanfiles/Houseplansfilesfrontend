import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/lib/store";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import {
  submitCustomizationRequest,
  resetStatus,
} from "@/lib/features/customization/customizationSlice";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, Send, Home, Layers } from "lucide-react";

// Modern UI Styles
const formStyles = {
  label: "block text-sm font-semibold text-gray-700 mb-2",
  input:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm",
  select:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm appearance-none",
  textarea:
    "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-h-[120px] resize-y transition-all duration-200 shadow-sm",
  fileInputWrapper:
    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 transition-colors",
  radioGroup:
    "flex items-center space-x-6 bg-gray-50 p-3 rounded-lg border border-gray-200",
  radioLabel: "flex items-center cursor-pointer text-gray-700 font-medium",
  radioInput:
    "w-5 h-5 text-orange-600 border-gray-300 focus:ring-orange-500 mr-2",
};

const ThreeDElevationPage: React.FC = () => {
  const dispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.customization
  );

  const [formKey, setFormKey] = useState<number>(Date.now());
  const [fileName, setFileName] = useState<string | null>(null);

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Request type remains consistent
    formData.append("requestType", "3D Elevation");
    (dispatch as typeof store.dispatch)(submitCustomizationRequest(formData));
  };

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
        <title>Get 3D Elevation + Floor Plan | Modern Home Designs</title>
        <meta
          name="description"
          content="Design your dream home with customizable floor plans and stunning 3D elevations. Explore modern design options tailored to your needs."
        />
      </Helmet>

      <Navbar />

      {/* Main Background */}
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 md:px-8">
        {/* Centered Container */}
        <div className="max-w-3xl mx-auto">
          {/* Updated Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Get Your Floor Plans{" "}
              <span className="text-orange-600">+ 3D Elevation</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Visualize your dream home with our expert architectural designs.
              Fill in the details below to get started.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10">
              <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Name & Email */}
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

                {/* Row 2: Phone & Country */}
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
                      defaultValue="India"
                      className={formStyles.input}
                      required
                    />
                  </div>
                </div>

                {/* Row 3: Floor Plan Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="planForFloor" className={formStyles.label}>
                      <Layers className="w-4 h-4 inline mr-1 text-orange-500" />{" "}
                      Plan for Floor
                    </label>
                    <div className="relative">
                      <select
                        id="planForFloor"
                        name="planForFloor"
                        className={formStyles.select}
                      >
                        <option value="G">Ground Floor (G)</option>
                        <option value="G+1">G + 1 Floor</option>
                        <option value="G+2">G + 2 Floors</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={formStyles.label}>
                      <Home className="w-4 h-4 inline mr-1 text-orange-500" />{" "}
                      Elevation Type
                    </label>
                    <div className={formStyles.radioGroup}>
                      <label className={formStyles.radioLabel}>
                        <input
                          type="radio"
                          name="elevationType"
                          value="Front"
                          defaultChecked
                          className={formStyles.radioInput}
                        />
                        Front View
                      </label>
                      <label className={formStyles.radioLabel}>
                        <input
                          type="radio"
                          name="elevationType"
                          value="Corner"
                          className={formStyles.radioInput}
                        />
                        Corner View
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={formStyles.label}>
                    Description / Requirements
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Tell us about your style preference (Modern, Classical, etc.) and specific requirements..."
                    className={formStyles.textarea}
                  ></textarea>
                </div>

                {/* File Upload - Modern UI */}
                <div>
                  <label className={formStyles.label}>
                    Upload Reference (Image or PDF)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="referenceFile"
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
                        Supports: Images, PDF, Sketches
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
                        Get My Design <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
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

export default ThreeDElevationPage;
