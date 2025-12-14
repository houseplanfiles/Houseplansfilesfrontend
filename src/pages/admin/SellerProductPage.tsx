import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  fetchAllProductsForAdmin,
  deleteSellerProduct,
  updateSellerProduct,
  resetActionStatus,
} from "@/lib/features/seller/sellerProductSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EditProductModal } from "@/components/EditProductModal";

interface IProductSeller {
  _id: string;
  businessName?: string;
  email?: string;
}

interface IProduct {
  _id: string;
  name: string;
  image: string;
  seller: IProductSeller;
  city: string;
  price: number;
  countInStock: number;
  [key: string]: any;
}

const SellerProductPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, status, pagination, actionStatus, error } = useSelector(
    (state: RootState) => state.sellerProducts
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllProductsForAdmin({ page: currentPage }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully!");
      if (isModalOpen) {
        setIsModalOpen(false);
        setEditingProduct(null);
      }
      dispatch(resetActionStatus());
      dispatch(fetchAllProductsForAdmin({ page: currentPage }));
    }
    if (actionStatus === "failed") {
      toast.error(error || "An unknown error occurred.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, error, dispatch, isModalOpen, currentPage]);

  const handleOpenEditModal = (product: IProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdate = (productId: string, productData: FormData) => {
    dispatch(updateSellerProduct({ productId, productData }));
  };

  const handleDelete = (productId: string) => {
    if (
      window.confirm("Are you sure? This will permanently delete the product.")
    ) {
      dispatch(deleteSellerProduct(productId));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">All Seller Products</h1>

      <Card>
        <CardContent className="p-0">
          {status === "loading" && products.length === 0 && (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {status !== "loading" || products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">
                    Image
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product: IProduct) => (
                    <TableRow key={product._id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt={product.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.image}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        {product.seller?.businessName || "N/A"}
                      </TableCell>
                      <TableCell>{product.city}</TableCell>
                      <TableCell>₹{product.price}</TableCell>
                      <TableCell>{product.countInStock}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onSelect={() => handleOpenEditModal(product)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleDelete(product._id)}
                              className="text-red-600"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <span className="font-semibold text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            variant="outline"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onSave={handleUpdate}
          isLoading={actionStatus === "loading"}
        />
      )}
    </div>
  );
};

export default SellerProductPage;
