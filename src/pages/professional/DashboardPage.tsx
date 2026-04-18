import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Star, PlusCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchMyProducts } from "@/lib/features/products/productSlice";
import { fetchMyProfessionalOrders } from "@/lib/features/professional/professionalOrderSlice";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { userInfo } = useSelector((state: RootState) => state.user);
  const isContractor = userInfo?.role === "contractor";

  const { myProducts, listStatus: productStatus } = useSelector(
    (state: RootState) => state.products
  );
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.professionalOrders
  );

  useEffect(() => {
    dispatch(fetchMyProducts());
    dispatch(fetchMyProfessionalOrders());
  }, [dispatch]);

  const stats = useMemo(() => {
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
      // Assuming rating is accessible this way and calculating average across rated products
      if (product.rating && product.rating > 0) {
        totalRating += product.rating;
        reviewCount += 1;
      }
    });

    const averageRating =
      reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "0.0";

    return {
      productsListed: myProducts?.length || 0,
      totalSales: `₹${totalSales.toLocaleString()}`,
      averageRating: averageRating,
    };
  }, [orders, myProducts]);

  const summaryCards = [
    {
      title: isContractor ? "Services Listed" : "Products Listed",
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
          Manage your {isContractor ? "services" : "products"} and profile from
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
              {productStatus === "loading" || orderStatus === "loading"
                ? "..."
                : card.value}
            </p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-primary/10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 border border-primary/20">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {isContractor ? "Have a New Service?" : "Have a New Design?"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isContractor
              ? "Upload your latest construction services and reach thousands of potential clients."
              : "Upload your latest house plans and reach thousands of potential clients."}
          </p>
        </div>
        <Link to="add-product">
          <Button className="btn-primary flex items-center gap-2 shrink-0">
            <PlusCircle size={18} />
            {isContractor ? "Add New Service" : "Upload New Product"}
          </Button>
        </Link>
      </div>
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
    </div>
  );
};
export default DashboardPage;
