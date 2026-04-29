import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicOnlyRoute({ children }) {
  const { isAuth, loading } = useSelector((state) => state.auth);

  if (loading) return <h2>Loading...</h2>;

  return isAuth ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicOnlyRoute;
