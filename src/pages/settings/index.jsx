import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import {
  Activity,
  BadgeCheck,
  Ban,
  Bell,
  Camera,
  ChevronDown,
  Eye,
  FileText,
  Flag,
  Globe2,
  HeartHandshake,
  KeyRound,
  LifeBuoy,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Moon,
  PawPrint,
  Phone,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  User,
  UserCheck,
  UsersRound,
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
import { useDispatch, useSelector } from "react-redux";
import { cn, fallbackValue, getInitials } from "@/lib/utils";
import {
  getResolvedTheme,
  getStoredThemePreference,
  saveThemePreference,
} from "@/lib/theme";

const getProfileFormState = (user) => ({
  first_name: user?.first_name ?? "",
  last_name: user?.last_name ?? "",
  email: user?.email ?? "",
  phone: user?.phone ?? "",
  profile_picture_url: user?.profile_picture_url ?? user?.avatar ?? "",
});

const getRole = (user) => {
  const normalizedRole = fallbackValue(user?.role, "adopter").toLowerCase();
  return normalizedRole.includes("rescu") ? "rescuer" : "adopter";
};

const getFullName = (user) =>
  fallbackValue(
    user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
    "Guest Member",
  );

const settingsSections = [
  {
    id: "profile",
    label: "Profile",
    description: "Identity and password",
    icon: User,
    gradient: "linear-gradient(135deg, #0f766e, #22c55e)",
  },
  {
    id: "trust",
    label: "Trust",
    description: "Public confidence",
    icon: BadgeCheck,
    gradient: "linear-gradient(135deg, #2563eb, #06b6d4)",
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Visibility",
    icon: Eye,
    gradient: "linear-gradient(135deg, #7c3aed, #ec4899)",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Alerts",
    icon: Bell,
    gradient: "linear-gradient(135deg, #f97316, #facc15)",
  },
  {
    id: "safety",
    label: "Safety",
    description: "Reports",
    icon: Flag,
    gradient: "linear-gradient(135deg, #dc2626, #fb7185)",
  },
];

const ProfileInformationSection = ({
  user,
  dispatch,
  passwordData,
  onPasswordChange,
  onSavePassword,
  isChangingPassword,
  onAccountAction,
  themePreference,
  resolvedTheme,
  onThemePreferenceChange,
}) => {
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [profileData, setProfileData] = useState(getProfileFormState(user));
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [activeProfilePanel, setActiveProfilePanel] = useState("identity");
  const [securityPopup, setSecurityPopup] = useState(null);
  const [appearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
  const previewUrlRef = useRef(null);
  const role = getRole(user);
  const fullName = getFullName(user);

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

  const profilePanels = [
    {
      id: "identity",
      label: "Identity",
      description: "Name and contact",
      icon: User,
    },
    {
      id: "security",
      label: "Security",
      description: "Password and protection",
      icon: Shield,
    },
    {
      id: "account",
      label: "Account",
      description: "Pause or delete",
      icon: Trash2,
      tone: "danger",
    },
  ];

  const themeOptions = [
    {
      id: "light",
      label: "Light",
      description: "Bright and clean",
      icon: Sun,
      gradient: "linear-gradient(135deg, #f97316, #facc15)",
    },
    {
      id: "dark",
      label: "Dark",
      description: "Low-light mode",
      icon: Moon,
      gradient: "linear-gradient(135deg, #334155, #7c3aed)",
    },
    {
      id: "system",
      label: "System",
      description: `Using ${resolvedTheme}`,
      icon: Monitor,
      gradient: "linear-gradient(135deg, #0f766e, #06b6d4)",
    },
  ];

  const selectedTheme =
    themeOptions.find((option) => option.id === themePreference) ??
    themeOptions[2];
  const activeProfilePanelMeta =
    profilePanels.find((panel) => panel.id === activeProfilePanel) ??
    profilePanels[0];
  const recognitionStats = [
    {
      label: "Pets helped",
      value: fallbackValue(user?.stats?.pets_helped, "18"),
      icon: PawPrint,
    },
    {
      label: "Adoptions",
      value: fallbackValue(user?.stats?.adoptions, "7"),
      icon: HeartHandshake,
    },
    {
      label: "Thanks",
      value: fallbackValue(user?.stats?.thanks, "42"),
      icon: MessageCircle,
    },
    {
      label: "Trust score",
      value: fallbackValue(user?.stats?.trust_score, "91%"),
      icon: BadgeCheck,
    },
  ];

  return (
    <SectionCard
      id="profile"
      icon={User}
      eyebrow="Personal hub"
      title="Profile"
      description="Identity, sign-in, and account control in one place."
      action={
        <ProfileAppearanceDropdown
          isOpen={appearanceMenuOpen}
          onOpenChange={setAppearanceMenuOpen}
          onThemePreferenceChange={onThemePreferenceChange}
          selectedTheme={selectedTheme}
          themeOptions={themeOptions}
          themePreference={themePreference}
        />
      }
    >
      <ProfileSummaryCard
        activePanelId={activeProfilePanel}
        email={profileData.email}
        fullName={fullName}
        onProfilePictureChange={handleProfilePictureChange}
        onPanelChange={setActiveProfilePanel}
        panels={profilePanels}
        phone={profileData.phone}
        profilePreviewUrl={profilePreviewUrl}
        role={role}
        stats={recognitionStats}
      />

      <div className="mt-5 rounded-[28px] border border-slate-100 bg-[#fcfdfc] p-4 dark:border-white/10 dark:bg-white/5 sm:p-5">
        <div className="mb-5 flex items-center gap-3">
          <ProfileDropdownIcon panel={activeProfilePanelMeta} />
          <div>
            <h3 className="text-base font-semibold text-slate-950 dark:text-white">
              {activeProfilePanelMeta.label}
            </h3>
            <p className="text-sm text-slate-500 dark:text-white/60">
              {activeProfilePanelMeta.description}
            </p>
          </div>
        </div>

        {activeProfilePanel === "identity" && (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInput
                name="first_name"
                label="First name"
                value={profileData.first_name}
                onChange={(event) =>
                  handleProfileChange("first_name", event.target.value)
                }
              />
              <FloatingInput
                name="last_name"
                label="Last name"
                value={profileData.last_name}
                onChange={(event) =>
                  handleProfileChange("last_name", event.target.value)
                }
              />
              <FloatingInput
                name="email"
                label="Email address"
                type="email"
                value={profileData.email}
                onChange={(event) =>
                  handleProfileChange("email", event.target.value)
                }
              />
              <FloatingInput
                name="phone"
                label="Phone number"
                type="tel"
                value={profileData.phone}
                onChange={(event) =>
                  handleProfileChange("phone", event.target.value)
                }
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
                disabled={!hasProfileChanges || isUpdatingProfile}
                className="rounded-full px-5"
              >
                <Save className="size-4" />
                {isUpdatingProfile ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}

        {activeProfilePanel === "security" && (
          <div className="grid gap-4 md:grid-cols-2">
            <SecurityPopupCard
              icon={KeyRound}
              title="Change password"
              description="Open password controls"
              gradient="linear-gradient(135deg, #0f766e, #22c55e)"
              onClick={() => setSecurityPopup("password")}
            />
            <SecurityPopupCard
              icon={Shield}
              title="Protection"
              description="View access status"
              gradient="linear-gradient(135deg, #2563eb, #06b6d4)"
              onClick={() => setSecurityPopup("protection")}
            />

            <Dialog
              open={securityPopup === "password"}
              onOpenChange={(open) =>
                setSecurityPopup(open ? "password" : null)
              }
            >
              <DialogContent className="max-w-2xl rounded-[28px] border-primary/10 bg-white p-0 dark:border-white/10 dark:bg-slate-950">
                <div className="overflow-hidden rounded-[28px]">
                  <div className="bg-[linear-gradient(135deg,#004f3b,#0f766e,#d9f99d)] p-5 text-white">
                    <div className="flex items-center gap-3">
                      <IconBubble
                        icon={KeyRound}
                        gradient="linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12))"
                        className="size-12 rounded-[18px] ring-1 ring-white/25"
                      />
                      <div>
                        <DialogTitle className="text-white">
                          Change password
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-white/75">
                          Keep your sign-in private.
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <FloatingInput
                      name="current_password"
                      label="Current password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={(event) =>
                        onPasswordChange(
                          "current_password",
                          event.target.value,
                        )
                      }
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FloatingInput
                        name="new_password"
                        label="New password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={(event) =>
                          onPasswordChange("new_password", event.target.value)
                        }
                      />
                      <FloatingInput
                        name="confirm_password"
                        label="Confirm password"
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(event) =>
                          onPasswordChange(
                            "confirm_password",
                            event.target.value,
                          )
                        }
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="rounded-full bg-white dark:bg-white/10"
                        onClick={() => setSecurityPopup(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={onSavePassword}
                        disabled={isChangingPassword}
                        className="rounded-full"
                      >
                        <Save className="size-4" />
                        {isChangingPassword ? "Changing..." : "Save password"}
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={securityPopup === "protection"}
              onOpenChange={(open) =>
                setSecurityPopup(open ? "protection" : null)
              }
            >
              <DialogContent className="max-w-xl rounded-[28px] border-primary/10 bg-white p-0 dark:border-white/10 dark:bg-slate-950">
                <div className="overflow-hidden rounded-[28px]">
                  <div className="bg-[linear-gradient(135deg,#2563eb,#06b6d4)] p-5 text-white">
                    <div className="flex items-center gap-3">
                      <IconBubble
                        icon={Shield}
                        gradient="linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12))"
                        className="size-12 rounded-[18px] ring-1 ring-white/25"
                      />
                      <div>
                        <DialogTitle className="text-white">
                          Protection
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-white/75">
                          Account access status.
                        </DialogDescription>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-2">
                    <SecurityStatus
                      icon={ShieldCheck}
                      title="Two-factor"
                      status="Ready to enable"
                      gradient="linear-gradient(135deg, #2563eb, #06b6d4)"
                    />
                    <SecurityStatus
                      icon={Smartphone}
                      title="Current device"
                      status="Active now"
                      gradient="linear-gradient(135deg, #16a34a, #84cc16)"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {activeProfilePanel === "account" && (
          <div className="grid gap-4 md:grid-cols-2">
            <AccountControlCard
              icon={LogOut}
              title="Pause profile"
              description="Hide your profile while keeping your account."
              action="Deactivate"
              variant="outline"
              onClick={() => onAccountAction("Deactivation request")}
            />
            <AccountControlCard
              icon={Trash2}
              title="Delete account"
              description="Request permanent account deletion."
              action="Delete"
              variant="destructive"
              onClick={() => onAccountAction("Delete account request")}
            />
          </div>
        )}

      </div>
    </SectionCard>
  );
};

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const role = getRole(user);
  const [activeSection, setActiveSection] = useState(settingsSections[0].id);
  const [themePreference, setThemePreference] = useState(
    getStoredThemePreference,
  );
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getResolvedTheme(getStoredThemePreference()),
  );

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showContactAfterMatch: true,
    hideExactLocation: true,
    allowTagging: true,
  });

  const [trustSettings, setTrustSettings] = useState({
    showVerifiedBadge: true,
    requireMessageIntro: true,
    rescueCredentialVisible: role === "rescuer",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    adoptionMessages: true,
    rescueAlerts: role === "rescuer",
    applicationUpdates: true,
    safetyModeration: true,
    weeklyDigest: false,
  });

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const updateResolvedTheme = () => {
      setResolvedTheme(saveThemePreference(themePreference));
    };

    updateResolvedTheme();

    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    systemThemeQuery.addEventListener("change", updateResolvedTheme);

    return () => {
      systemThemeQuery.removeEventListener("change", updateResolvedTheme);
    };
  }, [themePreference]);

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

  const handleSettingChange = (setter, field, value) => {
    setter((current) => ({ ...current, [field]: value }));
  };

  const handleSaveLocalSettings = (label) => {
    toast.success(`${label} updated.`);
  };

  const handleLogout = () => {
    dispatch(userLoggedOut());
    setShowLogoutDialog(false);
  };

  const activityLogs = [
    {
      id: 1,
      title: "Signed in",
      description: "Current session started from a trusted browser.",
      timestamp: "Today at 10:34 AM",
      icon: LogIn,
    },
    {
      id: 2,
      title: "Profile reviewed",
      description: "Contact visibility and location privacy were checked.",
      timestamp: "Today at 10:20 AM",
      icon: UserCheck,
    },
    {
      id: 3,
      title: role === "rescuer" ? "Rescue alerts enabled" : "Adoption alerts enabled",
      description:
        role === "rescuer"
          ? "You will receive urgent nearby rescue updates."
          : "You will receive updates about matching pets.",
      timestamp: "Yesterday at 7:12 PM",
      icon: Bell,
    },
    {
      id: 4,
      title: "Password protected",
      description: "Account security settings are available for review.",
      timestamp: "Nov 19, 2025 at 9:45 PM",
      icon: Lock,
    },
  ];

  return (
    <div className="py-6">
      <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white dark:border-white/10 dark:bg-slate-950">
        <div className="bg-[linear-gradient(135deg,_rgba(244,251,247,0.96),_rgba(255,255,255,0.98))] p-4 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.98))] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">
                <ShieldCheck className="size-3.5" />
                Settings
              </div>
              <h1 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white md:text-3xl">
                Account cawntrols
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-white/60">
                Keep your profile, privacy, alerts, and safety tools simple.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => setShowLogoutDialog(true)}
                className="rounded-full"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <SettingsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="min-w-0 space-y-5">
          {activeSection === "profile" && (
            <ProfileInformationSection
              key={`${user?.id ?? "guest"}-${user?.profile_picture_url ?? ""}-${user?.email ?? ""}-${user?.phone ?? ""}-${user?.first_name ?? ""}-${user?.last_name ?? ""}`}
              user={user}
              dispatch={dispatch}
              passwordData={passwordData}
              onPasswordChange={handlePasswordChange}
              onSavePassword={handleSavePassword}
              isChangingPassword={isChangingPassword}
              onAccountAction={handleSaveLocalSettings}
              themePreference={themePreference}
              resolvedTheme={resolvedTheme}
              onThemePreferenceChange={setThemePreference}
            />
          )}

          {activeSection === "trust" && (
            <SectionCard
              id="trust"
              icon={BadgeCheck}
              eyebrow="Public trust"
              title="Trust"
              description="Show useful trust signals without exposing private details."
              action={
                <Button
                  variant="outline"
                  className="rounded-full bg-white dark:bg-white/10"
                  onClick={() => handleSaveLocalSettings("Trust settings")}
                >
                  <Save className="size-4" />
                  Save trust
                </Button>
              }
            >
            <div className="grid gap-3 md:grid-cols-3">
                <ToggleRow
                  icon={BadgeCheck}
                  title="Verified badge"
                  checked={trustSettings.showVerifiedBadge}
                  onCheckedChange={(value) =>
                    handleSettingChange(setTrustSettings, "showVerifiedBadge", value)
                  }
                />
                <ToggleRow
                  icon={MessageCircle}
                  title="Message intro"
                  checked={trustSettings.requireMessageIntro}
                  onCheckedChange={(value) =>
                    handleSettingChange(
                      setTrustSettings,
                      "requireMessageIntro",
                      value,
                    )
                  }
                />
                <ToggleRow
                  icon={FileText}
                  title="Credential summary"
                  checked={trustSettings.rescueCredentialVisible}
                  onCheckedChange={(value) =>
                    handleSettingChange(
                      setTrustSettings,
                      "rescueCredentialVisible",
                      value,
                    )
                  }
                />
            </div>
            </SectionCard>
          )}

          {activeSection === "privacy" && (
            <SectionCard
              id="privacy"
              icon={Eye}
              eyebrow="Social privacy"
              title="Privacy"
              description="Choose what people can see before you approve contact."
              action={
                <Button
                  variant="outline"
                  className="rounded-full bg-white dark:bg-white/10"
                  onClick={() => handleSaveLocalSettings("Privacy settings")}
                >
                  <Save className="size-4" />
                  Save privacy
                </Button>
              }
            >
            <div className="grid gap-3 md:grid-cols-2">
              <ToggleRow
                icon={Globe2}
                title="Public profile"
                checked={privacySettings.publicProfile}
                onCheckedChange={(value) =>
                  handleSettingChange(setPrivacySettings, "publicProfile", value)
                }
              />
              <ToggleRow
                icon={Phone}
                title="Match-only contact"
                checked={privacySettings.showContactAfterMatch}
                onCheckedChange={(value) =>
                  handleSettingChange(
                    setPrivacySettings,
                    "showContactAfterMatch",
                    value,
                  )
                }
              />
              <ToggleRow
                icon={MapPin}
                title="Hide exact location"
                checked={privacySettings.hideExactLocation}
                onCheckedChange={(value) =>
                  handleSettingChange(setPrivacySettings, "hideExactLocation", value)
                }
              />
              <ToggleRow
                icon={UsersRound}
                title="Mentions and tags"
                checked={privacySettings.allowTagging}
                onCheckedChange={(value) =>
                  handleSettingChange(setPrivacySettings, "allowTagging", value)
                }
              />
            </div>
            </SectionCard>
          )}

          {activeSection === "notifications" && (
            <SectionCard
              id="notifications"
              icon={Bell}
              eyebrow="Alerts"
              title="Notifications"
              description="Choose the updates that deserve your attention."
              action={
                <Button
                  variant="outline"
                  className="rounded-full bg-white dark:bg-white/10"
                  onClick={() => handleSaveLocalSettings("Notification settings")}
                >
                  <Save className="size-4" />
                  Save alerts
                </Button>
              }
            >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <NotificationCard
                icon={MessageCircle}
                title="Messages"
                detail="Chats and replies"
                gradient="linear-gradient(135deg, #2563eb, #06b6d4)"
                checked={notificationSettings.adoptionMessages}
                onCheckedChange={(value) =>
                  handleSettingChange(
                    setNotificationSettings,
                    "adoptionMessages",
                    value,
                  )
                }
              />
              <NotificationCard
                icon={PawPrint}
                title="Pet matches"
                detail="Saved search updates"
                gradient="linear-gradient(135deg, #16a34a, #84cc16)"
                checked={notificationSettings.applicationUpdates}
                onCheckedChange={(value) =>
                  handleSettingChange(
                    setNotificationSettings,
                    "applicationUpdates",
                    value,
                  )
                }
              />
              <NotificationCard
                icon={LifeBuoy}
                title="Rescue alerts"
                detail="Nearby urgent needs"
                gradient="linear-gradient(135deg, #f97316, #facc15)"
                checked={notificationSettings.rescueAlerts}
                onCheckedChange={(value) =>
                  handleSettingChange(setNotificationSettings, "rescueAlerts", value)
                }
              />
              <NotificationCard
                icon={ShieldCheck}
                title="Safety"
                detail="Reports and account notices"
                gradient="linear-gradient(135deg, #dc2626, #fb7185)"
                checked={notificationSettings.safetyModeration}
                onCheckedChange={(value) =>
                  handleSettingChange(
                    setNotificationSettings,
                    "safetyModeration",
                    value,
                  )
                }
              />
              <NotificationCard
                icon={Mail}
                title="Weekly digest"
                detail="Email summary"
                gradient="linear-gradient(135deg, #7c3aed, #ec4899)"
                checked={notificationSettings.weeklyDigest}
                onCheckedChange={(value) =>
                  handleSettingChange(
                    setNotificationSettings,
                    "weeklyDigest",
                    value,
                  )
                }
              />
            </div>
            </SectionCard>
          )}

          {activeSection === "safety" && (
            <SectionCard
              id="safety"
              icon={Flag}
              eyebrow="Community safety"
              title="Safety"
              description="Manage reports, blocks, and meet-up support."
            >
            <div className="grid gap-3 md:grid-cols-2">
              <ActionRow
                icon={Flag}
                title="Report history"
                description="Filed and received reports."
                action="Open"
              />
              <ActionRow
                icon={Ban}
                title="Blocked accounts"
                description="People who cannot contact you."
                action="Manage"
              />
              <ActionRow
                icon={LifeBuoy}
                title="Emergency rescue contacts"
                description="Trusted rescue helpers."
                action="Edit"
              />
              <ActionRow
                icon={ShieldCheck}
                title="Meet-up safety guide"
                description="Handoffs and visits."
                action="View"
              />
            </div>

            <div className="mt-4 overflow-hidden rounded-[24px] border border-primary/10 dark:border-white/10">
              <div className="border-b border-slate-100 bg-[#f7fbf8] px-5 py-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                    Recent account activity
                  </h3>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/10">
                {activityLogs.map((log) => (
                  <ActivityLog key={log.id} log={log} />
                ))}
              </div>
            </div>
            </SectionCard>
          )}

        </main>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to
              access your adoption messages, rescue alerts, and saved pets.
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

const SettingsNavigation = ({ activeSection, onSectionChange }) => {
  return (
    <aside className="xl:block">
      <div className="sticky top-5 rounded-[30px] border border-primary/10 bg-white p-3 shadow-[0_16px_50px_rgba(2,24,19,0.05)] dark:border-white/10 dark:bg-slate-950">
        <div className="hidden px-2 pb-3 pt-2 xl:block">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Settings
          </p>
          <h2 className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
            Quick access
          </h2>
        </div>
        <nav
          aria-label="Settings sections"
          className="custom-horizontal-scrollbar flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-1 xl:overflow-visible xl:pb-0"
        >
          {settingsSections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "group flex min-w-[190px] items-center gap-3 rounded-2xl px-3 py-3 text-left transition xl:min-w-0 xl:w-full",
                  isActive
                    ? "bg-primary text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "text-slate-900 hover:bg-[#f7fbf8] dark:text-white dark:hover:bg-white/10",
                )}
              >
                <IconBubble
                  icon={section.icon}
                  gradient={section.gradient}
                  className={cn(
                    "size-9",
                    isActive && "ring-1 ring-white/25",
                  )}
                  iconClassName="size-4"
                />
                <span>
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      isActive
                        ? "text-white dark:text-slate-950"
                        : "text-slate-900 dark:text-white",
                    )}
                  >
                    {section.label}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

const SectionCard = ({
  id,
  icon,
  eyebrow,
  title,
  description,
  action,
  children,
}) => {
  const section = settingsSections.find((item) => item.id === id);

  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-[30px] border border-primary/10 bg-white p-5 shadow-[0_16px_50px_rgba(2,24,19,0.05)] dark:border-white/10 dark:bg-slate-950 sm:p-6"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3">
          <IconBubble icon={icon} gradient={section?.gradient} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600 dark:text-white/60">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
};

const ToggleRow = ({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  gradient,
}) => {
  return (
    <div className="flex gap-3 rounded-[24px] border border-slate-100 bg-white p-4 transition hover:border-primary/20 hover:bg-[#fbfdfb] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
      <IconBubble
        icon={icon}
        gradient={gradient}
        className="mt-0.5 size-10 rounded-2xl"
        iconClassName="size-4"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-white/60">
                {description}
              </p>
            )}
          </div>
          <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
      </div>
    </div>
  );
};

const Switch = ({ checked, onCheckedChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        checked
          ? "bg-emerald-500 dark:bg-emerald-500"
          : "bg-rose-100 dark:bg-rose-500/25",
      )}
    >
      <span
        className={cn(
          "inline-block size-4 rounded-full transition-all",
          checked
            ? "translate-x-6 bg-lime-300 shadow-[0_3px_10px_rgba(132,204,22,0.42)]"
            : "translate-x-1 bg-rose-500 shadow-[0_3px_10px_rgba(244,63,94,0.32)]",
        )}
      />
    </button>
  );
};

const ProfileDropdownIcon = ({ panel }) => {
  const isDanger = panel.tone === "danger";

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl",
        isDanger
          ? "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300"
          : "bg-primary/10 text-primary dark:bg-primary/15 dark:text-emerald-300",
      )}
    >
      {React.createElement(panel.icon, { className: "size-4" })}
    </span>
  );
};

const ProfileSummaryCard = ({
  activePanelId,
  email,
  fullName,
  onProfilePictureChange,
  onPanelChange,
  panels,
  phone,
  profilePreviewUrl,
  role,
  stats,
}) => {
  const focusAreas = [
    {
      label: role === "rescuer" ? "Rescue response" : "Adoption matches",
      value: "76%",
      icon: HeartHandshake,
    },
    {
      label: "Safety follow-ups",
      value: "64%",
      icon: ShieldCheck,
    },
    {
      label: "Pet updates",
      value: "52%",
      icon: PawPrint,
    },
    {
      label: "Community replies",
      value: "38%",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-100 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="grid lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-slate-100 bg-[#fbfdfb] p-6 dark:border-white/10 dark:bg-white/5 lg:border-b-0 lg:border-r">
          <div className="flex flex-col items-center text-center">
            <label
              htmlFor="profile-picture-upload"
              className="group relative block size-36 cursor-pointer overflow-visible rounded-full"
            >
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  onProfilePictureChange(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
              <span className="block size-full overflow-hidden rounded-full border-[10px] border-amber-300 bg-primary/10 shadow-[0_18px_45px_rgba(15,118,110,0.16)] dark:border-amber-400/80">
                {profilePreviewUrl ? (
                  <img
                    src={profilePreviewUrl}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-4xl font-semibold text-primary">
                    {getInitials(fullName)}
                  </span>
                )}
              </span>
              <span className="absolute -right-1 bottom-2 flex size-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fb7185,#f97316)] text-white shadow-[0_12px_26px_rgba(244,63,94,0.35)] transition group-hover:scale-105">
                <Plus className="size-6" />
              </span>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/35 opacity-0 transition group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>
            </label>

            <h3 className="mt-6 max-w-full truncate text-2xl font-semibold text-slate-950 dark:text-white">
              {fullName}
            </h3>
            <span className="mt-2 inline-flex rounded-full border border-primary/10 bg-white px-3 py-1 text-xs font-semibold capitalize text-primary dark:border-white/10 dark:bg-white/10 dark:text-emerald-200">
              {role} profile
            </span>

            <div className="mt-7 w-full space-y-2 text-left">
              <ProfileContactLine
                icon={Mail}
                label={email || "Email not added"}
              />
              <ProfileContactLine
                icon={Phone}
                label={phone || "Phone not added"}
              />
              <ProfileContactLine icon={MapPin} label="Area-level location" />
            </div>
          </div>
        </aside>

        <div className="relative p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(135deg,rgba(240,253,244,0.95),rgba(240,249,255,0.95))] dark:bg-[linear-gradient(135deg,rgba(6,78,59,0.24),rgba(15,23,42,0.92))]" />

          <div className="relative">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Social recognition
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
                  Community impact
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
                  Numbers people can quickly recognize on your public profile.
                </p>
              </div>
              <span className="w-fit rounded-full border border-primary/10 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm dark:border-white/10 dark:bg-slate-950 dark:text-emerald-200">
                Last 30 days
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <ProfileStat key={stat.label} stat={stat} />
              ))}
            </div>

            <div className="mt-5 rounded-[26px] border border-slate-100 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-950">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-950 dark:text-white">
                    Where this profile shines
                  </h4>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/60">
                    A compact public-facing activity mix.
                  </p>
                </div>
                <BadgeCheck className="size-5 text-primary" />
              </div>

              <div className="mt-4 space-y-3">
                {focusAreas.map((area) => (
                  <ProfileFocusBar key={area.label} area={area} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfilePanelTabs
        activePanelId={activePanelId}
        onPanelChange={onPanelChange}
        panels={panels}
      />
    </div>
  );
};

const ProfilePanelTabs = ({ activePanelId, onPanelChange, panels }) => {
  return (
    <div className="border-t border-slate-100 bg-[#fbfdfb] p-3 dark:border-white/10 dark:bg-white/5">
      <div
        role="tablist"
        aria-label="Profile settings sections"
        className="grid gap-2 sm:grid-cols-3"
      >
        {panels.map((panel) => {
          const isActive = panel.id === activePanelId;

          return (
            <button
              key={panel.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onPanelChange(panel.id)}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-[22px] border px-3 py-3 text-left transition",
                isActive
                  ? "border-primary/25 bg-white shadow-sm dark:border-primary/30 dark:bg-slate-950"
                  : "border-transparent hover:border-primary/10 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-slate-950/70",
              )}
            >
              <ProfileDropdownIcon panel={panel} />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-sm font-semibold",
                    isActive
                      ? "text-primary dark:text-emerald-300"
                      : "text-slate-950 dark:text-white",
                  )}
                >
                  {panel.label}
                </span>
                <span className="block truncate text-xs text-slate-500 dark:text-white/60">
                  {panel.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProfileContactLine = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-white/60">
      {React.createElement(icon, { className: "size-4 shrink-0 text-primary" })}
      <span className="min-w-0 truncate">{label}</span>
    </div>
  );
};

const ProfileStat = ({ stat }) => {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_16px_34px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-emerald-300">
          {React.createElement(stat.icon, { className: "size-4" })}
        </span>
        <span className="text-2xl font-semibold text-slate-950 dark:text-white">
          {stat.value}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-white/50">
        {stat.label}
      </p>
    </div>
  );
};

const ProfileFocusBar = ({ area }) => {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="flex min-w-0 items-center gap-2 font-medium text-slate-700 dark:text-white/75">
          {React.createElement(area.icon, {
            className: "size-4 shrink-0 text-primary",
          })}
          <span className="truncate">{area.label}</span>
        </span>
        <span className="shrink-0 font-semibold text-slate-950 dark:text-white">
          {area.value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: area.value }}
        />
      </div>
    </div>
  );
};

const ProfileAppearanceDropdown = ({
  isOpen,
  onOpenChange,
  onThemePreferenceChange,
  selectedTheme,
  themeOptions,
  themePreference,
}) => {
  return (
    <div className="relative w-full min-w-[220px] sm:w-[230px] lg:text-right">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
        Appearance
      </p>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => onOpenChange((open) => !open)}
        className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-[#f7fbf8] px-3 py-2.5 text-left shadow-sm transition hover:border-primary/25 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-emerald-300">
            {React.createElement(selectedTheme.icon, { className: "size-4" })}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-950 dark:text-white">
              {selectedTheme.label}
            </span>
            <span className="block truncate text-xs text-slate-500 dark:text-white/60">
              {selectedTheme.description}
            </span>
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-primary transition",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-2xl border border-primary/10 bg-white p-1 text-left shadow-xl dark:border-white/10 dark:bg-slate-950"
        >
          {themeOptions.map((option) => {
            const isSelected = option.id === themePreference;

            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  onThemePreferenceChange(option.id);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition",
                  isSelected
                    ? "bg-primary/10 dark:bg-white/10"
                    : "hover:bg-[#f7fbf8] dark:hover:bg-white/5",
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/15 dark:text-emerald-300">
                  {React.createElement(option.icon, { className: "size-4" })}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                    {option.label}
                  </span>
                  <span className="block truncate text-xs text-slate-500 dark:text-white/60">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const AccountControlCard = ({
  icon,
  title,
  description,
  action,
  variant,
  onClick,
}) => {
  const isDanger = variant === "destructive";

  return (
    <div
      className={cn(
        "rounded-[24px] border p-5",
        isDanger
          ? "border-red-200 bg-red-50/70 dark:border-red-500/30 dark:bg-red-500/10"
          : "border-slate-100 bg-[#fbfdfb] dark:border-white/10 dark:bg-white/5",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <IconBubble
          icon={icon}
          gradient={
            isDanger
              ? "linear-gradient(135deg, #dc2626, #fb7185)"
              : "linear-gradient(135deg, #334155, #64748b)"
          }
        />
        <Button
          type="button"
          variant={variant}
          size="sm"
          className={cn("rounded-full", !isDanger && "bg-white dark:bg-white/10")}
          onClick={onClick}
        >
          {action}
        </Button>
      </div>
      <h3
        className={cn(
          "mt-5 text-base font-semibold",
          isDanger ? "text-red-800 dark:text-red-200" : "text-slate-950 dark:text-white",
        )}
      >
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-white/60">
        {description}
      </p>
    </div>
  );
};

const NotificationCard = ({
  icon,
  title,
  detail,
  gradient,
  checked,
  onCheckedChange,
}) => {
  return (
    <div className="rounded-[24px] border border-slate-100 bg-white p-4 transition hover:border-primary/20 hover:shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <IconBubble icon={icon} gradient={gradient} />
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
          {detail}
        </p>
      </div>
    </div>
  );
};

const SecurityPopupCard = ({ icon, title, description, gradient, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-32 items-center justify-between gap-4 rounded-[26px] border border-primary/10 bg-[#f7fbf8] p-5 text-left transition hover:border-primary/25 hover:bg-[#f2faf6] hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <div className="flex items-center gap-4">
        <IconBubble
          icon={icon}
          gradient={gradient}
          className="size-14 rounded-[20px]"
        />
        <div>
          <h3 className="text-base font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm transition group-hover:translate-y-0.5 dark:bg-white/10 dark:text-white">
        <ChevronDown className="size-4" />
      </span>
    </button>
  );
};

const SecurityStatus = ({ icon, title, status, gradient }) => {
  return (
    <div className="flex min-h-28 items-center rounded-[24px] border border-primary/10 bg-[#f7fbf8] p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-4">
        <IconBubble
          icon={icon}
          gradient={gradient}
          className="size-12 rounded-[18px]"
        />
        <div>
          <h3 className="text-base font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-primary">{status}</p>
        </div>
      </div>
    </div>
  );
};

const IconBubble = ({
  icon,
  gradient = "linear-gradient(135deg, #0f766e, #22c55e)",
  className,
  iconClassName,
}) => {
  return (
    <span
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm",
        className,
      )}
      style={{ background: gradient }}
    >
      {React.createElement(icon, { className: cn("size-5", iconClassName) })}
    </span>
  );
};

const ActionRow = ({ icon, title, description, action }) => {
  return (
    <button
      type="button"
      className="flex w-full items-start gap-3 rounded-[24px] border border-slate-100 bg-white p-4 text-left transition hover:border-primary/20 hover:bg-[#fbfdfb] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      onClick={() => toast.success(`${title} opened.`)}
    >
      <IconBubble
        icon={icon}
        gradient="linear-gradient(135deg, #dc2626, #fb7185)"
        className="mt-0.5 size-10"
        iconClassName="size-4"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            {title}
          </h3>
          <span className="text-xs font-semibold text-primary">{action}</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-white/60">
          {description}
        </p>
      </div>
    </button>
  );
};

const ActivityLog = ({ log }) => {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <IconBubble
          icon={log.icon}
          gradient="linear-gradient(135deg, #0f766e, #22c55e)"
          className="size-9 rounded-2xl"
          iconClassName="size-4"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-950 dark:text-white">
            {log.title}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-white/60">
            {log.description}
          </p>
        </div>
      </div>
      <p className="shrink-0 text-xs text-slate-400">{log.timestamp}</p>
    </div>
  );
};

export default SettingsPage;
