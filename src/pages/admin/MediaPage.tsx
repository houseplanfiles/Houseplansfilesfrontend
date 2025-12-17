import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ServerCrash,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { fetchMediaItems } from "@/lib/features/media/mediaSlice";

const MediaPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, page, pages, status, error } = useSelector(
    (state: RootState) => state.media
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [jumpToPage, setJumpToPage] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(
      fetchMediaItems({
        pageNumber: currentPage,
        searchTerm: debouncedSearchTerm,
      })
    );
  }, [dispatch, currentPage, debouncedSearchTerm]);

  const getFileExtension = (url: string = ""): string => {
    if (!url) return "file";
    try {
      const cleanUrl = url.split("?")[0];
      const parts = cleanUrl.split(".");
      return parts.length > 1 ? parts.pop()! : "file";
    } catch (e) {
      return "file";
    }
  };

  const handleDownload = async (url: string | undefined, filename: string) => {
    if (!url) {
      toast.error("No file URL available.");
      return;
    }

    try {
      toast.info(`Downloading: ${filename}...`);

      // Attempt fetch with CORS mode to allow renaming
      const response = await fetch(url, { mode: "cors" });

      if (!response.ok) throw new Error("Fetch failed");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      toast.success("Download success");
    } catch (err) {
      console.error("Download fallback triggered:", err);
      // Fallback: Open in new tab if CORS blocks the download
      window.open(url, "_blank");
    }
  };

  const handlePageJump = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  if (status === "loading" && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-center py-20">
        <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-xl font-semibold text-red-500">
          Failed to load media
        </h3>
        <p className="mt-2 text-gray-500">{String(error)}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or product no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Product No.</TableHead>
              <TableHead>Plan Type</TableHead>
              <TableHead>Main Image</TableHead>
              <TableHead>Plan Files (PDFs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((product) => {
              const productIdentifier = product.productNo || "product";

              // Logic to handle Array or String or Undefined
              let planFiles: string[] = [];
              if (Array.isArray(product.planFile)) {
                planFiles = product.planFile;
              } else if (typeof product.planFile === "string") {
                planFiles = [product.planFile];
              }

              // Debugging: Check console to see how many files are coming
              // console.log(`Product: ${product.productNo}`, planFiles);

              return (
                <TableRow key={product._id}>
                  <TableCell
                    className="font-medium max-w-[200px] truncate"
                    title={product.name}
                  >
                    {product.name}
                  </TableCell>
                  <TableCell>{productIdentifier}</TableCell>
                  <TableCell>{product.planType}</TableCell>

                  {/* Main Image Button */}
                  <TableCell>
                    {product.mainImage ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() =>
                          handleDownload(
                            product.mainImage,
                            `${productIdentifier}-main.${getFileExtension(product.mainImage)}`
                          )
                        }
                      >
                        <ImageIcon className="mr-2 h-4 w-4" /> Image
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </TableCell>

                  {/* PDF Download Buttons */}
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {planFiles.length > 0 ? (
                        planFiles.map((url, index) => (
                          <Button
                            key={index}
                            variant="secondary"
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() =>
                              handleDownload(
                                url,
                                `${productIdentifier}-plan-${index + 1}.${getFileExtension(url)}`
                              )
                            }
                          >
                            <FileText className="mr-2 h-3 w-3" />
                            PDF {index + 1}
                          </Button>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No PDFs</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || status === "loading"}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span className="font-medium">
            Page {page} of {pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, pages))}
            disabled={currentPage === pages || status === "loading"}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
          <form onSubmit={handlePageJump} className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max={pages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              placeholder="Page..."
              className="w-20 h-10"
            />
            <Button type="submit" variant="outline" className="h-10">
              Go
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
