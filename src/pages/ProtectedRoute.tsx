import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/typedHooks";

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
