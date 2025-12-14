// File: src/pages/professional/MyProductsPage.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  fetchMyProducts,
  deleteProduct,
  updateProduct,
  resetProductState,
  Product,
} from "@/lib/features/products/productSlice";
import { RootState, AppDispatch } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, PackageOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditProductModal from "./EditPlanModal";

const getStatusClass = (status?: string) => {
  switch (status) {
    case "Published":
      return "bg-green-100 text-green-800";
    case "Pending Review":
      return "bg-yellow-100 text-yellow-800";
    case "Draft":
      return "bg-gray-100 text-gray-700";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyProductsPage = () => {
  const dispatch: AppDispatch = useDispatch();

  // === YAHAN BADLAV KIYA GAYA HAI ===
  // Hum 'myProducts' state ko le rahe hain aur use 'products' naam de rahe hain
  // taaki baaki code mein badlav na karna pade.
  const {
    myProducts: products, // Sahi state 'myProducts' hai
    listStatus,
    actionStatus,
    error,
  } = useSelector((state: RootState) => state.products);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      dispatch(fetchMyProducts());
      dispatch(resetProductState());
    }
    if (actionStatus === "failed" && error) {
      toast.error(String(error) || "An action failed. Please try again.");
      dispatch(resetProductState());
    }
  }, [actionStatus, error, dispatch]);

  const handleDelete = (productId: string) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      dispatch(deleteProduct(productId)).then((result) => {
        if (deleteProduct.fulfilled.match(result)) {
          toast.success("Product deleted successfully!");
        }
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    dispatch(fetchMyProducts());
  };

  const handleStatusChange = (productId: string, newStatus: string) => {
    const formData = new FormData();
    formData.append("status", newStatus);
    dispatch(updateProduct({ productId, productData: formData })).then(
      (result) => {
        if (updateProduct.fulfilled.match(result)) {
          toast.success(`Product status updated to "${newStatus}"`);
        }
      }
    );
  };

  return (
    <>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Plans & Products
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all your uploaded house plans and designs here.
            </p>
          </div>
          <Link to="/professional/add-product">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} /> Add New Plan
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          {listStatus === "loading" && (
            <div className="p-12 flex items-center justify-center text-gray-500">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading Your
              Products...
            </div>
          )}

          {listStatus === "succeeded" &&
            (!products || products.length === 0) && (
              <div className="p-12 text-center text-gray-500">
                <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 font-semibold text-lg">No Products Found</p>
                <p className="mt-1">You haven't uploaded any products yet.</p>
                <Link to="/professional/add-product">
                  <Button variant="link" className="mt-2">
                    Create your first product
                  </Button>
                </Link>
              </div>
            )}

          {listStatus === "succeeded" && products && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Product
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Status
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Price
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600">
                      Date Added
                    </th>
                    <th className="p-4 font-semibold text-sm text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="rounded-md h-12 w-12">
                            <AvatarImage
                              src={product.mainImage}
                              alt={product.name}
                              className="object-cover"
                            />
                            <AvatarFallback className="font-bold">
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

                      <td className="p-4">
                        {product.status === "Published" ||
                        product.status === "Rejected" ? (
                          <div
                            className={`w-fit px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </div>
                        ) : (
                          <Select
                            value={product.status}
                            onValueChange={(newStatus) =>
                              handleStatusChange(product._id, newStatus)
                            }
                            disabled={actionStatus === "loading"}
                          >
                            <SelectTrigger
                              className={`w-[150px] text-xs font-semibold rounded-full border-0 focus:ring-0 ${getStatusClass(
                                product.status
                              )}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending Review">
                                Pending Review
                              </SelectItem>
                              <SelectItem value="Draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </td>

                      <td className="p-4 text-gray-800 font-medium">
                        ₹{product.price.toLocaleString()}
                      </td>

                      <td className="p-4 text-gray-600">
                        {product.createdAt
                          ? format(new Date(product.createdAt), "dd MMM, yyyy")
                          : "N/A"}
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(product)}
                            aria-label="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(product._id)}
                            disabled={actionStatus === "loading"}
                            aria-label="Delete Product"
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

          {listStatus === "failed" && (
            <div className="p-12 text-center text-red-500">
              <p className="font-semibold">Failed to load products</p>
              <p className="text-sm mt-1">{error}</p>
              <Button
                onClick={() => dispatch(fetchMyProducts())}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default MyProductsPage;
