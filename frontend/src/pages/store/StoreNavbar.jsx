import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const StoreNavbar = () => {
    const { logout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };
    return (
        <>
            <nav className="fixed w-full bg-green-600 text-white p-4 flex justify-between">
                <div className="flex gap-4">
                    <Link to="/store/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to='/store/user-ratings' className="hover:underline">UserRatings</Link>
                    <Link to="/store/profile" className="hover:underline">Profile</Link>
                </div>
                <button onClick={() => setShowConfirm((prev) => !prev)} className="cursor-pointer bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
            </nav>
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
                        <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
                        <div className="flex justify-around gap-4">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 cursor-pointer  px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default StoreNavbar;
