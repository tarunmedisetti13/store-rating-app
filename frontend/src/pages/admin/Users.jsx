import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import api from "../../api/Auth";
const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
    });

    // Add User modal states
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users', { params: filters });
            console.log(filters);
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    // Handle Add User modal input changes
    const handleNewUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const { name, email, password, address } = newUser;
        if (!name || !email || !password || !address) {
            setErrorMessage("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/admin/add-user', newUser);
            if (res.data.success) {
                setShowModal(false);
                setNewUser({ name: "", email: "", password: "", address: "" });
                fetchUsers(); // Refresh list
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || "Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={() => setShowModal(true)}
                >
                    Add User
                </button>
            </div>

            {/* Filters */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
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
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.address}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                        <h2 className="text-xl font-bold mb-4">Add User</h2>
                        {errorMessage && (
                            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                        )}
                        <form onSubmit={handleAddUser} className="flex flex-col gap-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={newUser.name}
                                onChange={handleNewUserChange}
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={handleNewUserChange}
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={handleNewUserChange}
                                className="border px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={newUser.address}
                                onChange={handleNewUserChange}
                                className="border px-3 py-2 rounded"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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

export default Users;
