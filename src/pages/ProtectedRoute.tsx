import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/typedHooks";

// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
