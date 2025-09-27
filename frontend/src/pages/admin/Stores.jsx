import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import api from "../../api/Auth";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        storename: "",
        storeEmail: "",
        storeaddress: "",
    });
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        address: "",
        rating: "",   // optional (min rating)
        page: 1,
        limit: 10,
        sortField: "id",
        sortOrder: "asc"
    });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/stores', { params: filters });
            if (res.data.success) {
                setStores(res.data.stores);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.post('/admin/add-store', formData);
            if (res.data.success) {
                fetchStores(); // refresh table
                setShowForm(false);
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    storename: "",
                    storeEmail: "",
                    storeaddress: "",
                });
            }
        } catch (error) {
            console.error("Error adding store:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Stores</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    + Add Store
                </button>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchStores();
                }}
                className="flex gap-3 mb-4"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Store Name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={filters.address}
                    onChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
                    className="border rounded px-3 py-2"
                />
                <select
                    name="rating"
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Min Rating</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                            {r}+
                        </option>
                    ))}
                </select>

                <select
                    name="sortField"
                    value={filters.sortField}
                    onChange={(e) => setFilters({ ...filters, sortField: e.target.value })}
                    className="border rounded px-3 py-2"
                >
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="address">Address</option>
                    <option value="avg_rating">Rating</option>
                </select>

                <select
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                    className="border rounded px-3 py-2"
                >
                    <option value="asc">ASC</option>
                    <option value="desc">DESC</option>
                </select>

                <button
                    type="submit"
                    className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
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
                            <th className="px-4 py-2 text-left">Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length > 0 ? (
                            stores.map((store, index) => (
                                <tr
                                    key={store.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{store.name}</td>
                                    <td className="px-4 py-2">{store.email}</td>
                                    <td className="px-4 py-2">{store.address}</td>
                                    <td className="px-4 py-2">{store.avg_rating}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-4 text-gray-500 italic"
                                >
                                    No stores found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 flex justify-center items-center">
                    <form
                        onSubmit={handleAddStore}
                        className="bg-white p-6 rounded-lg shadow-lg w-96"
                    >
                        <h2 className="text-xl font-bold mb-4">Add Store</h2>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                name="name"
                                placeholder="Owner Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Owner Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Owner Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="storename"
                                placeholder="Store Name"
                                value={formData.storename}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="email"
                                name="storeEmail"
                                placeholder="Store Email"
                                value={formData.storeEmail}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                                required
                            />
                            <input
                                type="text"
                                name="storeaddress"
                                placeholder="Store Address"
                                value={formData.storeaddress}
                                onChange={handleChange}
                                className="border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 cursor-pointer py-2 rounded border"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600 transition"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Stores;
