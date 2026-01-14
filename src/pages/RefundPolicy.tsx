// src/pages/RefundPolicyPage.jsx
// Note: It's a good practice to rename the file to something like RefundPolicyPage.jsx

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicyPage = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="font-sans">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-md">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                Refund & Cancellation Policy
              </h1>
              <p className="text-lg text-gray-600">HousePlanFiles.com</p>
            </div>

            <div className="space-y-10 text-gray-700 leading-relaxed">
              <p>
                At HousePlanFiles.com, we strive to maintain transparency,
                fairness, and clarity in all our services. This Refund &
                Cancellation Policy explains the terms applicable to different
                services offered on our platform. By using our website and
                services, you agree to the conditions mentioned below.
              </p>

              {/* Section 1: Readymade House Plans */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  1. Readymade House Plans (Digital Products)
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
                  Refund Policy
                </h3>
                <p>
                  All readymade house plans sold on HousePlanFiles.com are
                  digital products.
                </p>
                <p className="mt-2 font-medium text-red-600">
                  Once a digital product is purchased and delivered/downloaded,
                  no refund, cancellation, or exchange will be provided under
                  any circumstances.
                </p>

                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
                  Reasons for No Refund
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Digital products cannot be returned once accessed or downloaded.</li>
                  <li>There is a risk of misuse, copying, or unauthorized distribution after delivery.</li>
                  <li>The customer is advised to carefully review plan details, dimensions, orientation, and sample images before purchasing.</li>
                </ul>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h4 className="font-semibold text-green-700">Pros</h4>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>Instant delivery of products.</li>
                            <li>Competitive pricing due to non-returnable digital nature.</li>
                            <li>Clear and upfront purchase terms.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-red-700">Cons</h4>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            <li>No refund if the plan does not meet personal preferences after purchase.</li>
                        </ul>
                    </div>
                </div>
              </section>

              {/* Section 2: Marketplace Products */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  2. Marketplace Products (Third-Party Sellers)
                </h2>
                <p>
                  HousePlanFiles.com operates as a marketplace platform where
                  independent architects, designers, and professionals sell
                  their products and services.
                </p>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
                  Refund & Responsibility Policy
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>HousePlanFiles.com does not take responsibility for refunds, exchanges, or fund disputes between the customer and the seller.</li>
                  <li>All transactions, deliverables, timelines, and revisions are governed by mutual agreement between the customer and the seller.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
                  Complaint & Seller Accountability
                </h3>
                <p>
                  Customers may raise complaints against sellers for genuine
                  issues such as non-delivery, misrepresentation, or unethical
                  behavior. Based on internal investigation and complaint
                  verification:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>The seller may receive a warning.</li>
                  <li>The seller may be temporarily suspended or permanently blacklisted from the platform.</li>
                </ul>
              </section>
              
              {/* Section 3: City Partner / Contractor Services */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  3. City Partner / Contractor Services
                </h2>
                <p>
                  City Partner Contractors are onboarded to receive business leads and project opportunities through HousePlanFiles.com.
                </p>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">
                  Refund Eligibility
                </h3>
                <p>
                  A refund is applicable only if all the following conditions are met:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>No work, project, or business lead has been provided to the City Partner.</li>
                  <li>The refund request is raised within 30 days from the date of payment.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
                  Refund Amount & Timeline
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>80% of the paid amount (excluding GST) will be refunded.</li>
                  <li>GST is non-refundable as per government regulations.</li>
                  <li>The refund will be processed within 30 working days from approval.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">
                  Non-Refund Scenarios
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>If even a single lead or work opportunity is shared with the City Partner, only 50% of the amount will be refunded.</li>
                  <li>If 30 days have passed since the payment date.</li>
                  <li>If the City Partner violates platform terms or code of conduct.</li>
                </ul>
              </section>

              {/* Section 4: General Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  4. General Terms
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>All refund decisions made by HousePlanFiles.com will be final and binding.</li>
                  <li>Refunds, if approved, will be processed via the original payment method.</li>
                  <li>HousePlanFiles.com reserves the right to update or modify this policy at any time without prior notice.</li>
                </ul>
              </section>

              {/* Section 5: Contact & Support */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                  5. Contact & Support
                </h2>
                <p>
                  For refund-related queries or complaints, please contact:
                </p>
                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:houseplansdesignsfile@gmail.com"
                      className="text-orange-600 hover:underline"
                    >
                      houseplansdesignsfile@gmail.com
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a
                      href="https://www.houseplanfiles.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline"
                    >
                      www.houseplanfiles.com
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
