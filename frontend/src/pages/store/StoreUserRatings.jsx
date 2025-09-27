import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import api from "../../api/Auth";

const StoreUserRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // new

    const location = useLocation();

    const fetchUserRatings = async (pageNum = 1) => {
        try {
            setLoading(true);
            const res = await api.get("/store/user-ratings", {
                params: { page: pageNum, limit: 10, sortField: "name", sortOrder: "asc" }
            });
            if (res.data.success) {
                setRatings(res.data.user_ratings);
                setStore(res.data.store);
                setTotalPages(Math.ceil(res.data.total / 10)); // calculate total pages
            } else {
                setErrorMessage("Failed to fetch user ratings");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.error || "Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRatings(page);
    }, [page, location.pathname]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                {store ? `User Ratings for ${store.name}` : "User Ratings"}
            </h1>

            {loading && <Loading />}
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {ratings.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-4 py-2 text-left">S.No</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map((r, index) => (
                                <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-2">{(page - 1) * 10 + index + 1}</td>
                                    <td className="px-4 py-2">{r.name}</td>
                                    <td className="px-4 py-2">{r.email}</td>
                                    <td className="px-4 py-2">{r.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 italic mt-4">No ratings submitted yet.</p>
            )}

            {ratings.length > 0 && (
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={page === totalPages} // disable on last page
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoreUserRatings;
