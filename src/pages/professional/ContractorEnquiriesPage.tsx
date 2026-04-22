import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { 
  Loader2, 
  Inbox, 
  Eye, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  X,
  MapPin
} from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchMyInquiries } from "@/lib/features/inquiries/inquirySlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ContractorEnquiriesPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { inquiries, listStatus, error } = useSelector((state: RootState) => state.inquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMyInquiries());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New": return <Badge className="bg-blue-100 text-blue-700">New</Badge>;
      case "Contacted": return <Badge className="bg-yellow-100 text-yellow-700">Contacted</Badge>;
      case "Closed": return <Badge className="bg-green-100 text-green-700">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (listStatus === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Enquiries...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Enquiries</h1>
           <p className="text-gray-500 font-medium">Manage leads and customer requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Inbox className="h-12 w-12 text-gray-300" />
            <p className="font-bold text-gray-500">No enquiries received yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">Received On</th>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900">{inq.senderName}</span>
                        <span className="text-xs text-gray-500">{inq.senderEmail}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600">
                      {new Date(inq.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(inq.status)}
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="font-bold border-gray-200 hover:bg-gray-100"
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
                 <h2 className="text-xl font-black uppercase tracking-tight">Enquiry Details</h2>
                 <button onClick={() => setSelectedInquiry(null)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-8 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                          <User className="w-3 h-3" /> Contact Information
                       </h3>
                       <div className="space-y-3">
                          <div className="flex items-center gap-4">
                             <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
                                <User className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Name</p>
                                <p className="font-bold text-gray-900 text-lg">{selectedInquiry.senderName}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                <Mail className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                                <p className="font-bold text-gray-900">{selectedInquiry.senderEmail}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="bg-green-100 p-2.5 rounded-xl text-green-600">
                                <Phone className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase">WhatsApp</p>
                                <p className="font-bold text-gray-900">{selectedInquiry.senderWhatsapp}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Submission Detail
                       </h3>
                       <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-gray-500">Date</span>
                             <span className="text-xs font-black text-gray-900">
                                {new Date(selectedInquiry.createdAt).toLocaleString()}
                             </span>
                          </div>
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-gray-500">Status</span>
                             {getStatusBadge(selectedInquiry.status)}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                       <MessageSquare className="w-3 h-3" /> Requirements / Message
                    </h3>
                    <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                       <p className="text-gray-700 font-medium leading-relaxed italic">
                          "{selectedInquiry.requirements}"
                       </p>
                    </div>
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <Button onClick={() => setSelectedInquiry(null)} className="rounded-xl px-8 font-black bg-gray-900 hover:bg-black">
                       Understood
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContractorEnquiriesPage;
