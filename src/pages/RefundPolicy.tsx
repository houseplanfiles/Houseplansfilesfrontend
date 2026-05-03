import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, FileText, UserCheck, Clock, AlertTriangle, Mail } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80" 
              alt="bg" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold mb-4"
            >
              Refund Policy
            </motion.h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Everything you need to know about our refund terms for digital products and services.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-12">
              
              {/* Introduction */}
              <div className="border-b pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy – HousePlanFiles.com</h2>
                <p className="text-gray-600 leading-relaxed">
                  By purchasing any service from HousePlanFiles.com, the customer agrees to this Refund Policy and acknowledges the nature of digital and customized design services.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">1. Readymade Home Design / PDF Plan Services</h3>
                </div>
                <div className="pl-11 space-y-4">
                  <h4 className="font-bold text-gray-800 underline">Digital Product Policy</h4>
                  <p className="text-gray-600">All readymade house plans, PDFs, CAD drawings, elevations, and digital design files sold on our platform are classified as digital downloadable products.</p>
                  
                  <h4 className="font-bold text-gray-800 underline">Refund Eligibility</h4>
                  <p className="text-gray-600 font-medium">Refunds are generally not applicable once:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>The design file has been delivered</li>
                    <li>Download access has been provided</li>
                    <li>The customer has received the plan through email, WhatsApp, or dashboard access</li>
                  </ul>

                  <h4 className="font-bold text-gray-800 underline">Refund May Be Considered If:</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Wrong file/design was delivered</li>
                    <li>Purchased file is corrupted or inaccessible</li>
                    <li>Duplicate payment was made</li>
                    <li>Technical issue prevented delivery</li>
                  </ul>

                  <h4 className="font-bold text-gray-800 underline">Non-Refundable Situations</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Change of mind after purchase</li>
                    <li>Municipal approval rejection due to local bylaws</li>
                    <li>Personal preference dissatisfaction after delivery</li>
                    <li>Construction cost differences</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">2. Customized Home Design Services</h3>
                </div>
                <div className="pl-11 space-y-4">
                  <p className="text-gray-600">Customized services include floor plan customization, elevation modification, structural consultation, and complete custom home designing.</p>
                  
                  <h4 className="font-bold text-gray-800 underline">Advance Payment Policy</h4>
                  <p className="text-gray-600">Customized services require advance payment before work begins.</p>
                  
                  <h4 className="font-bold text-gray-800 underline">Refund Terms</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li><strong>Before work starts:</strong> Partial or full refund may be approved after deduction of consultation charges.</li>
                    <li><strong>After concept/design work has started:</strong> Advance payment becomes non-refundable.</li>
                    <li><strong>After final drawing/design delivery:</strong> No refund applicable.</li>
                  </ul>

                  <h4 className="font-bold text-gray-800 underline">Cancellation Policy</h4>
                  <p className="text-gray-600">If the client cancels the project after drafting or revisions have started, completed work charges will be deducted.</p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">3. Professional Listing Services</h3>
                </div>
                <div className="pl-11 space-y-4">
                  <p className="text-gray-600">Listing services include profiles for Architects, Contractors, Site Engineers, Builders, Interior Designers, and Material Shops.</p>
                  
                  <h4 className="font-bold text-gray-800 underline">Refund Eligibility</h4>
                  <p className="text-gray-600 font-medium">Refunds are generally not applicable once:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Listing/profile has been published</li>
                    <li>Promotional activity has started</li>
                    <li>Leads or visibility services have been activated</li>
                  </ul>

                  <h4 className="font-bold text-gray-800 underline">Refund May Be Considered If:</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Duplicate payment occurred</li>
                    <li>Listing could not be activated due to technical error from our side</li>
                    <li>Service was not initiated within committed timeline</li>
                  </ul>

                  <h4 className="font-bold text-gray-800 underline">Non-Refundable Cases</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Low business inquiries or lead conversion</li>
                    <li>Temporary market slowdown</li>
                    <li>Suspension due to policy violation</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 & 5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold">4. Processing Time</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Approved refunds are usually processed within 5–10 business days through the original payment method, bank transfer, or UPI.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold">5. Chargeback & Dispute</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Customers are encouraged to contact our support team before initiating any dispute. Fraudulent chargebacks may result in account suspension.</p>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gray-900 rounded-xl p-8 text-white text-center">
                <Mail className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">6. Contact Support</h3>
                <p className="text-gray-400 mb-6">HousePlanFiles.com Support Team</p>
                <div className="space-y-2 text-sm">
                  <p>Website: <a href="https://www.houseplanfiles.com" className="text-orange-400 hover:underline">www.houseplanfiles.com</a></p>
                  <p>Email: <a href="mailto:support@houseplanfiles.com" className="text-orange-400 hover:underline">support@houseplanfiles.com</a></p>
                  <p className="font-bold text-orange-500 mt-4">WhatsApp Support Available</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
