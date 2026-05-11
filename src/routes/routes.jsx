import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/main";
import SettingsPage from "../pages/settings";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import ResetPasswordPage from "../pages/auth/reset-password";
import PrivateRoute from "./private-route";
import FeedPage from "@/pages/feeds";
import ProfilePage from "@/pages/profile";
import PetThreadPage from "@/pages/pets/threads";
import CommunityPage from "@/pages/community";
import ChatPage from "@/pages/chat";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <CommunityPage />,
      },
      {
        path: "/feeds",
        element: <FeedPage />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/profile/:username",
        element: <ProfilePage />,
      },
      {
        path: "/pets/threads/:petId",
        element: <PetThreadPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/sign-up",
    element: <RegisterPage />,
  },
  {
    path: "/forget-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
]);
