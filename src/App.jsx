import "./App.css";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./redux/slices/authSlice";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated when app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <div>
      <Toaster position="top-right" />
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
