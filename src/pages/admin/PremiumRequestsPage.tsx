import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAllPremiumRequests,
  updatePremiumRequest,
  deletePremiumRequest,
  resetActionStatus,
  type PremiumRequest,
} from "@/lib/features/premiumRequest/premiumRequestSlice";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trash2,
  Loader2,
  Inbox,
  Edit,
  RefreshCw,
  FileDown, // Icon import karein
  Copy, // Icon import karein
  Phone, // Icon import karein
  Mail, // Icon import karein
} from "lucide-react";
import EditRequestModal from "./EditRequestModal";

const PremiumRequestsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, listStatus, actionStatus, error } = useSelector(
    (state: RootState) => state.premiumRequests
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<PremiumRequest | null>(
    null
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    dispatch(fetchAllPremiumRequests());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      const timer = setTimeout(() => {
        dispatch(resetActionStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionStatus, dispatch]);

  const requestsArray = useMemo(
    () => (Array.isArray(requests) ? [...requests].reverse() : []),
    [requests]
  );

  // Pagination Logic
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return requestsArray.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [requestsArray, currentPage]);

  const totalPages = Math.ceil(requestsArray.length / ITEMS_PER_PAGE);

  const handleRefresh = useCallback(() => {
    dispatch(fetchAllPremiumRequests());
    toast.info("Refreshing requests...");
  }, [dispatch]);

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success(`${type} copied to clipboard!`),
      () => toast.error(`Failed to copy ${type}.`)
    );
  };

  const handleDownloadCSV = () => {
    if (!requestsArray || requestsArray.length === 0) {
      toast.info("No data to download.");
      return;
    }
    const headers = [
      "ID",
      "Package",
      "Name",
      "WhatsApp",
      "Email",
      "City",
      "Status",
      "Date",
    ];
    const escapeCSV = (str: any) => {
      if (str === null || str === undefined) return "";
      const s = String(str);
      return s.includes('"') || s.includes(",")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };
    const csvRows = requestsArray.map((req: any) =>
      [
        escapeCSV(req._id),
        escapeCSV(req.packageName),
        escapeCSV(req.name),
        escapeCSV(req.whatsapp),
        escapeCSV(req.email),
        escapeCSV(req.city),
        escapeCSV(req.status),
        escapeCSV(format(new Date(req.createdAt), "yyyy-MM-dd HH:mm:ss")),
      ].join(",")
    );
    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "premium-consultation-requests.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success("CSV download started!");
  };

  const handleStatusChange = useCallback(
    async (requestId: string, newStatus: PremiumRequest["status"]) => {
      try {
        const result = await dispatch(
          updatePremiumRequest({ requestId, updateData: { status: newStatus } })
        );
        if (updatePremiumRequest.fulfilled.match(result)) {
          toast.success(`Request status updated to ${newStatus}`);
        } else {
          throw new Error(result.payload as string);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to update status");
      }
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    async (requestId: string) => {
      if (
        !window.confirm("Are you sure you want to delete this premium request?")
      )
        return;
      try {
        const result = await dispatch(deletePremiumRequest(requestId));
        if (deletePremiumRequest.fulfilled.match(result)) {
          toast.success("Request deleted successfully!");
        } else {
          throw new Error(result.payload as string);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to delete request");
      }
    },
    [dispatch]
  );

  const handleEditClick = useCallback((request: PremiumRequest) => {
    setSelectedRequest(request);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedRequest(null);
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Premium Consultation Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all premium plan consultation requests.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={listStatus === "loading"}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${listStatus === "loading" ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={handleDownloadCSV}
              disabled={!requestsArray || requestsArray.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" /> Download All as CSV
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {listStatus === "loading" ? (
            <div className="p-12 flex items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading
              Requests...
            </div>
          ) : !paginatedRequests || paginatedRequests.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Inbox className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 font-semibold">No premium requests found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 font-semibold text-sm text-gray-600">
                        Package
                      </th>
                      <th className="p-4 font-semibold text-sm text-gray-600">
                        Customer
                      </th>
                      <th className="p-4 font-semibold text-sm text-gray-600">
                        City
                      </th>
                      <th className="p-4 font-semibold text-sm text-gray-600">
                        Date
                      </th>
                      <th className="p-4 font-semibold text-sm text-gray-600">
                        Status
                      </th>
                      <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((req: PremiumRequest) => (
                      <tr
                        key={req._id}
                        className="border-t hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-medium text-gray-800">
                          {req.packageName}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">
                            {req.name}
                          </div>
                          {req.whatsapp && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {req.whatsapp}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  handleCopyToClipboard(
                                    req.whatsapp,
                                    "WhatsApp number"
                                  )
                                }
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {req.email && (
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {req.email}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">{req.city}</td>
                        <td className="p-4 text-gray-600">
                          {format(new Date(req.createdAt), "dd MMM, yyyy")}
                        </td>
                        <td className="p-4">
                          <Select
                            value={req.status}
                            onValueChange={(
                              newStatus: PremiumRequest["status"]
                            ) => handleStatusChange(req._id, newStatus)}
                            disabled={actionStatus === "loading"}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                  Pending
                                </span>
                              </SelectItem>
                              <SelectItem value="Contacted">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                  Contacted
                                </span>
                              </SelectItem>
                              <SelectItem value="In Progress">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                  In Progress
                                </span>
                              </SelectItem>
                              <SelectItem value="Completed">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                  Completed
                                </span>
                              </SelectItem>
                              <SelectItem value="Cancelled">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                                  Cancelled
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(req)}
                              disabled={actionStatus === "loading"}
                              title="Edit Request"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(req._id)}
                              disabled={actionStatus === "loading"}
                              title="Delete Request"
                            >
                              {actionStatus === "loading" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedRequest && (
        <EditRequestModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
        />
      )}
    </>
  );
};

export default PremiumRequestsPage;
