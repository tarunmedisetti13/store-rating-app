import React from "react";
import AdminNavbar from '../pages/admin/AdminNavbar';
import StoreNavbar from "../pages/store/StoreNavbar";
import UserNavbar from "../pages/user/UserNavbar";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user } = useAuth();

    if (!user) return null;

    switch (user.role) {
        case "admin":
            return <AdminNavbar />;
        case "store_owner":
            return <StoreNavbar />;
        case "user":
            return <UserNavbar />;
        default:
            return null;
    }
};

export default Navbar;
