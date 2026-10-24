"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangleIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteDestinationDialogProps {
  destinationId: string;
  destinationTitle: string;
}

export default function DeleteDestinationDialog({
  destinationId,
  destinationTitle,
}: DeleteDestinationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/destinations/${destinationId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Failed to delete destination:", res.status);
      }

      setOpen(false);
      // Redirect back to destinations list after successful deletion
      router.push("/destinations");
      router.refresh();
    } catch (error) {
      console.error("Error deleting destination:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-md border-red-200 px-4 font-medium text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2Icon className="size-4" />
            Delete
          </Button>
        }
      />

      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[460px] rounded-xl bg-white p-6 shadow-xl">
        <DialogHeader className="flex flex-row items-center gap-3 text-left">
          {/* Warning Icon Badge */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangleIcon className="size-5" />
          </div>

          <DialogTitle className="text-xl font-semibold tracking-tight text-neutral-900">
            Delete Travel Package
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="mt-2 text-sm leading-relaxed text-neutral-600">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-neutral-900">
            &quot;{destinationTitle}&quot;
          </strong>
          ? This action cannot be undone and will permanently remove this travel
          package from the system.
        </DialogDescription>

        <div className="mt-6 flex items-center justify-end gap-3">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                className="h-10 rounded-md border-neutral-200 px-5 font-normal text-neutral-700 hover:bg-neutral-50"
              />
            }
          >
            Cancel
          </DialogClose>

          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-10 gap-2 rounded-md bg-[#eb4444] px-5 font-medium text-white hover:bg-[#d63b3b] disabled:opacity-50"
          >
            <Trash2Icon className="size-4" />
            {isDeleting ? "Deleting..." : "Delete Package"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
