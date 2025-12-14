import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  fetchUsers,
  deleteUserByAdmin,
  updateUserByAdmin,
  resetActionStatus,
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  UserX,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Search,
  FileText,
  MapPin,
  CreditCard,
} from "lucide-react";

const professionalSubRoles = [
  "Architect",
  "Junior Architect",
  "Civil Structural Engineer",
  "Civil Design Engineer",
  "Interior Designer",
  "Contractor",
  "Vastu Consultant",
  "Site Engineer",
];

const getRoleClass = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-700";
    case "professional":
      return "bg-blue-100 text-blue-700";
    case "seller":
      return "bg-green-100 text-green-700";
    case "Contractor":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AllUsersPage = () => {
  const dispatch: AppDispatch = useDispatch();

  const { users, pagination, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.user
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("");

  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [profession, setProfession] = useState("");
  const [contractorType, setContractorType] = useState("Normal");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const USERS_PER_PAGE = 10;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleFetchUsers = (page = 1) => {
    dispatch(
      fetchUsers({
        page,
        limit: USERS_PER_PAGE,
        search: searchTerm,
        role: filterRole === "all" ? "" : filterRole,
        status: filterStatus === "all" ? "" : filterStatus,
        city: filterCity,
      })
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleFetchUsers(currentPage);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm, filterRole, filterStatus, filterCity]);

  useEffect(() => {
    if (actionStatus === "succeeded" && error) {
      toast.error(String(error));
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  // --- Fix: Populate Edit Modal with correct flat fields ---
  useEffect(() => {
    if (selectedUser && isEditModalOpen) {
      reset({
        name:
          selectedUser.name ||
          selectedUser.businessName ||
          selectedUser.companyName,
        email: selectedUser.email,
        phone: selectedUser.phone,
        city: selectedUser.city,
        upiId: selectedUser.upiId, // Flat field
        bankName: selectedUser.bankName, // Flat field
        bankAccountNumber: selectedUser.bankAccountNumber, // Flat field
        ifscCode: selectedUser.ifscCode, // Flat field
      });
      setRole(selectedUser.role || "");
      setStatus(selectedUser.status || "");
      setContractorType(selectedUser.contractorType || "Normal");
      if (selectedUser.role === "professional") {
        setProfession(selectedUser.profession || "");
      } else {
        setProfession("");
      }
    }
  }, [selectedUser, reset, isEditModalOpen]);

  // --- Fix: CSV Export Logic for flat fields ---
  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "City",
      "Role",
      "Profession",
      "Contractor Type",
      "Status",
      "UPI ID",
      "Bank Name",
      "Account No",
      "IFSC Code",
      "Registered Date",
    ];

    const csvRows = [
      headers.join(","),
      ...users.map((user) => {
        const name =
          user.name || user.businessName || user.companyName || "N/A";
        const professionVal =
          user.role === "professional" ? user.profession : "N/A";
        const contractorVal =
          user.role === "Contractor" ? user.contractorType : "N/A";
        const date = user.createdAt
          ? format(new Date(user.createdAt), "yyyy-MM-dd")
          : "";
        const safeName = `"${name.replace(/"/g, '""')}"`;
        const safeCity = user.city ? `"${user.city}"` : "N/A";

        // Access flat fields directly
        const upi = user.upiId || "N/A";
        const bankName = user.bankName || "N/A";
        const accNo = user.bankAccountNumber
          ? `"${user.bankAccountNumber}"`
          : "N/A";
        const ifsc = user.ifscCode || "N/A";

        return [
          user._id,
          safeName,
          user.email,
          user.phone || "",
          safeCity,
          user.role,
          professionVal,
          contractorVal,
          user.status,
          upi,
          bankName,
          accNo,
          ifsc,
          date,
        ].join(",");
      }),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserByAdmin(userId))
        .unwrap()
        .then(() => {
          toast.success("User deleted successfully!");
          handleFetchUsers(currentPage);
        })
        .catch((err) => {
          toast.error(String(err) || "Failed to delete user");
        });
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
      reset();
    }, 200);
  };

  // --- Fix: onSubmit sends flat fields ---
  const onSubmit = async (data: any) => {
    if (!selectedUser) return;
    setIsSubmitting(true);

    const userData: any = {
      ...data,
      role,
      status,
      // Pass flat fields directly
      bankName: data.bankName,
      bankAccountNumber: data.bankAccountNumber, // Note: input name in form is 'accountNumber' below? let's match it.
      ifscCode: data.ifscCode,
      upiId: data.upiId,
    };

    // Ensure form field names match what we are assigning above
    // In form below I named inputs: bankName, bankAccountNumber, ifscCode

    if (status === "Approved") {
      userData.isApproved = true;
    } else {
      userData.isApproved = false;
    }

    if (role === "professional") {
      userData.profession = profession;
    }

    if (role === "Contractor") {
      userData.contractorType = contractorType;
    }

    try {
      await dispatch(
        updateUserByAdmin({ userId: selectedUser._id, userData })
      ).unwrap();
      toast.success("User updated successfully!");
      setIsEditModalOpen(false);
      setTimeout(() => {
        setSelectedUser(null);
        reset();
        setIsSubmitting(false);
      }, 200);
      setTimeout(() => {
        handleFetchUsers(currentPage);
      }, 300);
    } catch (err: any) {
      setIsSubmitting(false);
      toast.error(String(err) || "Failed to update user.");
    }
  };

  const needsApproval =
    role === "professional" || role === "seller" || role === "Contractor";

  const showLoading =
    listStatus === "loading" && (!users || users.length === 0);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            All Users Management
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50"
              onClick={handleExportCSV}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Link to="/admin/users/add">
              <Button className="btn-primary flex items-center gap-2">
                <PlusCircle size={18} /> Add User
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters Section (Same as before) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="relative col-span-1 md:col-span-2">
            <Label className="text-xs mb-1 block text-gray-500">Search</Label>
            <Search className="absolute left-3 top-8 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Name, Email..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <Label className="text-xs mb-1 block text-gray-500">
              Filter by City
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Enter City"
                className="pl-9"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              />
            </div>
          </div>
          <div className="col-span-1">
            <Label className="text-xs mb-1 block text-gray-500">
              Filter by Role
            </Label>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="Contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label className="text-xs mb-1 block text-gray-500">
              Filter by Status
            </Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {showLoading ? (
            <div className="p-12 text-center text-gray-500 flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Users...
            </div>
          ) : !users || users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <UserX className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No users found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setFilterRole("all");
                  setFilterStatus("all");
                  setFilterCity("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Name
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      City
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Role
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Bank & UPI
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Doc
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Details
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">
                          {user.name || user.businessName || user.companyName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{user.city || "-"}</td>
                      <td className="p-4">
                        <span
                          className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* --- Fix: Table Cell for Bank Details (Use flat fields) --- */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1 text-xs">
                          {user.upiId ? (
                            <div className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded w-fit">
                              UPI: {user.upiId}
                            </div>
                          ) : (
                            <div className="text-gray-400">No UPI</div>
                          )}

                          {user.bankAccountNumber ? (
                            <div className="mt-1 text-gray-600 border-l-2 border-gray-300 pl-2">
                              <div className="font-medium">
                                {user.bankName || "Bank Name N/A"}
                              </div>
                              <div>Ac: {user.bankAccountNumber}</div>
                              <div>IFSC: {user.ifscCode}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 mt-1 block">
                              No Bank Details
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        {user.businessCertificationUrl ? (
                          <a
                            href={user.businessCertificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                            title="View Qualification/Certificate"
                          >
                            <FileText className="w-4 h-4" /> View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {user.role === "professional" && user.profession}
                        {user.role === "Contractor" &&
                          `(${user.contractorType || "Normal"})`}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(user)}
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(user._id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages} (
              {pagination.totalUsers} users)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <Dialog
          open={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open && !isSubmitting) handleCloseModal();
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Make changes to the user's profile.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 pt-4 max-h-[80vh] overflow-y-auto pr-2"
            >
              <div>
                <Label htmlFor="name">Full Name / Business Name</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required." })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "Email is required." })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={isSubmitting}
                />
              </div>

              {/* --- Fix: Edit Bank & UPI Fields (Use flat field names) --- */}
              <div className="border-t pt-4 mt-2">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Bank & Payment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="e.g. user@okhdfcbank"
                      {...register("upiId")}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="Bank Name"
                      {...register("bankName")}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccountNumber">Account No.</Label>
                    <Input
                      id="bankAccountNumber"
                      placeholder="Acc. Number"
                      {...register("bankAccountNumber")} // Register as flat field
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      placeholder="IFSC Code"
                      {...register("ifscCode")}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="Contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role === "professional" && (
                <div>
                  <Label>Profession</Label>
                  <Select
                    value={profession}
                    onValueChange={setProfession}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a profession" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionalSubRoles.map((subRole) => (
                        <SelectItem key={subRole} value={subRole}>
                          {subRole}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {role === "Contractor" && (
                <div>
                  <Label>Contractor Type</Label>
                  <Select
                    value={contractorType}
                    onValueChange={setContractorType}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contractor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsApproval && (
                <div>
                  <Label>Approval Status</Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AllUsersPage;
