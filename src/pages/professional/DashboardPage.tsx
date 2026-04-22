import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Star, PlusCircle, ClipboardList, Briefcase, Eye, MessageSquare, LayoutGrid } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMyProducts } from "@/lib/features/products/productSlice";
import { fetchMyProfessionalOrders } from "@/lib/features/professional/professionalOrderSlice";
import { fetchMyInquiries } from "@/lib/features/inquiries/inquirySlice";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const isContractor = userInfo?.role?.toLowerCase() === "contractor";

  const { myProducts, listStatus: productStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.professionalOrders
  );
  const { inquiries, listStatus: inquiryStatus } = useSelector(
    (state: RootState) => state.inquiries
  );

  useEffect(() => {
    if (isContractor) {
      dispatch(fetchMyInquiries());
    } else {
      dispatch(fetchMyProducts());
      dispatch(fetchMyProfessionalOrders());
    }
  }, [dispatch, isContractor]);

  const stats = useMemo(() => {
    if (isContractor) {
       return {
         enquiriesCount: inquiries?.length || 0,
         portfolioCount: userInfo?.workSamples?.length || 0,
         projectsCount: userInfo?.projects?.length || 0
       };
    }

    let totalSales = 0;
    let totalRating = 0;
    let reviewCount = 0;

    orders?.forEach((order) => {
      if (order.isPaid) {
        order.orderItems.forEach((item) => {
          totalSales += item.price * item.quantity;
        });
      }
    });

    myProducts?.forEach((product) => {
      if (product.rating && product.rating > 0) {
        totalRating += product.rating;
        reviewCount += 1;
      }
    });

    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0.0";

    return {
      productsListed: myProducts?.length || 0,
      totalSales: `₹${totalSales.toLocaleString()}`,
      averageRating: averageRating,
    };
  }, [orders, myProducts, isContractor, inquiries, userInfo]);

  const summaryCards = isContractor ? [
    { title: "Total Enquiries", value: stats.enquiriesCount, icon: MessageSquare },
    { title: "Portfolio Items", value: stats.portfolioCount, icon: Briefcase },
    { title: "Active Projects", value: stats.projectsCount, icon: LayoutGrid },
  ] : [
    {
      title: "Products Listed",
      value: stats.productsListed,
      icon: Package,
    },
    { title: "Total Sales", value: stats.totalSales, icon: DollarSign },
    { title: "Average Rating", value: stats.averageRating, icon: Star },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {isContractor ? "Contractor Dashboard" : "Professional Dashboard"}
        </h1>
        <p className="mt-1 text-gray-600">
          Manage your {isContractor ? "profile and leads" : "products and orders"} from
          here.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="bg-gray-50 border rounded-xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <card.icon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {productStatus === "loading" || orderStatus === "loading" || inquiryStatus === "loading"
                ? "..."
                : card.value}
            </p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-primary/10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-primary/20">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {isContractor ? "Enhance Your Portfolio" : "Have a New Design?"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isContractor
              ? "Update your portfolio with latest projects to attract more clients."
              : "Upload your latest house plans and reach thousands of potential clients."}
          </p>
        </div>
        <Link to={isContractor ? "portfolio" : "add-product"}>
          <Button className="btn-primary flex items-center gap-2 shrink-0">
            <PlusCircle size={18} />
            {isContractor ? "Update Portfolio" : "Upload New Product"}
          </Button>
        </Link>
      </div>

      {isContractor ? (
        <div>
           <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Enquiries</h2>
           <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
             {inquiries && inquiries.length > 0 ? (
               <table className="w-full text-left whitespace-nowrap">
                  <thead>
                     <tr className="border-b text-gray-600">
                        <th className="py-3 font-semibold">Customer</th>
                        <th className="py-3 font-semibold">Date</th>
                        <th className="py-3 font-semibold">Message</th>
                        <th className="py-3 font-semibold">Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     {inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq._id} className="border-b last:border-0 hover:bg-gray-50">
                           <td className="py-4">
                              <div className="font-medium text-gray-800">{inq.senderName}</div>
                              <div className="text-xs text-gray-500">{inq.senderEmail}</div>
                           </td>
                           <td className="py-4 text-gray-600">
                              {new Date(inq.createdAt).toLocaleDateString()}
                           </td>
                           <td className="py-4 text-gray-600 max-w-xs truncate">
                              {inq.requirements}
                           </td>
                           <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                 inq.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                 {inq.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             ) : (
                <div className="text-center text-gray-500 py-8 italic">No inquiries yet.</div>
             )}
           </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Sales</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
            {orders && orders.length > 0 ? (
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b text-gray-600">
                    <th className="py-3 font-semibold">Order ID</th>
                    <th className="py-3 font-semibold">Customer</th>
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 font-semibold">Items</th>
                    <th className="py-3 font-semibold">Total</th>
                    <th className="py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const itemsTotal = order.orderItems.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    );
                    return (
                      <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-4 text-gray-800 font-medium">{order._id.substring(0, 8)}...</td>
                        <td className="py-4 text-gray-600">
                          {order.user?.name || order.shippingAddress?.name || "Guest"}
                        </td>
                        <td className="py-4 text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 text-gray-600">
                          {order.orderItems.map((item) => item.name).join(", ")}
                        </td>
                        <td className="py-4 text-gray-800 font-semibold">
                          ₹{itemsTotal.toLocaleString()}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.isPaid
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No recent sales found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
