import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useSelector((state) => state.auth);

  if (loading) return <h1>Loading...</h1>;

  return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;