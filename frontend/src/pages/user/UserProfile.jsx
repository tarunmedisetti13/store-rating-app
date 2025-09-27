import React, { useEffect, useState } from "react";
import api from "../../api/Auth"; // axios instance with token
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Password modal state
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    // Fetch user profile
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/profile");
            if (res.data.success) {
                setUser(res.data.user);
            }
        } catch (err) {
            console.log(err);
            setErrorMessage("Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle password update
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setErrorMessage(
                "Password must be 8-20 chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special character."
            );
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/user/update-password", { currentPassword: "", newPassword });
            setSuccessMessage(res.data.message || "Password updated successfully!");
            setNewPassword("");
            setConfirmPassword("");
            setShowModal(false);
        } catch (err) {
            console.log(err);
            setErrorMessage(err.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>

            {loading && <p>Loading...</p>}
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

            {user && (
                <div className="bg-white p-4 rounded shadow flex flex-col gap-3">
                    <div>
                        <h3 className="font-semibold">Name</h3>
                        <p>{user.name}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <p>{user.email}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Address</h3>
                        <p>{user.address}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Role</h3>
                        <p>{user.role}</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-3"
                    >
                        Update Password
                    </button>
                </div>
            )}

            {/* Password Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4 text-center">Update Password</h3>
                        {errorMessage && <p className="text-red-500 mb-2 text-sm text-center">{errorMessage}</p>}
                        {successMessage && <p className="text-green-500 mb-2 text-sm text-center">{successMessage}</p>}

                        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
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

                            <div className="relative">
                                <label className="block mb-1 font-medium">Confirm Password</label>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border rounded px-3 py-2 w-full"
                                    required
                                />
                                <span
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 mt-2"
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                >
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            <div className="flex justify-center mt-4 gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
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

export default UserProfile;
