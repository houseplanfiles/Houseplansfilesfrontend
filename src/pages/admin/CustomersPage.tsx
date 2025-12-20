// src/pages/admin/CustomersPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// NOTE: Make sure you have an update action in your slice, e.g., updateUserAdmin
import {
  fetchAllUsersAdmin,
  deleteUserAdmin,
  // updateUserAdmin, // Import this from your slice if you have it
  resetAdminActionStatus,
} from "@/lib/features/admin/adminSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Import Dialog components for Editing
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Loader2,
  Trash2,
  Edit,
  FileSpreadsheet,
  ShieldAlert,
  Copy, // New Icon
} from "lucide-react";
import { toast } from "sonner";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { users, status, actionStatus, error } = useSelector(
    (state) => state.admin
  );

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // --- NEW STATES FOR EDITING ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    dispatch(fetchAllUsersAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetAdminActionStatus());
      setSelectedUserId(null);
      setIsAlertOpen(false);
      setIsEditOpen(false); // Close edit modal on success
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "An error occurred.");
      dispatch(resetAdminActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  const customers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => user.role === "user");
  }, [users]);

  // --- CSV EXPORT FUNCTION ---
  const handleExportCSV = () => {
    if (customers.length === 0) {
      toast.error("No customers found to export.");
      return;
    }
    // ... (Old CSV logic remains same)
    setIsExporting(true);
    try {
      const headers = ["ID", "Name", "Email", "Phone", "Joined On"];
      const csvRows = [
        headers.join(","),
        ...customers.map((customer) => {
          const name = customer.name
            ? `"${customer.name.replace(/"/g, '""')}"`
            : "N/A";
          const email = customer.email || "N/A";
          const phone = customer.phone ? `"${customer.phone}"` : "N/A";
          const joinedDate = new Date(customer.createdAt).toLocaleDateString();
          return [customer._id, name, email, phone, joinedDate].join(",");
        }),
      ];
      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Customers_List_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Customer data exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  // --- DELETE HANDLERS ---
  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) {
      dispatch(deleteUserAdmin(selectedUserId));
    }
  };

  // --- NEW: COPY FUNCTION ---
  const handleCopyPhone = (phone) => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      toast.success("Phone number copied to clipboard!");
    } else {
      toast.error("No phone number to copy.");
    }
  };

  // --- NEW: EDIT HANDLERS ---
  const handleEditClick = (customer) => {
    setEditingUser({
      id: customer._id,
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    // Dispatch your update action here
    // Example: dispatch(updateUserAdmin({ id: editingUser.id, userData: editingUser }));

    // For now, strictly creating a dummy log since I don't have your update action
    console.log("Saving user:", editingUser);
    toast.info("Update logic needs to be connected to Redux (updateUserAdmin)");

    // Once you connect Redux, remove this setIsEditOpen(false) as useEffect will handle it
    setIsEditOpen(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Customers</h1>
          <p className="text-gray-600">View and manage your customer list.</p>
        </div>
        <Button
          variant="outline"
          className="border-green-600 text-green-700 hover:bg-green-50"
          onClick={handleExportCSV}
          disabled={isExporting || customers.length === 0}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          {isExporting ? "Exporting..." : "Export Customers CSV"}
        </Button>
      </div>

      {/* 
         CHANGE 1: Removed 'select-none', onCopy, onPaste, onContextMenu
         Allows normal selection and copying.
      */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={customer.photoUrl}
                          alt={customer.name}
                        />
                        <AvatarFallback>
                          {customer.name
                            ? customer.name.charAt(0).toUpperCase()
                            : "C"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {customer.email}
                  </TableCell>

                  {/* CHANGE 2: Added Copy Button for Phone */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{customer.phone || "N/A"}</span>
                      {customer.phone && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-blue-600"
                          onClick={() => handleCopyPhone(customer.phone)}
                          title="Copy Phone Number"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          {actionStatus === "loading" &&
                          selectedUserId === customer._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* CHANGE 3: Connected Edit Button */}
                        <DropdownMenuItem
                          onSelect={() => handleEditClick(customer)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleDeleteClick(customer._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <ShieldAlert className="h-8 w-8 mb-2 text-gray-300" />
                    <p>No customers found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUserId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Customer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CHANGE 4: Edit Customer Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={editingUser.phone}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            {/* Email is usually read-only, but you can enable editing if backend supports it */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={editingUser.email}
                disabled
                className="col-span-3 bg-gray-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersPage;
