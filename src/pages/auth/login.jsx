import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/input";
import { useLoginMutation } from "@/features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "@/features/auth/authSlice";

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");
  const [errorAnimationKey, setErrorAnimationKey] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle successful authentication
  const handleAuthSuccess = (accessToken, refreshToken, rememberMe) => {
    dispatch(userLoggedIn({ accessToken, refreshToken, rememberMe }));
    navigate("/", { replace: true });
  };

  const onSubmit = async (data) => {
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      }).unwrap();

      if (res.success && res.data) {
        handleAuthSuccess(
          res.data.access_token,
          res.data.refresh_token,
          data.rememberMe,
        );
        setError("");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError(error?.data?.error[0] || "Failed to connect with server!");
      setErrorAnimationKey((current) => current + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-white">
          <div className="mt-auto">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/060/759/275/small/beautiful-classic-abstract-teamwork-concept-diagram-isolated-element-high-resolution-png.png"
              className="h-80 object-contain mb-8"
            />
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[0.2em] uppercase text-white/70">
              Pawpal
            </div>

            <div className="mt-8 max-w-xl">
              <h1 className="text-5xl font-semibold leading-tight">
                Pawpal helps stray animals finding their loving homes.
              </h1>
              <p className="mt-5 text-base leading-7 text-white/70"></p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
              <div className="mb-12">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                  Pawpal
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                  Let's get started
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your pawpal account.
                </p>
              </div>
              {error && (
                <div
                  key={errorAnimationKey}
                  className="error-bounce mb-6 -mt-6 rounded-lg border border-red-200 bg-red-100 p-2 text-center text-xs"
                >
                  <span className="text-red-500">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      error={errors.password?.message}
                    />
                  )}
                />

                <div className="flex items-center justify-between gap-4">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                        <label
                          htmlFor="rememberMe"
                          className="cursor-pointer text-sm text-slate-600"
                        >
                          Remember me
                        </label>
                      </div>
                    )}
                  />

                  <a
                    href="/forgot-password"
                    className="text-sm font-medium text-slate-900 underline underline-offset-4 transition hover:text-slate-700"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
