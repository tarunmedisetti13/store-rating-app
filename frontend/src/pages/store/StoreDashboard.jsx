import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import api from "../../api/Auth";

const StoreDashboard = () => {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const res = await api.get("/store/dashboard");
            if (res.data.success) {
                setStore(res.data.store);
            } else {
                setErrorMessage("Failed to fetch store dashboard");
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            setErrorMessage(error.response?.data?.error || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 mt-15">Store Dashboard</h1>

            {loading && <Loading />}
            {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            {store && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    {/* Store Name Card */}
                    <div className="bg-white shadow-md shadow-gray-300 rounded-xl p-6  flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">
                            Store Name
                        </h2>
                        <p className="text-2xl font-bold text-gray-800">
                            {store.name}
                        </p>
                    </div>

                    {/* Average Rating Card */}
                    <div className="bg-white shadow-md shadow-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">
                            Average Rating
                        </h2>
                        <p className="text-2xl font-bold text-yellow-500">
                            ⭐ {store.avg_rating}
                        </p>
                    </div>

                    {/* Total Ratings Card */}
                    <div className="bg-white shadow-md shadow-gray-300 rounded-xl p-6 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold text-gray-600 mb-2">
                            Total Ratings
                        </h2>
                        <p className="text-2xl font-bold text-blue-600">
                            {store.total_ratings}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreDashboard;
