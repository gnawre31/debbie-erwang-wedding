import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

const PrivateRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/password" />;
};

export default PrivateRoute;
