import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { Text, Title } from "@/components/ui/typography";
import {
  User,
  Camera,
  Lock,
  Shield,
  Save,
  LogOut,
  Plus,
  LogIn,
  Clock,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { userDetailsFetched, userLoggedOut } from "@/features/auth/authSlice";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "@/features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const getProfileFormState = (user) => ({
  first_name: user?.first_name ?? "",
  last_name: user?.last_name ?? "",
  email: user?.email ?? "",
  phone: user?.phone ?? "",
  profile_picture_url: user?.profile_picture_url ?? "",
});

const ProfileInformationSection = ({ user, dispatch }) => {
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [profileData, setProfileData] = useState(getProfileFormState(user));
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const previewUrlRef = useRef(null);

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    },
    [],
  );

  const initialProfileData = useMemo(() => getProfileFormState(user), [user]);

  const changedProfileData = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(profileData).filter(
          ([key, value]) => value !== initialProfileData[key],
        ),
      ),
    [initialProfileData, profileData],
  );

  const profilePreviewUrl =
    profilePictureFile?.previewUrl || profileData.profile_picture_url;
  const hasProfileChanges =
    Object.keys(changedProfileData).length > 0 || Boolean(profilePictureFile);

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleProfilePictureChange = (file) => {
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setProfilePictureFile({ file, previewUrl });
    setProfileData((prev) => ({ ...prev, profile_picture_url: previewUrl }));
  };

  const handleSaveProfile = async () => {
    if (!hasProfileChanges) return;

    try {
      const payload = new FormData();

      Object.entries(changedProfileData).forEach(([key, value]) => {
        if (key === "profile_picture_url") return;
        payload.append(key, value);
      });

      if (profilePictureFile?.file) {
        payload.append("profile_picture", profilePictureFile.file);
      }

      const response = await updateProfile(payload).unwrap();
      const updatedUser =
        response?.data &&
        typeof response.data === "object" &&
        !Array.isArray(response.data)
          ? response.data
          : null;

      dispatch(
        userDetailsFetched(
          updatedUser
            ? { ...user, ...updatedUser }
            : {
                ...user,
                ...changedProfileData,
                profile_picture_url: profilePictureFile?.previewUrl
                  ? profilePictureFile.previewUrl
                  : user?.profile_picture_url,
              },
        ),
      );

      if (previewUrlRef.current && updatedUser?.profile_picture_url) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setProfilePictureFile(null);

      toast.success(
        response?.message || response?.data?.message || "Profile updated.",
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="bg-white rounded-[30px] p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold">Profile Information</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <label
            htmlFor="profile-picture-upload"
            className="group relative block cursor-pointer"
          >
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleProfilePictureChange(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
              {profilePreviewUrl ? (
                <img
                  src={profilePreviewUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 transition group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </label>
          <div>
            <h3 className="font-medium text-gray-900">Profile Photo</h3>
            <Text className="mt-1 text-sm text-gray-500">
              Click the image to upload a new profile picture.
            </Text>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FloatingInput
            name="first_name"
            label="First Name"
            value={profileData.first_name}
            onChange={(e) => handleProfileChange("first_name", e.target.value)}
          />
          <FloatingInput
            name="last_name"
            label="Last Name"
            value={profileData.last_name}
            onChange={(e) => handleProfileChange("last_name", e.target.value)}
          />
          <FloatingInput
            name="email"
            label="Email Address"
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileChange("email", e.target.value)}
          />
          <FloatingInput
            name="phone"
            label="Phone Number"
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleProfileChange("phone", e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            disabled={!hasProfileChanges || isUpdatingProfile}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSavePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await changePassword(passwordData).unwrap();
      toast.success(
        response?.message || response?.data?.message || "Password changed.",
      );
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password.");
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(userLoggedOut());
    setShowLogoutDialog(false);
  };
  const activityLogs = [
    {
      id: 1,
      title: "Logged in",
      description: "User signed in from Chrome on Windows",
      timestamp: "Nov 21, 2025 • 10:34 AM",
      icon: LogIn,
    },
    {
      id: 2,
      title: "Updated Profile",
      description: "Changed profile picture and display name",
      timestamp: "Nov 21, 2025 • 10:20 AM",
      icon: User,
    },
    {
      id: 3,
      title: "Added a new product",
      description: "Nike Air Zoom added to the store",
      timestamp: "Nov 20, 2025 • 7:12 PM",
      icon: Plus,
    },
    {
      id: 4,
      title: "Changed password",
      description: "User updated security credentials",
      timestamp: "Nov 19, 2025 • 9:45 PM",
      icon: Lock,
    },
    {
      id: 5,
      title: "Logged in",
      description: "User signed in from Chrome on Windows",
      timestamp: "Nov 14, 2025 • 10:34 AM",
      icon: LogIn,
    },
  ];

  return (
    <div className="space-y-5 py-6">
      {/* Header */}
      <div className="flbx">
        <div>
          <Title variant="md">Account Settings</Title>
          <Text className="text-gray-600" variant="sm">
            Manage your account information and preferences
          </Text>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="md:col-span-2 col-span-3 space-y-6">
          <ProfileInformationSection
            key={`${user?.id ?? "guest"}-${user?.profile_picture_url ?? ""}-${user?.email ?? ""}-${user?.phone ?? ""}-${user?.first_name ?? ""}-${user?.last_name ?? ""}`}
            user={user}
            dispatch={dispatch}
          />

          {/* Activity Logs */}
          <div className="bg-white rounded-[30px] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Activity Logs</h2>
            </div>

            <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
              {activityLogs?.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="flbx bg-gray-50 p-3 rounded-lg">
                    <div className="flx gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {log.icon ? (
                          <log.icon className="w-4 h-4 text-primary" />
                        ) : (
                          <Clock className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.title}
                        </p>
                        <Text variant="sm">{log.description}</Text>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {log.timestamp}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 col-span-3 space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-[30px] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>

            <div className="space-y-4 max-w-md">
              <FloatingInput
                name="current_password"
                label="Current Password"
                type="password"
                value={passwordData.current_password}
                onChange={(e) =>
                  handlePasswordChange("current_password", e.target.value)
                }
              />

              <FloatingInput
                name="new_password"
                label="New Password"
                type="password"
                value={passwordData.new_password}
                onChange={(e) =>
                  handlePasswordChange("new_password", e.target.value)
                }
              />
              <p className="-mt-2 text-xs text-black/60">
                Must be at least 8 characters long
              </p>

              <FloatingInput
                name="confirm_password"
                label="Confirm New Password"
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) =>
                  handlePasswordChange("confirm_password", e.target.value)
                }
              />

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSavePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-[30px] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flbx p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <Text variant="sm">
                    Add an extra layer of security to your account
                  </Text>
                </div>
                <button
                  onClick={() =>
                    handlePreferenceChange(
                      "twoFactorAuth",
                      !preferences.twoFactorAuth,
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.twoFactorAuth ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.twoFactorAuth
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Active Sessions
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-gray-500">
                        Chrome on Windows • Dhaka, BD
                      </p>
                    </div>
                    <span className="text-green-600 text-xs font-medium">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-[30px] border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-700 mb-4">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Delete Account</h3>
                  <Text variant="sm">
                    Permanently delete your account and all data
                  </Text>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to sign in again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
