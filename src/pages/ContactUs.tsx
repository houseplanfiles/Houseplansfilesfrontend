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
      subject: "New Contact Form Submission from Your Website",
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
        toast.success("Message sent successfully! We will get back to you soon.");
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
      <Helmet>
        <title>contact details of house plan files</title>
        <meta
          name="description"
          content="Get in touch with HousePlanFiles for readymade house plans, custom designs, construction services, and consultation."
        />
      </Helmet>

      <Navbar />

      <div className="bg-gray-50 text-gray-800 w-full">
        {/* HERO */}
        <section
          className="relative py-24 md:py-32 text-center text-white bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://www.oswalpumps.com/images/contact-us-banner2.jpeg)",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold">
              Get In Touch
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200">
              We're here to help you build your dream home.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">

              {/* LEFT */}
              <div className="lg:w-2/5">
                <h3 className="text-3xl font-bold mb-4">Contact Information</h3>

                <div className="space-y-8 mt-8">
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <p>
                      Bareli, Madhya Pradesh<br />464668, India
                    </p>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <a href="tel:+919755248864">+91 97552 48864</a>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <a href="mailto:houseplansdesignsfile@gmail.com">
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
                      rel="noreferrer"
                    >
                      Join our Telegram
                    </a>
                  </div>

                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </div>
                    <a href="#">Follow us on WhatsApp</a>
                  </div>
                </div>
              </div>

              {/* FORM */}
              <div className="lg:w-3/5 w-full">
                <div className="bg-white p-8 rounded-xl shadow-2xl">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 mb-4 bg-gray-100 rounded-lg"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 mb-4 bg-gray-100 rounded-lg"
                    />

                    <textarea
                      name="message"
                      rows="5"
                      placeholder="Your Message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-100 rounded-lg"
                    />

                    <button
                      disabled={loading}
                      className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ OLD SIMPLE GOOGLE MAP (WORKING EVERYWHERE) */}
        <section>
          <iframe
            title="Bareli Map"
            src="https://maps.google.com/maps?q=Bareli%20Madhya%20Pradesh%20464668&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[450px] border-0"
            loading="lazy"
          ></iframe>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default ContactUs;
