"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { PackageIcon, Trash2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { API_BASE_URL, CATEGORIES } from "@/lib/constants";

const categories = CATEGORIES;

type FormState = {
  destinationName: string;
  country: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const initialForm: FormState = {
  destinationName: "",
  country: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

const fieldClassName =
  "h-10 rounded-md border-transparent bg-[#f4f7fa] px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#29abe2]/60 focus-visible:ring-[#29abe2]/25 sm:h-11 md:text-sm";

const triggerClassName =
  "h-10 w-full rounded-md border-transparent bg-[#f4f7fa] px-3 text-sm text-neutral-900 hover:border-transparent focus-visible:border-[#29abe2]/60 focus-visible:ring-[#29abe2]/25 sm:h-11";

function Field({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor} className="text-neutral-900">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function AddDestinationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [category, setCategory] = useState<string>("Beach");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setCategory("Beach");
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = { ...form, category };
    // TODO: send to your API / backend action
    console.log("Add travel package:", payload);

    const res = await fetch(`${API_BASE_URL}/add-destination`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    await res.json();

    setSuccessMessage(`"${form.destinationName}" was added successfully.`);
    setForm(initialForm);
    setCategory("Beach");
  };

  return (
    <div className="mx-auto w-full max-w-360 px-6 py-8 sm:px-10 sm:py-12">
      <h1 className="text-3xl tracking-tight text-neutral-900 sm:text-4xl font-semibold">
        Add New Travel Package
      </h1>

      <Card className="mx-auto mt-7 w-full max-w-2xl py-5 shadow-sm sm:mt-9 sm:py-6">
        <CardContent className="px-5 sm:px-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {successMessage ? (
              <div className="flex items-start justify-between gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <span>{successMessage}</span>
                <button
                  type="button"
                  aria-label="Dismiss message"
                  className="text-emerald-600 transition-colors hover:text-emerald-900"
                  onClick={() => setSuccessMessage(null)}
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ) : null}

            <Field htmlFor="destinationName" label="Destination Name">
              <Input
                id="destinationName"
                name="destinationName"
                placeholder="Bali Paradise"
                value={form.destinationName}
                onChange={(event) =>
                  updateField("destinationName", event.target.value)
                }
                className={fieldClassName}
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field htmlFor="country" label="Country">
                <Input
                  id="country"
                  name="country"
                  placeholder="Indonesia"
                  value={form.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
                  className={fieldClassName}
                  required
                />
              </Field>

              <Field htmlFor="category" label="Category">
                <Select
                  name="category"
                  value={category}
                  onValueChange={(value) => setCategory(value ?? "Beach")}
                >
                  <SelectTrigger id="category" className={triggerClassName}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field htmlFor="price" label="Price (USD)">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  placeholder="e.g., 1299"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  className={fieldClassName}
                  required
                />
              </Field>

              <Field htmlFor="duration" label="Duration">
                <Input
                  id="duration"
                  name="duration"
                  placeholder="e.g., 7 Days/6 Nights"
                  value={form.duration}
                  onChange={(event) =>
                    updateField("duration", event.target.value)
                  }
                  className={fieldClassName}
                />
              </Field>
            </div>

            <Field htmlFor="departureDate" label="Departure Date">
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                value={form.departureDate}
                onChange={(event) =>
                  updateField("departureDate", event.target.value)
                }
                className={cn(
                  fieldClassName,
                  "[&::-webkit-calendar-picker-indicator]:opacity-60",
                )}
              />
            </Field>

            <Field htmlFor="imageUrl" label="Image URL">
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(event) =>
                  updateField("imageUrl", event.target.value)
                }
                className={fieldClassName}
              />
            </Field>

            <Field htmlFor="description" label="Description">
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the travel experience..."
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className={cn(fieldClassName, "min-h-28 resize-y sm:min-h-32")}
              />
            </Field>

            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className={cn(
                  "h-10 w-full gap-2 rounded-md border-red-200 bg-white px-5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 sm:w-auto",
                  "focus-visible:border-red-300 focus-visible:ring-red-200/50",
                )}
              >
                <Trash2Icon />
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-10 w-full gap-2 rounded-md bg-[#29abe2] px-5 text-sm text-white hover:bg-[#2296c4] sm:w-auto"
              >
                <PackageIcon />
                Add Travel Package
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
