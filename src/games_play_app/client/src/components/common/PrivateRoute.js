import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};