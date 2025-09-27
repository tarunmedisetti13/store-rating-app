import React, { useEffect, useState } from "react";
import api from "../../api/Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    // Fetch profile info
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/admin/profile");
                if (res.data.success) {
                    setUser(res.data.admin);
                } else {
                    setErrorMessage("Details not found");
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                setErrorMessage("Failed to load profile.");
            }
        };
        fetchProfile();
    }, []);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!passwordRegex.test(newPassword)) {
            setErrorMessage(
                "New password must be 8-20 chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/admin/update-password", {
                currentPassword,
                newPassword,
            });
            setSuccessMessage(res.data.message || "Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            setErrorMessage(err.response?.data?.error || "Failed to update password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>

            {user ? (
                <div className="mb-6 p-4 bg-white rounded shadow">
                    <p><span className="font-semibold">Name:</span> {user.name}</p>
                    <p><span className="font-semibold">Email:</span> {user.email}</p>
                    <p><span className="font-semibold">Address:</span> {user.address}</p>
                    <p><span className="font-semibold">Role:</span> {user.role}</p>
                </div>
            ) : (
                <p className="text-gray-500">Loading profile...</p>
            )}

            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Update Password
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-center">Update Password</h3>

                        {errorMessage && <p className="text-red-500 mb-2 text-sm">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500 mb-2 text-sm">{successMessage}</p>}

                        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                            {/* Current Password */}
                            <div className="relative">
                                <label className="block mb-1 font-medium">Current Password</label>
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="border rounded px-3 py-2 w-full"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2"
                                    onClick={() => setShowCurrent((prev) => !prev)}
                                >
                                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <label className="block mb-1 font-medium">New Password</label>
                                <input
                                    type={showNew ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border rounded px-3 py-2 w-full"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2"
                                    onClick={() => setShowNew((prev) => !prev)}
                                >
                                    {showNew ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div className="flex justify-between mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 px-4 py-2 cursor-pointer rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
