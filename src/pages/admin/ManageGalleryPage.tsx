import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AppDispatch, RootState } from "@/lib/store";
import useEmblaCarousel from "embla-carousel-react";
import {
  fetchGalleryItems,
  deleteGalleryItem,
  resetActionStatus,
  GalleryItem,
} from "@/lib/features/gallery/gallerySlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  PlusCircle,
  Trash2,
  ServerCrash,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Naya Card Component jo Image Group (Project) ko handle karega
const ProjectGroupCard = ({
  group,
  onDeleteGroup,
}: {
  group: GalleryItem[];
  onDeleteGroup: (ids: string[]) => void;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const firstItem = group[0];

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const handleDeleteClick = () => {
    const idsToDelete = group.map((item) => item._id);
    onDeleteGroup(idsToDelete);
  };

  return (
    <Card className="overflow-hidden group flex flex-col">
      <CardContent className="p-0 relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {group.map((item) => (
              <div className="flex-grow-0 flex-shrink-0 w-full" key={item._id}>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.altText || item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {group.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={scrollPrev}
            >
              {" "}
              <ChevronLeft className="h-4 w-4" />{" "}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={scrollNext}
            >
              {" "}
              <ChevronRight className="h-4 w-4" />{" "}
            </Button>
          </>
        )}
      </CardContent>
      <CardHeader className="p-4">
        <CardTitle className="text-base truncate">{firstItem.title}</CardTitle>
        <div className="flex items-center text-xs text-muted-foreground pt-1">
          <ImageIcon className="h-3 w-3 mr-1.5" />
          {group.length} {group.length > 1 ? "images" : "image"}
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
        <p className="text-xs text-muted-foreground">{firstItem.category}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the entire project "
                {firstItem.title}" with all its {group.length} images. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteClick}>
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

const ManageGalleryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { items, status, actionStatus, error } = useSelector(
    (state: RootState) => state.gallery
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchGalleryItems());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Action completed successfully.");
      dispatch(resetActionStatus());
    }
    if (actionStatus === "failed") {
      toast.error(String(error) || "The action has failed.");
      dispatch(resetActionStatus());
    }
  }, [actionStatus, dispatch, error]);

  // Naya Grouping Logic
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: GalleryItem[] } = {};
    items.forEach((item) => {
      const key = item.title.trim().toLowerCase();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return Object.values(groups).sort(
      (a, b) =>
        new Date(b[0].createdAt || 0).getTime() -
        new Date(a[0].createdAt || 0).getTime()
    );
  }, [items]);

  // Naya Delete Handler jo multiple IDs delete karega
  const handleDeleteGroup = (ids: string[]) => {
    toast.info(`Deleting ${ids.length} images...`);
    ids.forEach((id) => {
      dispatch(deleteGalleryItem(id));
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Gallery</h1>
        <Link to="/admin/gallery/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
          </Button>
        </Link>
      </div>

      {status === "loading" && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {status === "failed" && (
        <div className="text-center py-20 bg-red-50 rounded-lg">
          <ServerCrash className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-red-600">
            Error Loading Gallery
          </h3>
          <p className="mt-2 text-red-500">{String(error)}</p>
        </div>
      )}

      {status === "succeeded" && groupedItems.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">The Gallery is Empty</h3>
          <p className="mt-2 text-muted-foreground">
            Start by adding your first project images.
          </p>
        </div>
      )}

      {status === "succeeded" && groupedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {groupedItems.map((group) => (
            <ProjectGroupCard
              key={group[0].title}
              group={group}
              onDeleteGroup={handleDeleteGroup}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGalleryPage;
