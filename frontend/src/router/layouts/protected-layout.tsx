import { Navigate, Outlet } from "react-router-dom";
// import useAuthStore from "../../store/useAuthStore";

export default function ProtectedLayout() {
    const { isAuthenticated } = { isAuthenticated: false }; //useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}
