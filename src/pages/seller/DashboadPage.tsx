import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchSellerDashboardData } from "@/lib/features/sellerdashboard/sellerDashboardSlice";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Package,
  Loader2,
  ServerCrash,
} from "lucide-react";

const SellerDashboardPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { stats, recentInquiries, status, error } = useSelector(
    (state: RootState) => state.sellerDashboard
  );

  useEffect(() => {
    dispatch(fetchSellerDashboardData());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20">
        <ServerCrash className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Failed to Load Dashboard
        </h3>
        <p className="text-gray-600">{String(error)}</p>
        <Button
          onClick={() => dispatch(fetchSellerDashboardData())}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || "0",
      icon: Package,
    },
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries?.toLocaleString() || "0",
      icon: MessageSquare,
    },
    {
      title: "Unique Buyers",
      value: stats?.totalBuyers?.toLocaleString() || "0",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Welcome back, {userInfo?.businessName || userInfo?.name || "Seller"}
            !
          </p>
        </div>
        <Link to="/seller/products/add">
          <Button className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {card.title}
              </h3>
              <card.icon className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Inquiries
        </h2>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentInquiries && recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry) => (
                  <TableRow key={inquiry._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {inquiry.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {inquiry.product?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inquiry.status === "Pending"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-gray-500"
                  >
                    No recent inquiries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4 p-4 text-center border-t">
            <Link to="/seller/inquiries">
              <Button variant="link" className="text-orange-600 font-semibold">
                View All Inquiries
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
