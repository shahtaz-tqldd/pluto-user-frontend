import React from "react";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import {
  useAdminRegisterMutation,
  useLazyVerifyAdminInvitationQuery,
} from "@/features/auth/authApiSlice";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [verificationError, setVerificationError] = React.useState("");
  const [verifiedInvitation, setVerifiedInvitation] = React.useState(null);
  const [verifyInvitation, { isFetching: isVerifying }] =
    useLazyVerifyAdminInvitationQuery();
  const [adminRegister, { isLoading: isSubmitting }] =
    useAdminRegisterMutation();

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
  });

  React.useEffect(() => {
    const runVerification = async () => {
      if (!token) {
        setVerificationError("Invitation token is missing from the URL.");
        setVerifiedInvitation(null);
        reset({
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          confirm_password: "",
        });
        return;
      }

      try {
        const response = await verifyInvitation(token).unwrap();
        const invitationData = response?.data || response;
        const invitedEmail = invitationData?.email || "";

        setVerifiedInvitation(invitationData);
        setVerificationError("");
        reset({
          email: invitedEmail,
          first_name: "",
          last_name: "",
          password: "",
          confirm_password: "",
        });
      } catch (error) {
        setVerifiedInvitation(null);
        setVerificationError(
          error?.data?.message ||
            error?.data?.error ||
            "Invitation link is invalid or expired.",
        );
        reset({
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          confirm_password: "",
        });
      }
    };

    runVerification();
  }, [reset, token, verifyInvitation]);

  const onSubmit = async (data) => {
    if (!token || !verifiedInvitation) {
      toast.error("Verify the invitation link before registering.");
      return;
    }

    if (data.password !== data.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await adminRegister({
        token,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        password: data.password,
        confirm_password: data.confirm_password,
      }).unwrap();

      toast.success(
        response?.message ||
          response?.data?.message ||
          "Registration completed successfully.",
      );
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to complete registration.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-white">
          <div className="mt-auto">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[0.2em] uppercase text-white/70">
              Pawpal
            </div>

            <div className="mt-8 max-w-xl">
              <h1 className="text-5xl font-semibold leading-tight">
                Complete your admin invitation and access the dashboard.
              </h1>
              <p className="mt-5 text-base leading-7 text-white/70">
                Verify your invitation, set your profile details, and finish
                account setup securely.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
              <div className="mb-10">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Pawpal
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                  Registration
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Finish registration using the invitation email link.
                </p>
              </div>

              {isVerifying && (
                <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  Verifying invitation link...
                </div>
              )}

              {verificationError && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {verificationError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Invited Email"
                      type="email"
                      disabled
                    />
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <FloatingInput
                        {...field}
                        label="First Name"
                        error={errors.first_name?.message}
                        disabled={!verifiedInvitation}
                      />
                    )}
                  />

                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <FloatingInput
                        {...field}
                        label="Last Name"
                        error={errors.last_name?.message}
                        disabled={!verifiedInvitation}
                      />
                    )}
                  />
                </div>

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Password"
                      type="password"
                      error={errors.password?.message}
                      disabled={!verifiedInvitation}
                    />
                  )}
                />

                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Confirm Password"
                      type="password"
                      error={errors.confirm_password?.message}
                      disabled={!verifiedInvitation}
                    />
                  )}
                />

                <Button
                  type="submit"
                  disabled={!verifiedInvitation || isVerifying || isSubmitting}
                  className="w-full h-11"
                >
                  {isSubmitting
                    ? "Completing registration..."
                    : "Complete Registration"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have access?{" "}
                <Link
                  to="/login"
                  className="font-medium text-slate-900 underline underline-offset-4"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
