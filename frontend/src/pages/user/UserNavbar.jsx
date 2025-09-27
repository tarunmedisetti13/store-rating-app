import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserNavbar = () => {
    const { logout } = useAuth();

    return (
        <nav className="bg-purple-600 text-white p-4 flex justify-between">
            <div className="flex gap-4">
                <Link to="/user/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/user/stores" className="hover:underline">Stores</Link>
                <Link to='/user/ratings' className="hover:underline">My Ratings</Link>
                <Link to='/user/profile' className="hover:underline">Profile</Link>
            </div>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
        </nav>
    );
};

export default UserNavbar;
