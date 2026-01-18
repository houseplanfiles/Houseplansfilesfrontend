import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faTelegram } from "@fortawesome/free-brands-svg-icons";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      access_key: "047f7aa7-1008-4f0e-ab62-55bea05a1449",
      subject: "New Contact Form Submission - HousePlanFiles",
      from_name: "HousePlanFiles",
    };

    try {
      const response = await axios.post(
        "https://api.web3forms.com/submit",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Message sent successfully! We will contact you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* SEO + MERCHANT SAFE METADATA */}
      <Helmet>
        <title>Contact HousePlanFiles | Digital House Plan Support</title>
        <meta
          name="description"
          content="Contact HousePlanFiles for digital house plan files, custom home designs, PDF and CAD drawings. Reach us via phone, email or WhatsApp for expert support."
        />
      </Helmet>

      <Navbar />

      <div className="bg-gray-50 text-gray-800 font-sans w-full">
        <section
          className="relative py-24 md:py-32 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage: `url(${"https://www.oswalpumps.com/images/contact-us-banner2.jpeg"})`,
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              Get In Touch
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200">
              HousePlanFiles is a professional architectural design service
              providing digital house plan files including PDF and CAD drawings.
              All products available on our website are digital downloads and no
              physical items are shipped.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
              <div className="lg:w-2/5">
                <h3 className="text-3xl font-bold mb-4">
                  Business Contact Details
                </h3>

                <p className="text-gray-600 mb-8">
                  For any queries related to house plan files, downloads,
                  customization, or support, please contact us using the details
                  below. Our team usually responds within 24 hours.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div>
                      <h4 className="font-bold">Registered Business Address</h4>
                      <p className="text-gray-600">
                        HousePlanFiles<br />
                        Bareli, Madhya Pradesh – 464668<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <a href="tel:+919755248864" className="text-gray-600">
                      +91 97552 48864
                    </a>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <a
                      href="mailto:houseplansdesignsfile@gmail.com"
                      className="text-gray-600"
                    >
                      houseplansdesignsfile@gmail.com
                    </a>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faTelegram} />
                    </div>
                    <a
                      href="https://t.me/+tPzdohVcUbJiZmNl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600"
                    >
                      Join our Telegram Channel
                    </a>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </div>
                    <a
                      href="https://wa.me/919755248864"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>

                  <p className="text-sm text-gray-500 mt-6">
                    Since we provide digital house plan files, refunds are
                    applicable only in case of incorrect or corrupted files.
                    Please review our Refund Policy and Terms of Service for more
                    details.
                  </p>
                </div>
              </div>

              <div className="lg:w-3/5">
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 mb-4 bg-gray-100 rounded-lg"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 mb-4 bg-gray-100 rounded-lg"
                    />
                    <textarea
                      name="message"
                      rows="5"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-100 rounded-lg"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <iframe
            className="w-full h-[450px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58930.5694269153!2d78.30452372167968!3d23.053896!2m3!1f0!2f0!3f0"
          ></iframe>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
