import React from "react";
import toast from "react-hot-toast";
import {
  ImagePlus,
  LoaderCircle,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/input";
import {
  FloatingSelect,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FloatingTextarea } from "@/components/ui/textarea";
import { useCreatePetMutation } from "../petApiSlice";

const speciesOptions = [
  { label: "Cat", value: "CAT" },
  { label: "Dog", value: "DOG" },
  { label: "Other", value: "OTHER" },
];

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Unknown", value: "UNKNOWN" },
];

const sizeOptions = [
  { label: "Small", value: "SMALL" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Large", value: "LARGE" },
];

const statusOptions = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Adopted", value: "ADOPTED" },
];

const initialFormState = {
  title: "",
  species: "CAT",
  breed: "",
  gender: "MALE",
  age_months: "",
  size: "SMALL",
  color: "",
  vaccinated: false,
  sterilized: false,
  medical_notes: "",
  temperament: "",
  story: "",
  current_location: "",
  rescue_location: "",
  status: "AVAILABLE",
};

const fieldGroups = [
  { name: "title", label: "Pet name", placeholder: "Milo" },
  { name: "breed", label: "Breed", placeholder: "Domestic Shorthair" },
  {
    name: "age_months",
    label: "Age in months",
    placeholder: "18",
    type: "number",
    min: "0",
  },
  { name: "color", label: "Color", placeholder: "Orange" },
  {
    name: "current_location",
    label: "Current location",
    placeholder: "Dhaka",
  },
  {
    name: "rescue_location",
    label: "Rescue location",
    placeholder: "Banani",
  },
  {
    name: "temperament",
    label: "Temperament",
    placeholder: "Friendly and calm",
  },
];

const buildPayload = (formState, images) => {
  const normalizedPayload = {
    ...formState,
    age_months: Number(formState.age_months),
  };

  if (!images.length) {
    return { payload: normalizedPayload, hasImages: false };
  }

  const formData = new FormData();
  Object.entries(normalizedPayload).forEach(([key, value]) => {
    formData.append(key, value);
  });
  images.forEach((image) => {
    formData.append("images", image.file);
  });

  return { payload: formData, hasImages: true };
};

const CreatePetPostDialog = ({
  trigger,
  title = "Upload pet post",
  description = "Share a rescue case quickly with the key care details adopters need.",
}) => {
  const [open, setOpen] = React.useState(false);
  const [formState, setFormState] = React.useState(initialFormState);
  const [images, setImages] = React.useState([]);
  const imagePreviewsRef = React.useRef([]);
  const [createPet, { isLoading }] = useCreatePetMutation();

  const clearImagePreviews = React.useCallback(() => {
    imagePreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    imagePreviewsRef.current = [];
  }, []);

  const resetDialog = React.useCallback(() => {
    clearImagePreviews();
    setImages([]);
    setFormState(initialFormState);
  }, [clearImagePreviews]);

  React.useEffect(() => {
    if (!open) {
      resetDialog();
    }
  }, [open, resetDialog]);

  React.useEffect(
    () => () => {
      clearImagePreviews();
    },
    [clearImagePreviews],
  );

  const handleFieldChange = (name, value) => {
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setImages((current) => {
      const nextImages = files
        .slice(0, Math.max(0, 5 - current.length))
        .map((file) => {
          const preview = URL.createObjectURL(file);
          imagePreviewsRef.current.push(preview);

          return {
            id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
            file,
            preview,
          };
        });

      return [...current, ...nextImages];
    });

    event.target.value = "";
  };

  const handleRemoveImage = (id) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
        imagePreviewsRef.current = imagePreviewsRef.current.filter(
          (preview) => preview !== target.preview,
        );
      }

      return current.filter((image) => image.id !== id);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formState.title ||
      !formState.breed ||
      !formState.age_months ||
      !formState.current_location ||
      !formState.rescue_location ||
      !formState.story
    ) {
      toast.error("Complete the main pet details before posting.");
      return;
    }

    const age = Number(formState.age_months);
    if (!Number.isFinite(age) || age < 0) {
      toast.error("Age in months must be a valid non-negative number.");
      return;
    }

    try {
      const request = buildPayload(formState, images);
      const response = await createPet(request).unwrap();
      toast.success(response?.message || "Pet post created.");
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create pet post.");
    }
  };

  const quickChecks = [
    {
      key: "vaccinated",
      label: "Vaccinated",
      helper: "Show medical readiness immediately.",
    },
    {
      key: "sterilized",
      label: "Sterilized",
      helper: "Important trust signal for adopters.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-[32px] border-primary/10 p-0 shadow-[0_28px_80px_rgba(2,24,19,0.2)] sm:max-w-4xl">
        <div className="border-b border-primary/10 bg-[linear-gradient(135deg,_rgba(244,251,247,0.98),_rgba(255,248,240,0.94))] px-6 py-5">
          <DialogHeader className="text-left">
            <div className="mb-3 inline-flex rounded-2xl bg-white p-2 text-primary shadow-sm">
              <PawPrint className="size-5" />
            </div>
            <DialogTitle className="text-2xl text-slate-900">{title}</DialogTitle>
            <DialogDescription className="max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex max-h-[calc(100vh-10rem)] flex-col">
          <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="min-h-0 space-y-5 overflow-y-auto border-r border-slate-100 px-6 py-5">
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Quick publish
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FloatingSelect
                    label="Species"
                    value={formState.species}
                    onValueChange={(value) => handleFieldChange("species", value)}
                    placeholder="Select species"
                  >
                    <SelectContent>
                      {speciesOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FloatingSelect>

                  <FloatingSelect
                    label="Gender"
                    value={formState.gender}
                    onValueChange={(value) => handleFieldChange("gender", value)}
                    placeholder="Select gender"
                  >
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FloatingSelect>

                  <FloatingSelect
                    label="Size"
                    value={formState.size}
                    onValueChange={(value) => handleFieldChange("size", value)}
                    placeholder="Select size"
                  >
                    <SelectContent>
                      {sizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FloatingSelect>

                  <FloatingSelect
                    label="Status"
                    value={formState.status}
                    onValueChange={(value) => handleFieldChange("status", value)}
                    placeholder="Select status"
                  >
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </FloatingSelect>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {fieldGroups.map((field) => (
                    <FloatingInput
                      key={field.name}
                      name={field.name}
                      label={field.label}
                      type={field.type || "text"}
                      min={field.min}
                      value={formState[field.name]}
                      onChange={(event) =>
                        handleFieldChange(field.name, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className={
                        field.name === "temperament" ? "sm:col-span-2" : undefined
                      }
                    />
                  ))}
                </div>

                <FloatingTextarea
                  name="story"
                  label="Rescue story"
                  value={formState.story}
                  onChange={(event) => handleFieldChange("story", event.target.value)}
                  placeholder="Rescued from the street after local feeders noticed an injured paw."
                  rows={5}
                />

                <FloatingTextarea
                  name="medical_notes"
                  label="Medical notes"
                  value={formState.medical_notes}
                  onChange={(event) =>
                    handleFieldChange("medical_notes", event.target.value)
                  }
                  placeholder="Healthy, dewormed, and currently on a standard diet."
                  rows={4}
                />
              </section>
            </div>

            <div className="min-h-0 space-y-5 overflow-y-auto bg-[#fbfcfb] px-6 py-5">
              <section className="rounded-[24px] border border-primary/10 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <ImagePlus className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Photos</h3>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Add up to five images. Posts work without photos, but images help adopters act faster.
                </p>

                <label className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-primary/20 bg-[#f8fbf9] px-4 text-center transition hover:border-primary/40 hover:bg-[#f1f8f4]">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
                    <ImagePlus className="size-5" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    Drop in pet photos or browse files
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Front face, full body, and recovery progress usually work best.
                  </p>
                </label>

                {images.length ? (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden rounded-[20px] border border-primary/10"
                      >
                        <img
                          src={image.preview}
                          alt="Pet preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>

              <section className="rounded-[24px] border border-primary/10 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <ShieldCheck className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Trust signals</h3>
                </div>
                <div className="mt-4 space-y-4">
                  {quickChecks.map((item) => (
                    <label
                      key={item.key}
                      className="flex items-start gap-3 rounded-[18px] border border-slate-100 bg-[#f8fbf9] p-3"
                    >
                      <Checkbox
                        checked={formState[item.key]}
                        onCheckedChange={(checked) =>
                          handleFieldChange(item.key, checked === true)
                        }
                        className="mt-1"
                      />
                      <span className="space-y-1">
                        <span className="block text-sm font-medium text-slate-900">
                          {item.label}
                        </span>
                        <span className="block text-sm leading-6 text-slate-500">
                          {item.helper}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-primary/10 bg-white p-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <MapPin className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold">Posting preview</h3>
                </div>
                <div className="mt-4 rounded-[20px] bg-[#f8fbf9] p-4">
                  <p className="text-lg font-semibold text-slate-900">
                    {formState.title || "Pet name"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {[formState.species, formState.breed || "Breed", formState.current_location || "Location"]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {formState.story || "The rescue story will appear here so you can sanity-check the post before publishing."}
                  </p>
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 border-t border-slate-100 bg-white px-6 py-4 sm:justify-between">
            <p className="text-sm text-slate-500">
              Required: name, breed, age, current location, rescue location, and story.
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-primary/15 bg-white px-4 text-slate-700"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full px-5" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Publishing
                  </>
                ) : (
                  <>
                    <PawPrint className="size-4" />
                    Publish pet post
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePetPostDialog;
