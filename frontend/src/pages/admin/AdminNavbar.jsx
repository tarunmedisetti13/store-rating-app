import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
    const { logout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    return (
        <>
            <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <div className="flex gap-4">
                    <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/admin/users" className="hover:underline">Users</Link>
                    <Link to="/admin/stores" className="hover:underline">Stores</Link>
                    <Link to="/admin/admins" className="hover:underline">Admins</Link>
                    <Link to='/admin/profile' className="hover:underline">Profile</Link>
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                >
                    Logout
                </button>
            </nav>

            {/* Logout Confirmation Modal */}
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

export default AdminNavbar;
