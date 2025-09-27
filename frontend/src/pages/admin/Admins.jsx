import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import api from "../../api/Auth";

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        page: 1,
        limit: 10,
        sortField: "id",
        sortOrder: "asc",
    });

    // Add Admin modal states
    const [showModal, setShowModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/admins", { params: filters });
            if (res.data.success) {
                setAdmins(res.data.admins);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleNewAdminChange = (e) => {
        setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const { name, email, password, address } = newAdmin;
        if (!name || !email || !password || !address) {
            setErrorMessage("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/admin/add-admin", newAdmin);
            if (res.data.admin) {
                setShowModal(false);
                setNewAdmin({ name: "", email: "", password: "", address: "" });
                fetchAdmins();
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || "Failed to add admin");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Admins</h1>
                <button
                    className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={() => setShowModal(true)}
                >
                    Add Admin
                </button>
            </div>

            {/* Filters */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchAdmins();
                }}
                className="flex gap-3 mb-4"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2"
                />
                <select
                    name="sortField"
                    value={filters.sortField}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2"
                >
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="address">Address</option>
                </select>
                <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="border rounded px-3 py-2"
                >
                    <option value="asc">ASC</option>
                    <option value="desc">DESC</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Search
                </button>
            </form>

            {loading && <Loading />}

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-4 py-2 text-left">S.No</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.length > 0 ? (
                            admins.map((admin, index) => (
                                <tr
                                    key={admin.id}
                                    className="border-b hover:bg-gray-100 transition"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{admin.name}</td>
                                    <td className="px-4 py-2">{admin.email}</td>
                                    <td className="px-4 py-2">{admin.address}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                                    No admins found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Admin Modal */}
            {showModal && (
                <div className="fixed inset-0  flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                        <h2 className="text-xl font-bold mb-4">Add Admin</h2>
                        {errorMessage && (
                            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                        )}
                        <form onSubmit={handleAddAdmin} className="flex flex-col gap-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={newAdmin.name}
                                onChange={handleNewAdminChange}
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={newAdmin.email}
                                onChange={handleNewAdminChange}
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={newAdmin.password}
                                onChange={handleNewAdminChange}
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={newAdmin.address}
                                onChange={handleNewAdminChange}
                                className="border px-3 py-2 rounded"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 cursor-pointer px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;
