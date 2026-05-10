import React from "react";
import toast from "react-hot-toast";
import {
  ImagePlus,
  ChevronDown,
  ChevronUp,
  HandHeart,
  HeartPulse,
  House,
  LoaderCircle,
  MessageCircle,
  Package,
  PawPrint,
  Plus,
  RotateCcw,
  Search,
  Siren,
  Sparkles,
  Stethoscope,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FloatingInput } from "@/components/ui/input";
import { FloatingTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreatePostMutation } from "@/features/posts/postApiSlice";

const postTypes = [
  {
    value: "HELP_SEEKING",
    label: "Need Help",
    helper:
      "Ask nearby rescuers for urgent rescue, medical, foster, or supplies help.",
    icon: Stethoscope,
  },
  {
    value: "LOST_PET",
    label: "Lost a pet",
    helper: "Share where your pet was last seen and how people can reach you.",
    icon: Search,
  },
  {
    value: "FOUND_PET",
    label: "Found a pet",
    helper: "Help a pet get home by sharing where you found them.",
    icon: PawPrint,
  },
  {
    value: "DISCUSSION",
    label: "Discussion",
    helper: "Start a community question, recommendation thread, or update.",
    icon: MessageCircle,
  },
];

const helpCategories = [
  { label: "Urgent rescue", value: "URGENT_RESCUE", icon: Siren },
  { label: "Medical help", value: "MEDICAL", icon: HeartPulse },
  { label: "Foster needed", value: "FOSTER", icon: House },
  { label: "Transport", value: "TRANSPORT", icon: Truck },
  { label: "Supplies", value: "SUPPLIES", icon: Package },
  { label: "Other", value: "OTHER", icon: HandHeart },
];

const initialFormState = {
  post_type: "",
  lost_found_name: "",
  lost_found_type: "",
  last_seen_at: "",
  last_seen_location: "",
  details: "",
  contact: "",
  help_category: "",
  location: "",
  title: "",
  body: "",
};

const fieldPlaceholders = {
  LOST_PET: {
    title: "Lost pet details",
    description:
      "Add the last seen area, identifying details, and a reachable contact.",
    submit: "Post lost pet",
  },
  FOUND_PET: {
    title: "Found pet details",
    description:
      "Add where you found the pet, current condition, and handoff details.",
    submit: "Post found pet",
  },
  HELP_SEEKING: {
    title: "Help request details",
    description:
      "Describe what happened, where help is needed, and how urgent it is.",
    submit: "Post help request",
  },
  DISCUSSION: {
    title: "Discussion details",
    description: "Ask a question, share advice, or start a community update.",
    submit: "Post discussion",
  },
};

const getImageId = (file) => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${file.name}-${file.size}-${file.lastModified}`;
};

const getLocalOffsetIsoString = (dateTimeValue) => {
  if (!dateTimeValue) return "";

  const date = new Date(dateTimeValue);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMinutes = -date.getTimezoneOffset();
  const direction = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffset = Math.abs(offsetMinutes);
  const hours = String(Math.floor(absoluteOffset / 60)).padStart(2, "0");
  const minutes = String(absoluteOffset % 60).padStart(2, "0");
  const localValue =
    dateTimeValue.length === 16 ? `${dateTimeValue}:00` : dateTimeValue;

  return `${localValue}${direction}${hours}:${minutes}`;
};

const getPayloadByType = (formState) => {
  if (
    formState.post_type === "LOST_PET" ||
    formState.post_type === "FOUND_PET"
  ) {
    return {
      post_type: formState.post_type,
      lost_found_name: formState.lost_found_name,
      lost_found_type: formState.lost_found_type,
      last_seen_at: getLocalOffsetIsoString(formState.last_seen_at),
      last_seen_location: formState.last_seen_location,
      details: formState.details,
      contact: formState.contact,
    };
  }

  if (formState.post_type === "HELP_SEEKING") {
    return {
      post_type: formState.post_type,
      help_category: formState.help_category,
      title: formState.title,
      body: formState.body,
      location: formState.location,
      contact: formState.contact,
    };
  }

  return {
    post_type: formState.post_type,
    title: formState.title,
    body: formState.body,
  };
};

const removeEmptyValues = (payload) =>
  Object.entries(payload).reduce((current, [key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      current[key] = value;
    }

    return current;
  }, {});

const buildPayload = (formState, images) => {
  const normalizedPayload = removeEmptyValues(getPayloadByType(formState));

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

const getInitialFormState = (postType = "") => ({
  ...initialFormState,
  post_type: postType,
});

const CreatePost = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [showFloatingTrigger, setShowFloatingTrigger] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowFloatingTrigger(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <CreatePostComposer />

      {showFloatingTrigger && !dialogOpen ? (
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_18px_40px_rgba(209,70,28,0.32)] transition hover:bg-primary/90"
          aria-label="Create community post"
        >
          <Plus className="size-7" />
        </button>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100vh-2rem)] gap-0 overflow-visible rounded-[24px] border-0 bg-transparent p-0 shadow-none sm:max-w-5xl"
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="absolute right-4 top-4 z-[95] flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm transition hover:bg-white hover:text-slate-900"
              aria-label="Close create post"
            >
              <X className="size-5" />
            </button>
            <DialogTitle className="sr-only">Create community post</DialogTitle>
            <DialogDescription className="sr-only">
              Create a lost pet, found pet, help request, or discussion post.
            </DialogDescription>
            <CreatePostComposer
              key={dialogOpen ? "create-post-dialog-open" : "closed"}
              initialPostType="LOST_PET"
              className="max-h-[calc(100vh-2rem)]"
              onPosted={() => setDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const CreatePostComposer = ({ initialPostType = "", className, onPosted }) => {
  const initialState = React.useMemo(
    () => getInitialFormState(initialPostType),
    [initialPostType],
  );
  const [formState, setFormState] = React.useState(initialState);
  const [images, setImages] = React.useState([]);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);
  const imagePreviewsRef = React.useRef([]);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const selectedType = postTypes.find(
    (type) => type.value === formState.post_type,
  );
  const SelectedTypeIcon = selectedType?.icon;
  const copy = fieldPlaceholders[formState.post_type] || null;
  const selectedHelpCategory = helpCategories.find(
    (category) => category.value === formState.help_category,
  );

  const clearImagePreviews = React.useCallback(() => {
    imagePreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    imagePreviewsRef.current = [];
  }, []);

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

  const handlePostTypeChange = (postType) => {
    if (postType === "HELP_SEEKING") {
      setIsHelpMenuOpen((current) => !current);
      return;
    }

    clearImagePreviews();
    setImages([]);
    setIsHelpMenuOpen(false);

    setFormState((current) => {
      const shouldCollapse = current.post_type === postType;

      return {
        ...initialState,
        post_type: shouldCollapse ? "" : postType,
        help_category: "",
      };
    });
  };

  const handleHelpCategorySelect = (category) => {
    clearImagePreviews();
    setImages([]);
    setIsHelpMenuOpen(false);
    setFormState({
      ...initialState,
      post_type: "HELP_SEEKING",
      help_category: category.value,
    });
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setImages((current) => {
      const availableSlots = Math.max(0, 5 - current.length);
      const selectedFiles = files.slice(0, availableSlots);

      if (files.length > availableSlots) {
        toast.error("You can add up to 5 images.");
      }

      const nextImages = selectedFiles.map((file) => {
        const preview = URL.createObjectURL(file);
        imagePreviewsRef.current.push(preview);

        return {
          id: getImageId(file),
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

  const handleReset = () => {
    clearImagePreviews();
    setImages([]);
    setIsHelpMenuOpen(false);
    setFormState(initialState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.post_type) {
      toast.error("Choose a post type first.");
      return;
    }

    try {
      const request = buildPayload(formState, images);
      const response = await createPost(request).unwrap();
      toast.success(response?.message || "Post created.");
      handleReset();
      onPosted?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create post.");
    }
  };

  return (
    <section
      className={cn(
        "overflow-visible rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_54px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <div className="border-b border-primary/10 bg-[linear-gradient(135deg,_rgba(244,251,247,0.98),_rgba(255,248,240,0.94))] px-5 py-4 sm:px-6 rounded-t-[24px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Share your Post
              </h2>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:w-[38rem] lg:grid-cols-4">
            {postTypes.map((type) => {
              const Icon = type.icon;
              const isActive = formState.post_type === type.value;

              if (type.value === "HELP_SEEKING") {
                return (
                  <div key={type.value} className="relative">
                    <button
                      type="button"
                      onClick={() => handlePostTypeChange(type.value)}
                      className={cn(
                        "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition",
                        isActive || isHelpMenuOpen
                          ? "border-primary bg-primary text-white shadow-[0_12px_24px_rgba(209,70,28,0.2)]"
                          : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-primary/5",
                      )}
                      aria-expanded={isHelpMenuOpen}
                      aria-pressed={isActive}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="min-w-0 truncate">
                        {selectedHelpCategory?.label || type.label}
                      </span>
                      {isHelpMenuOpen ? (
                        <ChevronUp className="size-4 shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 shrink-0" />
                      )}
                    </button>

                    {isHelpMenuOpen ? (
                      <div className="absolute right-0 top-12 z-[90] min-w-max overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                        {helpCategories.map((category) => {
                          const CategoryIcon = category.icon;

                          return (
                            <button
                              key={category.value}
                              type="button"
                              onClick={() => handleHelpCategorySelect(category)}
                              className={cn(
                                "flex w-full items-center gap-2 whitespace-nowrap px-4 py-3 text-left text-sm font-bold transition hover:bg-primary/5",
                                formState.help_category === category.value
                                  ? "text-primary"
                                  : "text-slate-700",
                              )}
                            >
                              <CategoryIcon className="size-4 shrink-0" />
                              {category.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlePostTypeChange(type.value)}
                  className={cn(
                    "flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition",
                    isActive
                      ? "border-primary bg-primary text-white shadow-[0_12px_24px_rgba(209,70,28,0.2)]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-primary/5",
                  )}
                  aria-pressed={isActive}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {formState.post_type ? (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div>
                <div className="flex items-center gap-2 text-slate-900">
                  {SelectedTypeIcon ? (
                    <SelectedTypeIcon className="size-4 text-primary" />
                  ) : null}
                  <h3 className="text-base font-semibold">{copy.title}</h3>
                </div>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {copy.description}
                </p>
              </div>

              {formState.post_type === "LOST_PET" ||
              formState.post_type === "FOUND_PET" ? (
                <LostAndFoundFields
                  formState={formState}
                  onFieldChange={handleFieldChange}
                />
              ) : null}

              {formState.post_type === "HELP_SEEKING" ? (
                <HelpSeekingFields
                  formState={formState}
                  onFieldChange={handleFieldChange}
                />
              ) : null}

              {formState.post_type === "DISCUSSION" ? (
                <DiscussionFields
                  formState={formState}
                  onFieldChange={handleFieldChange}
                />
              ) : null}
            </div>

            <div className="space-y-4 border-t border-slate-100 bg-[#fbfcfb] px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
              <ImageUploader
                images={images}
                onImageSelect={handleImageSelect}
                onRemoveImage={handleRemoveImage}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 rounded-b-[24px]">
            <p className="text-sm text-slate-500">
              No field is required. Add what you know now and update later.
            </p>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-primary/15 bg-white px-4 text-slate-700"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button
                type="submit"
                className="rounded-full px-5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Publishing
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {copy?.submit || "Publish post"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="border-t border-slate-100 px-5 py-5 sm:px-6">
          <p className="text-sm font-medium text-slate-500">
            Pick a post type to open the fields.
          </p>
        </div>
      )}
    </section>
  );
};

const LostAndFoundFields = ({ formState, onFieldChange }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <FloatingInput
      name="lost_found_name"
      label="Pet name"
      value={formState.lost_found_name}
      onChange={(event) => onFieldChange("lost_found_name", event.target.value)}
      placeholder="Buddy"
    />
    <FloatingInput
      name="lost_found_type"
      label="Pet type"
      value={formState.lost_found_type}
      onChange={(event) => onFieldChange("lost_found_type", event.target.value)}
      placeholder="Dog, cat, bird"
    />
    <FloatingInput
      name="last_seen_at"
      label="Last seen date and time"
      type="datetime-local"
      value={formState.last_seen_at}
      onChange={(event) => onFieldChange("last_seen_at", event.target.value)}
    />
    <FloatingInput
      name="last_seen_location"
      label="Last seen location"
      value={formState.last_seen_location}
      onChange={(event) =>
        onFieldChange("last_seen_location", event.target.value)
      }
      placeholder="Dhanmondi, Dhaka"
    />
    <FloatingTextarea
      name="details"
      label="Details"
      value={formState.details}
      onChange={(event) => onFieldChange("details", event.target.value)}
      placeholder="Golden retriever wearing a red collar. Last seen near the lake."
      rows={5}
      className="sm:col-span-2"
    />
    <FloatingInput
      name="contact"
      label="Contact"
      value={formState.contact}
      onChange={(event) => onFieldChange("contact", event.target.value)}
      placeholder="+8801712345678"
      className="sm:col-span-2"
    />
  </div>
);

const HelpSeekingFields = ({ formState, onFieldChange }) => (
  <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2">
      <FloatingInput
        name="title"
        label="Title"
        value={formState.title}
        onChange={(event) => onFieldChange("title", event.target.value)}
        placeholder="Injured cat needs urgent rescue"
        className="sm:col-span-2"
      />
      <FloatingInput
        name="location"
        label="Location"
        value={formState.location}
        onChange={(event) => onFieldChange("location", event.target.value)}
        placeholder="Road 12, Dhanmondi"
      />
      <FloatingInput
        name="contact"
        label="Contact"
        value={formState.contact}
        onChange={(event) => onFieldChange("contact", event.target.value)}
        placeholder="+8801712345678"
      />
    </div>
    <FloatingTextarea
      name="body"
      label="What happened?"
      value={formState.body}
      onChange={(event) => onFieldChange("body", event.target.value)}
      placeholder="There is an injured cat near Road 12. It cannot walk properly and needs help quickly."
      rows={6}
    />
  </div>
);

const DiscussionFields = ({ formState, onFieldChange }) => (
  <div className="space-y-4">
    <FloatingInput
      name="title"
      label="Title"
      value={formState.title}
      onChange={(event) => onFieldChange("title", event.target.value)}
      placeholder="Best low-cost vet clinics in Dhaka?"
    />
    <FloatingTextarea
      name="body"
      label="Message"
      value={formState.body}
      onChange={(event) => onFieldChange("body", event.target.value)}
      placeholder="Looking for recommendations for affordable vet clinics that handle vaccinations and basic treatment."
      rows={6}
    />
  </div>
);

const ImageUploader = ({ images, onImageSelect, onRemoveImage }) => (
  <section className="rounded-[24px] border border-primary/10 bg-white p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-900">
        <ImagePlus className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Photos</h3>
      </div>
      {images.length ? (
        <span className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-bold text-primary">
          {images.length}/5
        </span>
      ) : null}
    </div>

    <label className="mt-4 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-primary/20 bg-[#f8fbf9] px-4 text-center transition hover:border-primary/40 hover:bg-[#f1f8f4]">
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onImageSelect}
        disabled={images.length >= 5}
      />
      <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
        <ImagePlus className="size-5" />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-900">Add post photos</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Upload up to 5 images. You can remove any preview before posting.
      </p>
    </label>

    {images.length ? (
      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-[20px] border border-primary/10 bg-slate-100"
          >
            <img
              src={image.preview}
              alt="Post preview"
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(image.id)}
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              aria-label="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-500">
        <Trash2 className="size-4 text-slate-400" />
        No images selected.
      </div>
    )}
  </section>
);

export default CreatePost;
