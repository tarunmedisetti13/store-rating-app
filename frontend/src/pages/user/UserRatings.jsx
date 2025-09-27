import React, { useEffect, useState } from "react";
import api from "../../api/Auth"; // Axios instance with token

const UserRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentRating, setCurrentRating] = useState({ storeId: null, ratingId: null, ratingValue: "" });

    // Fetch user ratings
    const fetchUserRatings = async () => {
        try {
            setLoading(true);
            const res = await api.get("/user/ratings");
            if (res.data.success) {
                setRatings(res.data.ratings);
            }
        } catch (err) {
            console.log(err);
            setErrorMessage("Failed to fetch ratings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRatings();
    }, []);

    const openEditModal = (storeId, ratingId, ratingValue) => {
        setCurrentRating({ storeId, ratingId, ratingValue });
        setShowModal(true);
    };

    const handleRatingChange = (value) => {
        setCurrentRating({ ...currentRating, ratingValue: value });
    };

    const submitRating = async () => {
        const { storeId, ratingId, ratingValue } = currentRating;
        const rating = Number(ratingValue);

        if (!rating || rating < 1 || rating > 5) {
            alert("Rating must be between 1 and 5");
            return;
        }

        try {
            const res = await api.post("/user/add-rating", { storeId, rating });
            if (res.data.success) {
                alert(res.data.message);
                setShowModal(false);
                fetchUserRatings(); // refresh list
            }
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to update rating");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your Ratings</h2>

            {loading && <p>Loading your ratings...</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {ratings.length === 0 && !loading && <p>No ratings submitted yet.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ratings.map((r) => (
                    <div key={r.rating_id} className="border rounded p-4 shadow flex flex-col gap-2">
                        <h3 className="font-semibold text-lg">{r.store_name}</h3>
                        <p>{r.store_address}</p>
                        <p>Your Rating: {r.rating}</p>
                        <button
                            onClick={() => openEditModal(r.store_id, r.rating_id, r.rating)}
                            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 mt-2"
                        >
                            Update Rating
                        </button>
                    </div>
                ))}
            </div>

            {/* Edit Rating Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4 text-center">Update Rating</h3>
                        <div className="flex flex-col gap-4">
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={currentRating.ratingValue}
                                onChange={(e) => handleRatingChange(e.target.value)}
                                className="border rounded px-3 py-2 w-full text-center"
                            />
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={submitRating}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Update
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

export default UserRatings;
