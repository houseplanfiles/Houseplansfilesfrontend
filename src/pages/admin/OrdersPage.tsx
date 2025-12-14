import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllOrders,
  deleteOrderAdmin,
  markOrderAsPaidAdmin,
  resetActionStatus,
} from "@/lib/features/orders/orderSlice";
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
  DropdownMenuSeparator,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Loader2,
  Trash2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { toast } from "sonner";

type OrderItem = {
  product?: string;
  productId?: any;
  name: string;
  qty?: number;
  quantity?: number;
  price: number;
  image?: string;
  planFile?: string[];
};

// Updated Type Definition to include everything
type Order = {
  _id: string;
  user?: {
    name: string;
    email: string;
  };
  shippingAddress?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string; // Checkout page sends 'location'
    address?: string; // Fallback
    city?: string; // Fallback
  };
  orderItems?: OrderItem[];
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paymentMethod: string;
  paidAt?: string;
};

const AdminOrdersPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, actionStatus, error } = useSelector(
    (state: RootState) => state.orders
  );

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 15;

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      dispatch(resetActionStatus());
      setSelectedOrderId(null);
      setIsAlertOpen(false);
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "An error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch]);

  // Pagination Logic
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [currentPage, orders]);

  const handleDeleteClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOrderId) {
      dispatch(deleteOrderAdmin(selectedOrderId));
    }
  };

  const handleMarkAsPaid = (orderId: string) => {
    setSelectedOrderId(orderId);
    dispatch(markOrderAsPaidAdmin(orderId));
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleDownloadFile = (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${fileName}`);
    } catch (err) {
      toast.error("Failed to download file");
    }
  };

  // --- MAIN LOGIC HELPER ---
  // This extracts info from shippingAddress first (User Input), then falls back to User Profile
  const getCustomerDetails = (order: Order) => {
    const shipping = order.shippingAddress || {};
    const userProfile = order.user || {};

    return {
      name: shipping.name || userProfile.name || "Guest",
      email: shipping.email || userProfile.email || "N/A",
      phone: shipping.phone || "N/A",
      location: shipping.location || shipping.city || "N/A",
    };
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
      <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
      <p className="text-gray-600">View and process all customer orders.</p>

      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Customer Details</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order: Order) => {
                const customer = getCustomerDetails(order);
                return (
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {/* Name */}
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {customer.name}
                        </div>
                        {/* Email */}
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                        {/* Phone & Location */}
                        <div className="text-xs text-gray-400 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {customer.phone}
                          </span>
                          {customer.location !== "N/A" && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {customer.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      ₹{order.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      {order.isPaid ? (
                        <Badge className="bg-green-100 text-green-800">
                          Paid
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          Not Paid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="align-top pt-4">
                      {order.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right align-top pt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            {actionStatus === "loading" &&
                            selectedOrderId === order._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => handleViewDetails(order)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!order.isPaid && (
                            <DropdownMenuItem
                              onSelect={() => handleMarkAsPaid(order._id)}
                              className="text-green-600 focus:text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onSelect={() => handleDeleteClick(order._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Order
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <span className="font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?._id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer Info (Expanded) */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg mb-3 text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Name */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">
                      Name
                    </span>
                    <span className="font-medium text-base text-gray-900">
                      {getCustomerDetails(selectedOrder).name}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">
                      Email
                    </span>
                    <span className="font-medium text-base text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {getCustomerDetails(selectedOrder).email}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">
                      Phone
                    </span>
                    <span className="font-medium text-base text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {getCustomerDetails(selectedOrder).phone}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs uppercase tracking-wider">
                      Location
                    </span>
                    <span className="font-medium text-base text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {getCustomerDetails(selectedOrder).location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.orderItems &&
                  selectedOrder.orderItems.length > 0 ? (
                    selectedOrder.orderItems.map((item, index) => {
                      const itemQty = item.qty || item.quantity || 1;
                      const itemPrice = item.price || 0;
                      const itemTotal = itemQty * itemPrice;
                      let planFiles: string[] = [];

                      // Logic to extract files
                      if (
                        item.planFile &&
                        Array.isArray(item.planFile) &&
                        item.planFile.length > 0
                      ) {
                        planFiles = item.planFile;
                      } else if (
                        item.productId?.planFile &&
                        Array.isArray(item.productId.planFile)
                      ) {
                        planFiles = item.productId.planFile;
                      }

                      if (planFiles.length === 0 && item.image) {
                        planFiles = [item.image];
                      }

                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-start gap-4">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded border"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {item.name}
                              </h4>
                              <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
                                <p>
                                  Qty:{" "}
                                  <span className="font-bold text-gray-900">
                                    {itemQty}
                                  </span>
                                </p>
                                <p>
                                  Price:{" "}
                                  <span className="font-bold text-gray-900">
                                    ₹{itemPrice.toLocaleString()}
                                  </span>
                                </p>
                                <p className="text-teal-700 font-bold">
                                  Total: ₹{itemTotal.toLocaleString()}
                                </p>
                              </div>

                              {/* Download Buttons */}
                              {planFiles.length > 0 ? (
                                <div className="mt-4 space-y-2 border-t pt-3 border-dashed">
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Available Files:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {planFiles.map((fileUrl, fileIndex) => {
                                      if (!fileUrl) return null;
                                      const fileName =
                                        fileUrl
                                          .split("/")
                                          .pop()
                                          ?.split("?")[0] ||
                                        `File-${fileIndex + 1}`;
                                      const isImageFallback =
                                        fileUrl === item.image;

                                      return (
                                        <Button
                                          key={fileIndex}
                                          size="sm"
                                          variant="outline"
                                          className={`text-xs h-8 ${
                                            isImageFallback
                                              ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                              : "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                                          }`}
                                          onClick={() =>
                                            handleDownloadFile(
                                              fileUrl,
                                              fileName
                                            )
                                          }
                                        >
                                          <Download className="w-3 h-3 mr-1.5" />
                                          {isImageFallback
                                            ? "Image"
                                            : "Download File"}
                                        </Button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs text-amber-600 mt-2">
                                  No files available.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No items in this order
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">
                  Payment Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    {selectedOrder.isPaid ? (
                      <Badge className="bg-green-100 text-green-800">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        Not Paid
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      ₹{selectedOrder.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                {!selectedOrder.isPaid && (
                  <Button
                    onClick={() => {
                      handleMarkAsPaid(selectedOrder._id);
                      setIsDetailDialogOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Paid
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedOrderId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              {actionStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Yes, Delete Order
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOrdersPage;
