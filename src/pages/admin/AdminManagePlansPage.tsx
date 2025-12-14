
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { format } from "date-fns";
import { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAdminProducts,
  updateProduct,
  Product,
  resetProductState,
} from "@/lib/features/products/productSlice";
import { Loader2, PackageOpen } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const getStatusClass = (status: string): string => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-800";
    case "Pending Review":
      return "bg-yellow-100 text-yellow-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "Draft":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
const AdminProductsPage: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, listStatus, actionStatus } = useSelector(
    (state: RootState) => state.products
  );
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Product status updated successfully!");
      dispatch(fetchAdminProducts()); // Refresh the list
      dispatch(resetProductState());
    }
  }, [actionStatus, dispatch]);
  const handleStatusChange = (productId: string, newStatus: string) => {
    const formData = new FormData();
    formData.append("status", newStatus);
    dispatch(updateProduct({ productId, productData: formData }));
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Manage All Products
          </h1>
          <p className="text-gray-600 mt-1">
            Approve, reject, or manage all uploaded products.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border overflow-hidden">
        {listStatus === "loading" && (
          <div className="p-12 flex items-center justify-center text-gray-500">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading All
            Products...
          </div>
        )}

        {listStatus === "succeeded" && (!products || products.length === 0) && (
          <div className="p-12 text-center text-gray-500">
            <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 font-semibold text-lg">No Products Found</p>
          </div>
        )}

        {listStatus === "succeeded" && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Product
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Uploaded By
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Date Added
                  </th>
                  <th className="p-4 font-semibold text-sm text-gray-600">
                    Status (Admin Action)
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: Product) => (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="rounded-md h-12 w-12">
                          <AvatarImage
                            src={product.mainImage}
                            alt={product.name}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {product.name
                              ? product.name.charAt(0).toUpperCase()
                              : "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.productNo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.user?.name || "N/A"}
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.createdAt
                        ? format(new Date(product.createdAt), "dd MMM, yyyy")
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      <Select
                        value={product.status}
                        onValueChange={(newStatus) =>
                          handleStatusChange(product._id, newStatus)
                        }
                        disabled={actionStatus === "loading"}
                      >
                        <SelectTrigger
                          className={`w-[180px] text-xs font-semibold rounded-full border-0 focus:ring-0 ${getStatusClass(product.status || "")}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Published">
                            Publish (Approve)
                          </SelectItem>
                          <SelectItem value="Pending Review">
                            Pending Review
                          </SelectItem>
                          <SelectItem value="Rejected">Reject</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
