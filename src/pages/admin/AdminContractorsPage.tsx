import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import {
  fetchUsers,
  deleteUserByAdmin,
  updateUserByAdmin,
} from "@/lib/features/users/userSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash2,
  Loader2,
  UserX,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Gem,
  Clock,
  ExternalLink,
} from "lucide-react";

const AdminContractorsPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { users, pagination, listStatus } = useSelector(
    (state: RootState) => state.user
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterType, setFilterType] = useState("Premium");
  const [currentPage, setCurrentPage] = useState(1);
  const CONTRACTORS_PER_PAGE = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [contractorType, setContractorType] = useState("Premium");
  const [premiumExpiresAt, setPremiumExpiresAt] = useState("");

  const handleFetchContractors = (page = 1) => {
    dispatch(
      fetchUsers({
        page,
        limit: CONTRACTORS_PER_PAGE,
        search: searchTerm,
        role: "Contractor",
        city: filterCity,
        contractorType: filterType,
      })
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleFetchContractors(currentPage);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, filterCity, filterType]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setContractorType(user.contractorType || "Normal");
    setPremiumExpiresAt(
      user.premiumExpiresAt
        ? new Date(user.premiumExpiresAt).toISOString().slice(0, 10)
        : ""
    );
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    
    const userData = {
      contractorType,
      premiumExpiresAt: contractorType === "Premium" && premiumExpiresAt 
        ? new Date(premiumExpiresAt).toISOString() 
        : null
    };

    try {
      await dispatch(
        updateUserByAdmin({ userId: selectedUser._id, userData })
      ).unwrap();
      toast.success("Contractor updated successfully!");
      setIsEditModalOpen(false);
      handleFetchContractors(currentPage);
    } catch (err: any) {
      toast.error(err || "Failed to update contractor");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contractor?")) {
      dispatch(deleteUserByAdmin(id))
        .unwrap()
        .then(() => {
          toast.success("Contractor removed");
          handleFetchContractors(currentPage);
        })
        .catch((err) => toast.error(err));
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    if (!expiryDate) return null;
    try {
      const expDate = new Date(expiryDate);
      if (isNaN(expDate.getTime())) return null;
      return differenceInDays(expDate, new Date());
    } catch (error) {
      return null;
    }
  };

  const filteredContractors = users.filter((u) => {
    if (filterType === "all") return true;
    return u.contractorType === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contractor Management</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor and manage all construction partners.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="relative">
          <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Search</Label>
          <Search className="absolute left-3 top-9 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Name or Email..."
            className="pl-9 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">By City</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Enter City"
              className="pl-9 font-bold"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1.5 block">Contractor Tier</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="font-bold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Premium">Premium Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleFetchContractors(1)} className="bg-gray-900 hover:bg-black text-white font-black">
          Refresh List
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {listStatus === "loading" ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading Contractors...</p>
          </div>
        ) : filteredContractors.length === 0 ? (
          <div className="p-20 text-center">
            <UserX className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="font-bold text-gray-500">No contractors found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">Contractor Details</th>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">Tier</th>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-center">Premium Expiry</th>
                  <th className="p-4 font-black text-[10px] text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredContractors.map((user) => {
                  const daysLeft = getDaysRemaining(user.premiumExpiresAt);
                  const isExpired = daysLeft !== null && daysLeft < 0;

                  return (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900">{user.name || user.companyName}</span>
                          <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                          <div className="flex items-center gap-1 mt-1 text-[10px] font-black uppercase text-blue-600">
                             <MapPin className="w-3 h-3" /> {user.city || "Unknown City"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                           user.contractorType === 'Premium' 
                             ? 'bg-orange-100 text-orange-700' 
                             : user.contractorType === 'Verified' 
                               ? 'bg-blue-100 text-blue-700' 
                               : 'bg-gray-100 text-gray-600'
                         }`}>
                           {user.contractorType || 'Normal'}
                         </span>
                      </td>
                      <td className="p-4">
                        {user.contractorType === "Premium" ? (
                          <div className="flex flex-col items-center">
                            {daysLeft !== null ? (
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-sm
                                ${isExpired ? 'bg-red-50 text-red-600 border-red-100' : 
                                  daysLeft < 7 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                <Clock className="w-4 h-4" />
                                {isExpired ? "Expired" : `${daysLeft} Days Left`}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs font-bold italic tracking-widest uppercase">No Date Set</span>
                            )}
                            {user.premiumExpiresAt && (
                               <span className="text-[10px] text-gray-400 mt-1 font-bold">Expires: {format(new Date(user.premiumExpiresAt), 'dd MMM yyyy')}</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="text-gray-200">--</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Button
                            variant="ghost"
                            size="icon"
                            title="View Public Profile"
                            onClick={() => window.open(`/contractors/${user._id}`, '_blank')}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            className="border-gray-200 hover:bg-gray-50 text-gray-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(user._id)}
                            className="border-gray-200 hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
            {pagination.totalUsers} Contractors listed
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="font-bold gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="font-bold gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Manage Contractor Tier</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Selected Contractor</Label>
              <p className="font-bold text-gray-800 text-lg">{selectedUser?.name || selectedUser?.companyName}</p>
              <p className="text-xs text-gray-500 font-medium">{selectedUser?.email}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Membership Tier</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Normal', 'Verified', 'Premium'].map((t) => (
                   <button
                    key={t}
                    onClick={() => setContractorType(t)}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all
                      ${contractorType === t ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-inner' : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                   >
                     {t === 'Premium' && <Gem className="w-3 h-3 mx-auto mb-1" />}
                     {t}
                   </button>
                ))}
              </div>
            </div>

            {contractorType === "Premium" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Premium Expiry Date</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    className="pl-10 font-bold h-12"
                    value={premiumExpiresAt}
                    onChange={(e) => setPremiumExpiresAt(e.target.value)}
                  />
                </div>
                <p className="text-[10px] font-bold text-orange-600 italic uppercase">User will automatically lose premium status after this date.</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="font-bold">Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-900 hover:bg-black text-white px-8 font-black">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContractorsPage;
