import { Button } from "@/components/ui/button";
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
import { FloatingTextarea } from "@/components/ui/textarea";
import { useUpdateProfileMutation } from "@/features/auth/authApiSlice";
import { userDetailsFetched } from "@/features/auth/authSlice";
import { getInitials } from "@/lib/utils";
import { Camera, Save, UserRoundPen } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const UpdateProfileDialog = ({ profile }) => {
  const getProfileFormState = (user) => ({
    name:
      user?.name ||
      `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
      "",
    phone: user?.phone || "",
    location: user?.location || user?.address || "",
    bio: user?.bio || "",
    job_title: user?.job_title || "",
    avatar: user?.avatar || user?.profile_picture_url || "",
    cover:
      user?.cover ||
      user?.cover_image ||
      user?.cover_url ||
      user?.cover_image_url ||
      "",
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState(getProfileFormState(user));
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const avatarPreviewUrlRef = useRef(null);
  const coverPreviewUrlRef = useRef(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const initialFormState = useMemo(() => getProfileFormState(user), [user]);
  const avatarPreview = avatarFile?.previewUrl || formState.avatar;
  const coverPreview = coverFile?.previewUrl || formState.cover;

  useEffect(
    () => () => {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
      }
      if (coverPreviewUrlRef.current) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
      }
    },
    [],
  );

  const changedProfileData = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(formState).filter(
          ([key, value]) => value !== initialFormState[key],
        ),
      ),
    [formState, initialFormState],
  );

  const hasChanges =
    Object.keys(changedProfileData).length > 0 ||
    Boolean(avatarFile) ||
    Boolean(coverFile);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (file) => {
    if (!file) return;

    if (avatarPreviewUrlRef.current) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    avatarPreviewUrlRef.current = previewUrl;
    setAvatarFile({ file, previewUrl });
    setFormState((prev) => ({ ...prev, avatar: previewUrl }));
  };

  const handleCoverChange = (file) => {
    if (!file) return;

    if (coverPreviewUrlRef.current) {
      URL.revokeObjectURL(coverPreviewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    coverPreviewUrlRef.current = previewUrl;
    setCoverFile({ file, previewUrl });
    setFormState((prev) => ({ ...prev, cover: previewUrl }));
  };

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      if (avatarPreviewUrlRef.current) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
        avatarPreviewUrlRef.current = null;
      }
      if (coverPreviewUrlRef.current) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
        coverPreviewUrlRef.current = null;
      }
      setFormState(getProfileFormState(user));
      setAvatarFile(null);
      setCoverFile(null);
    }

    setOpen(nextOpen);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasChanges) return;

    try {
      const payload = new FormData();

      Object.entries(changedProfileData).forEach(([key, value]) => {
        if (key === "avatar" || key === "cover") return;
        payload.append(key, value ?? "");
      });

      if (avatarFile?.file) {
        payload.append("avatar", avatarFile.file);
        payload.append("profile_picture", avatarFile.file);
      }

      if (coverFile?.file) {
        payload.append("cover", coverFile.file);
        payload.append("cover_image", coverFile.file);
      }

      const response = await updateProfile(payload).unwrap();
      const updatedUser =
        response?.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
          ? response.data
          : null;
      const localImageUpdates = {
        ...(avatarFile?.previewUrl
          ? {
              avatar: avatarFile.previewUrl,
              profile_picture_url: avatarFile.previewUrl,
            }
          : {}),
        ...(coverFile?.previewUrl
          ? {
              cover: coverFile.previewUrl,
              cover_image: coverFile.previewUrl,
              cover_image_url: coverFile.previewUrl,
            }
          : {}),
      };

      dispatch(
        userDetailsFetched(
          updatedUser
            ? {
                ...user,
                ...changedProfileData,
                ...localImageUpdates,
                ...updatedUser,
              }
            : {
                ...user,
                ...changedProfileData,
                ...localImageUpdates,
              },
        ),
      );

      if (
        avatarPreviewUrlRef.current &&
        (updatedUser?.avatar || updatedUser?.profile_picture_url)
      ) {
        URL.revokeObjectURL(avatarPreviewUrlRef.current);
        avatarPreviewUrlRef.current = null;
      }
      if (
        coverPreviewUrlRef.current &&
        (updatedUser?.cover ||
          updatedUser?.cover_image ||
          updatedUser?.cover_image_url)
      ) {
        URL.revokeObjectURL(coverPreviewUrlRef.current);
        coverPreviewUrlRef.current = null;
      }

      setAvatarFile(null);
      setCoverFile(null);
      setOpen(false);
      toast.success(response?.message || "Profile updated.");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-4">
          <UserRoundPen className="size-4" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Update profile</DialogTitle>
            <DialogDescription>
              Keep your public profile details clear for adopters and rescuers.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-[#f8fbf9] p-4 sm:flex-row sm:items-center">
            <label
              htmlFor="profile-avatar-upload"
              className="group relative block h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-3xl border-4 border-white bg-white shadow-sm"
            >
              <input
                id="profile-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  handleAvatarChange(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/8 text-xl font-semibold text-primary">
                  {getInitials(profile.name)}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                <Camera className="size-5 text-white" />
              </div>
            </label>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Profile photo
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload a clear avatar that helps people recognize your profile.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-primary/10 bg-[#f8fbf9] p-4">
            <label
              htmlFor="profile-cover-upload"
              className="group relative block h-36 cursor-pointer overflow-hidden rounded-2xl border border-white bg-white shadow-sm"
            >
              <input
                id="profile-cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  handleCoverChange(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(0,79,59,0.92),rgba(19,129,91,0.78),rgba(255,248,240,0.9))] text-sm font-semibold text-white">
                  Add cover photo
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                <Camera className="size-5 text-white" />
              </div>
            </label>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Cover photo
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Upload a wide image for the top of your profile.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FloatingInput
              name="name"
              label="Name"
              value={formState.name}
              onChange={(event) => handleChange("name", event.target.value)}
            />
            <FloatingInput
              name="phone"
              label="Phone"
              type="tel"
              value={formState.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
            />
            <FloatingInput
              name="location"
              label="Location"
              value={formState.location}
              onChange={(event) => handleChange("location", event.target.value)}
            />
            <FloatingInput
              name="job_title"
              label="Job title"
              value={formState.job_title}
              onChange={(event) =>
                handleChange("job_title", event.target.value)
              }
            />
          </div>

          <FloatingTextarea
            name="bio"
            label="Bio"
            value={formState.bio}
            onChange={(event) => handleChange("bio", event.target.value)}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges || isLoading}
              className="rounded-full"
            >
              <Save className="size-4" />
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
