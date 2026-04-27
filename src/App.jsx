import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import "@/assets/styles/index.css";
import "@/assets/styles/layout.css";
import useAuth from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const { isLoading, authChecked } = useAuth();

  if (!authChecked || isLoading) {
    return (
      <div className="h-screen w-screen center">
        <p>
          <span className="text-2xl font-bold">Loading...</span>
        </p>
      </div>
    );
  }
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
}

export default App;
