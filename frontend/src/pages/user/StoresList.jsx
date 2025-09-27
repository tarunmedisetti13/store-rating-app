import React, { useEffect, useState } from "react";
import api from "../../api/Auth";

const StoresList = () => {
    const [stores, setStores] = useState([]);
    const [userRatings, setUserRatings] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentRating, setCurrentRating] = useState({ storeId: null, storeName: "", ratingValue: "" });

    // Fetch stores
    const fetchStores = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/stores", { params: { search } });
            if (res.data.success) {
                setStores(res.data.stores);
            }
        } catch (err) {
            console.log(err);
            setErrorMessage("Failed to fetch stores");
        } finally {
            setLoading(false);
        }
    };

    // Fetch user submitted ratings
    const fetchUserRatings = async () => {
        try {
            const res = await api.get("/user/ratings");
            if (res.data.success) {
                const ratingsObj = {};
                res.data.ratings.forEach(r => {
                    ratingsObj[r.store_id] = r.rating;
                });
                setUserRatings(ratingsObj);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStores();
        fetchUserRatings();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores();
    };

    const openModal = (storeId, storeName, existingRating) => {
        setCurrentRating({ storeId, storeName, ratingValue: existingRating || "" });
        setShowModal(true);
    };

    const handleRatingChange = (value) => {
        setCurrentRating({ ...currentRating, ratingValue: value });
    };

    const submitRating = async () => {
        const { storeId, ratingValue } = currentRating;
        const rating = Number(ratingValue);
        const prevRating = userRatings[storeId];
        if (!rating || rating < 1 || rating > 5) {
            alert("Rating must be between 1 and 5");
            return;
        }
        if (prevRating && prevRating === rating) {
            alert("You already submitted this rating");
            setShowModal(false);
            return;
        }

        try {
            const res = await api.post("/user/add-rating", { storeId, rating });
            if (res.data.success) {
                alert(res.data.message);
                setShowModal(false);
                fetchStores();
                fetchUserRatings();
            }
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to submit rating");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Stores</h2>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or address"
                    className="border rounded px-3 py-2 flex-1"
                />
                <button type="submit" className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600">
                    Search
                </button>
            </form>

            {loading && <p>Loading stores...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <table className="min-w-full border rounded shadow overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">Store Name</th>
                        <th className="px-4 py-2 border">Address</th>
                        <th className="px-4 py-2 border">Overall Rating</th>
                        <th className="px-4 py-2 border">Your Rating</th>
                        <th className="px-4 py-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => {
                        const userRating = userRatings[store.id] || "";
                        return (
                            <tr key={store.id} className="text-center">
                                <td className="px-4 py-2 border">{store.name}</td>
                                <td className="px-4 py-2 border">{store.address}</td>
                                <td className="px-4 py-2 border">{Number(store.overall_rating).toFixed(1)}</td>
                                <td className="px-4 py-2 border">{userRating || "-"}</td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => openModal(store.id, store.name, userRating)}
                                        className={`px-3 py-1 cursor-pointer rounded min-w-40 ${userRating
                                            ? "bg-green-500 text-white hover:bg-green-600"
                                            : "bg-purple-500 text-white hover:bg-purple-600"
                                            }`}
                                    >
                                        {userRating ? "Update Rating" : "Add Rating"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Rating Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                            {currentRating.storeName} - {currentRating.ratingValue ? "Update Rating" : "Add Rating"}
                        </h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={currentRating.ratingValue}
                                onChange={(e) => handleRatingChange(e.target.value)}
                                className="border rounded px-3 py-2 w-full text-center"
                                placeholder="1 - 5"
                            />
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={submitRating}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    {currentRating.ratingValue ? "Update" : "Add"}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoresList;
