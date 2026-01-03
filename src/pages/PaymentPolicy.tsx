import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, FileText } from "lucide-react"; // FileText for policy documents

const RefundCancellationPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="py-12 text-center bg-white border-b"
        >
          <div className="container mx-auto px-4">
            <FileText className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
              Refund & Cancellation Policy
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              At HousePlanFiles.com, we strive to maintain transparency,
              fairness, and clarity in all our services.
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-lg space-y-8 prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-primary hover:prose-a:underline"
            >
              <p>
                This Refund & Cancellation Policy explains the terms applicable
                to different services offered on our platform. By using our
                website and services, you agree to the conditions mentioned
                below.
              </p>

              <h2>1. Readymade House Plans (Digital Products)</h2>
              <h3>Refund Policy</h3>
              <p>
                All readymade house plans sold on HousePlanFiles.com are digital
                products.{" "}
                <strong>
                  Once a digital product is purchased and delivered/downloaded,
                  no refund, cancellation, or exchange will be provided under
                  any circumstances.
                </strong>
              </p>
              <h3>Reasons for No Refund</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Digital products cannot be returned once accessed or
                  downloaded.
                </li>
                <li>
                  There is a risk of misuse, copying, or unauthorized
                  distribution after delivery.
                </li>
                <li>
                  The customer is advised to carefully review plan details,
                  dimensions, orientation, and sample images before purchasing.
                </li>
              </ul>
              <h4>Pros</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>Instant delivery of products.</li>
                <li>
                  Competitive pricing due to non-returnable digital nature.
                </li>
                <li>Clear and upfront purchase terms.</li>
              </ul>
              <h4>Cons</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  No refund if the plan does not meet personal preferences after
                  purchase.
                </li>
              </ul>

              <h2>2. Marketplace Products (Third-Party Sellers)</h2>
              <p>
                HousePlanFiles.com operates as a marketplace platform where
                independent architects, designers, and professionals sell their
                products and services.
              </p>
              <h3>Refund & Responsibility Policy</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  HousePlanFiles.com does not take responsibility for refunds,
                  exchanges, or fund disputes between the customer and the
                  seller.
                </li>
                <li>
                  All transactions, deliverables, timelines, and revisions are
                  governed by mutual agreement between the customer and the
                  seller.
                </li>
              </ul>
              <h3>Complaint & Seller Accountability</h3>
              <p>
                Customers may raise complaints against sellers for genuine
                issues such as non-delivery, misrepresentation, or unethical
                behavior. Based on internal investigation and complaint
                verification:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>The seller may receive a warning.</li>
                <li>
                  The seller may be temporarily suspended or permanently
                  blacklisted from the platform.
                </li>
              </ul>
              <h4>Pros</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Wide variety of designs and services from multiple
                  professionals.
                </li>
                <li>Competitive pricing and customized offerings.</li>
                <li>Platform-level monitoring for quality control.</li>
              </ul>
              <h4>Cons</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>Refunds are not directly handled by HousePlanFiles.com.</li>
                <li>
                  Resolution time may vary depending on seller cooperation.
                </li>
              </ul>

              <h2>3. City Partner / Contractor Services</h2>
              <p>
                City Partner Contractors are onboarded to receive business leads
                and project opportunities through HousePlanFiles.com.
              </p>
              <h3>Refund Eligibility</h3>
              <p>
                A refund is applicable only if all the following conditions are
                met:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  No work, project, or business lead has been provided to the
                  City Partner.
                </li>
                <li>
                  The refund request is raised within 30 days from the date of
                  payment.
                </li>
              </ul>
              <h3>Refund Amount & Timeline</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  80% of the paid amount (excluding GST) will be refunded.
                </li>
                <li>GST is non-refundable as per government regulations.</li>
                <li>
                  The refund will be processed within 30 working days from
                  approval.
                </li>
              </ul>
              <h3>Non-Refund Scenarios</h3>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  If a single lead or work opportunity is shared with the City
                  Partner, 50% of the money will be refunded.
                </li>
                <li>If 30 days have passed since the payment date.</li>
                <li>
                  If the City Partner violates platform terms or code of
                  conduct.
                </li>
              </ul>
              <h4>Pros</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>Partial refund protection for partners.</li>
                <li>
                  Fair policy balancing platform efforts and partner investment.
                </li>
                <li>Clear refund window and conditions.</li>
              </ul>
              <h4>Cons</h4>
              <ul className="list-disc space-y-2 pl-6">
                <li>GST amount is non-refundable.</li>
                <li>Partial refund once leads or work are shared.</li>
              </ul>

              <h2>4. General Terms</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  All refund decisions made by HousePlanFiles.com will be final
                  and binding.
                </li>
                <li>
                  Refunds, if approved, will be processed via the original
                  payment method.
                </li>
                <li>
                  HousePlanFiles.com reserves the right to update or modify this
                  policy at any time without prior notice.
                </li>
              </ul>

              <h2>5. Contact & Support</h2>
              <p>For refund-related queries or complaints, please contact:</p>
              <ul className="list-none pl-0">
                <li>
                  <strong>Email:</strong> houseplansdesignsfile@gmail.com
                </li>
                <li>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://www.houseplanfiles.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.houseplanfiles.com
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default RefundCancellationPolicy;
