import React from "react";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { useRegistrationMutation } from "@/features/auth/authApiSlice";

const getRegistrationError = (error) => {
  const responseError = error?.data?.error;

  if (Array.isArray(responseError)) {
    return responseError[0];
  }

  if (typeof responseError === "string") {
    return responseError;
  }

  return (
    error?.data?.message ||
    error?.data?.detail ||
    "Failed to complete registration."
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registration, { isLoading }] = useRegistrationMutation();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "adopter",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data) => {
    if (data.password !== data.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await registration({
        role: data.role.toUpperCase(),
        name: data.name.trim(),
        email: data.email.trim(),
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
      toast.error(getRegistrationError(error));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-orange-200 via-yellow-200 to-red-200">
          <div className="mt-auto">
            <img
              src="https://images.vexels.com/media/users/3/200040/isolated/preview/9960585fc70528e037e94ccee1e67363-orange-cat-illustration.png"
              className="h-80 object-contain mb-6"
            />

            <div className="max-w-xl">
              <h1 className="text-5xl text-orange-800 font-semibold leading-tight">
                Pawpal helps stray animals finding their loving homes.
              </h1>
              <p className="mt-5 text-base leading-7 text-white/70"></p>
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
                  Create account
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign up to start using your Pawpal account.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <div>
                      <div className="grid grid-cols-2 gap-3">
                        {["adopter", "rescuer"].map((role) => (
                          <label
                            key={role}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                              field.value === role
                                ? "border-primary bg-primary/5 text-primary ring-4 ring-primary/10"
                                : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                            }`}
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={role}
                              checked={field.value === role}
                              onChange={() => field.onChange(role)}
                              onBlur={field.onBlur}
                              className="size-4 accent-primary"
                            />
                            as {role === "adopter" ? "an" : "a"} {role}
                          </label>
                        ))}
                      </div>
                      {errors.role?.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.role.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Name"
                      autoComplete="name"
                      error={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Email Address"
                      type="email"
                      autoComplete="email"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  render={({ field }) => (
                    <FloatingInput
                      {...field}
                      label="Password"
                      type="password"
                      autoComplete="new-password"
                      error={errors.password?.message}
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
                      autoComplete="new-password"
                      error={errors.confirm_password?.message}
                    />
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
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
