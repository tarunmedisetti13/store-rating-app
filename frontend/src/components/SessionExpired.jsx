import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/login");
        }, 2000);

        return () => clearTimeout(timer); // cleanup if unmounted early
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
                <h2 className="text-xl font-bold text-red-500 mb-4">
                    Session Expired or Unauthorized
                </h2>
                <p className="text-gray-600 mb-6">
                    Redirecting you to login page...
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Go to Login Now
                </button>
            </div>
        </div>
    );
};

export default SessionExpired;
