import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import CreatePost from "../pages/CreatePost";
import PostDetail from "../pages/PostDetail";
import EditPost from "../pages/EditPost";
import Profile from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public
      { index: true, element: <Home /> },
      {
        path: "/blogs",
        element: <Home />,
      },

      // Only guest users
      {
        path: "/login",
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        ),
      },

      // Protected
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: <ProtectedRoute>{<Profile /> }</ProtectedRoute>,
      },
      {
        path: "/create-post",
        element: <ProtectedRoute>{<CreatePost />}</ProtectedRoute>,
      },
      {
        path: "/edit-post/:id",
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        ),
      },

      // 404
      {
        path: "*",
        element: <div>page not found</div>,
        // <NotFound />
      },
    ],
  },
]);

export default router;
