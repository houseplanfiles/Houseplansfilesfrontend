"use client";

import React, { useState, useEffect, useMemo, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2,
  ServerCrash,
  Package,
  X,
  Send,
  MapPin,
  Store,
  ArrowLeft,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

import { RootState, AppDispatch } from "@/lib/store";
import { fetchPublicProductsBySeller } from "@/lib/features/seller/sellerProductSlice";
import {
  createInquiry,
  resetActionStatus,
} from "@/lib/features/sellerinquiries/sellerinquirySlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- 1. MODALS ---
const InquiryModal = ({ product, onClose }: { product: any; onClose: () => void }) => {
  const dispatch: AppDispatch = useDispatch();
  const { actionStatus, error } = useSelector(
    (state: RootState) => state.sellerInquiries
  );
  const { userInfo } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    message: `Hi, I saw your listing for "${product.name}" on your store. Please send me the best price.`,
  });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Inquiry Sent! Seller will contact you.");
      dispatch(resetActionStatus());
      onClose();
    }
    if (actionStatus === "failed") {
      toast.error(String(error || "Failed to send."));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, onClose]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInquiry({ ...formData, productId: product._id }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
      >
        <div className="bg-gray-900 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Contact Seller</h2>
            <p className="text-sm text-gray-400 mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" value={formData.message} onChange={handleChange} required rows={3} className="mt-1 resize-none" />
            </div>
            <Button type="submit" disabled={actionStatus === "loading"} className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12">
              {actionStatus === "loading" ? <Loader2 className="animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Send Inquiry</>}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- 2. PRODUCT CARD ---
const ProductCard = ({ product, onInquiryClick }: { product: any; onInquiryClick: (p: any) => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/marketplace/product/${product._id}`)}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full cursor-pointer"
    >
      <div className="relative h-48 sm:h-64 overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-3 left-3 bg-orange-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase z-10">
          {product.category}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-4">{product.description}</p>
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900">₹{Number(product?.price || 0).toLocaleString()}</span>
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onInquiryClick(product);
            }} 
            className="bg-gray-900 hover:bg-orange-600 text-white rounded-lg px-4 h-9"
          >
            Inquiry
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. MAIN PAGE ---
const SellerStorePage: FC = () => {
  const { sellerId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { products, status, error } = useSelector((state: RootState) => state.sellerProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (sellerId) {
      dispatch(fetchPublicProductsBySeller(sellerId));
    }
  }, [dispatch, sellerId]);

  const sellerInfo = useMemo(() => {
    if (products && Array.isArray(products) && products.length > 0 && products[0].seller) {
      return products[0].seller;
    }
    return null;
  }, [products]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <ServerCrash className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold">Failed to load store</h3>
          <p className="text-gray-500 mb-6">{String(error)}</p>
          <Button onClick={() => navigate("/marketplace")} variant="outline">Back to Marketplace</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>{sellerInfo ? `${sellerInfo.businessName}'s Store` : "Seller Store"} | Marketplace</title>
      </Helmet>
      <Navbar />

      {/* Hero / Header Section */}
      <div className="bg-gray-900 pt-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate("/marketplace")}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Marketplace
          </button>
          
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white/10">
              {sellerInfo?.photoUrl ? (
                <img src={sellerInfo.photoUrl} alt={sellerInfo.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600">
                  <Store size={48} />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
                {sellerInfo?.businessName || "Verified Seller"}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                  <MapPin size={16} className="text-orange-500" /> {sellerInfo?.city || "India"}
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                  <Package size={16} className="text-orange-500" /> {products.length} Products
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Store Collection</h2>
            <div className="text-sm text-gray-500">Showing {products.length} items</div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onInquiryClick={setSelectedProduct} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No products listed yet</h3>
              <p className="text-gray-500">Check back later for new items from this seller.</p>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <InquiryModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SellerStorePage;
