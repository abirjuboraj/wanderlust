"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SaveIcon, Trash2Icon, PencilIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";
import { API_BASE_URL, CATEGORIES, type TravelPackageData } from "@/lib/constants";
import { getTokenFromClient } from "@/utils/getTokenFromClient";

export type { TravelPackageData };

type FormState = {
  destinationName: string;
  country: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

interface EditDestinationDialogProps {
  initialData?: TravelPackageData;
  onSave?: (data: TravelPackageData) => void | Promise<void>;
  trigger?: React.ReactNode;
}

const inputClass =
  "h-11 rounded-md border-transparent bg-[#f4f7fa] px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#29abe2]/60 focus-visible:ring-[#29abe2]/25";

function FormField({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-semibold text-neutral-900">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function EditDestinationDialog({
  initialData,
  onSave,
  trigger,
}: EditDestinationDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<string>(initialData?.category ?? "Beach");

  const buildInitialForm = (): FormState => ({
    destinationName: initialData?.destinationName ?? "",
    country: initialData?.country ?? "",
    price: initialData?.price !== undefined ? String(initialData.price) : "",
    duration: initialData?.duration ?? "",
    departureDate: initialData?.departureDate ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    description: initialData?.description ?? "",
  });

  const [form, setForm] = useState<FormState>(buildInitialForm);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setForm(buildInitialForm());
      setCategory(initialData?.category ?? "Beach");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const targetId = initialData?._id || initialData?.id;
    const payload = {
      ...form,
      price: Number(form.price) || form.price,
      category,
    };

    try {
      if (onSave) {
        await onSave({ ...payload, _id: targetId, id: targetId });
      } else if (targetId) {

        const token = await getTokenFromClient();
        const res = await fetch(`${API_BASE_URL}/destinations/${targetId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json",
            "authorization": `Bearer ${token}`
           },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Backend PATCH failed with status ${res.status}:`, errorText);
        } else {
          try {
            const result = await res.json();
            console.log(result);
          } catch {
            // response might be empty
          }
        }
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Error updating destination:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ? (
            (trigger as React.ReactElement)
          ) : (
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-md px-4 font-medium text-neutral-900"
            >
              <PencilIcon className="size-4" />
              Edit
            </Button>
          )
        }
      />

      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-[540px] max-h-[80vh] flex flex-col overflow-hidden rounded-xl bg-white p-0 shadow-2xl">
        <DialogHeader className="gap-1.5 text-left shrink-0 border-b border-neutral-100 p-5 sm:p-6 pb-4">
          <DialogTitle className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
            Update Travel Package
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-500">
            Make changes to the travel package details below
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 gap-4"
        >
          {/* Destination Name */}
          <Input
            id="dialogDestinationName"
            placeholder="Bali Paradise"
            value={form.destinationName}
            onChange={(e) => updateField("destinationName", e.target.value)}
            className={inputClass}
            required
          />

          {/* Country & Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField htmlFor="dialogCountry" label="Country">
              <Input
                id="dialogCountry"
                placeholder="Indonesia"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className={inputClass}
                required
              />
            </FormField>

            <FormField htmlFor="dialogCategory" label="Category">
              <Select
                value={category}
                onValueChange={(val) => setCategory(val ?? "Beach")}
              >
                <SelectTrigger
                  id="dialogCategory"
                  className={cn(
                    inputClass,
                    "w-full cursor-pointer justify-between border-transparent font-normal shadow-none"
                  )}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-md border border-neutral-200 bg-white shadow-md">
                  {CATEGORIES.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="cursor-pointer py-2 hover:bg-[#f4f7fa]"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField htmlFor="dialogPrice" label="Price (USD)">
              <Input
                id="dialogPrice"
                type="number"
                placeholder="e.g., 1299"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={inputClass}
                required
              />
            </FormField>

            <FormField htmlFor="dialogDuration" label="Duration">
              <Input
                id="dialogDuration"
                placeholder="e.g., 7 Days/6 Nights"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Departure Date */}
          <FormField htmlFor="dialogDepartureDate" label="Departure Date">
            <Input
              id="dialogDepartureDate"
              type="text"
              placeholder="mm/dd/yyyy"
              value={form.departureDate}
              onChange={(e) => updateField("departureDate", e.target.value)}
              className={inputClass}
            />
          </FormField>

          {/* Image URL */}
          <FormField htmlFor="dialogImageUrl" label="Image URL">
            <Input
              id="dialogImageUrl"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              className={inputClass}
            />
          </FormField>

          {/* Description */}
          <FormField htmlFor="dialogDescription" label="Description">
            <Textarea
              id="dialogDescription"
              placeholder="Describe the travel experience..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className={cn(
                inputClass,
                "h-auto min-h-24 resize-y py-2.5 leading-relaxed"
              )}
            />
          </FormField>

          {/* Actions */}
          <div className="-mx-5 -mb-4 sm:-mx-6 sm:-mb-5 mt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-neutral-100 bg-white/95 backdrop-blur-xs p-4 sm:px-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="h-10 w-full sm:w-auto gap-2 rounded-md border-red-300 px-5 text-red-500 hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                />
              }
            >
              <Trash2Icon className="size-4" />
              Cancel
            </DialogClose>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full sm:w-auto gap-2 rounded-md bg-[#0097b2] px-5 font-medium text-white hover:bg-[#008299] disabled:opacity-50"
            >
              <SaveIcon className="size-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
