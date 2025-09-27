import React, { useEffect, useState } from 'react';
import { FaUsers, FaStar, FaStore } from 'react-icons/fa';
import api from '../../api/Auth';

const AdminDashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [totalStores, setTotalStores] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setTotalRatings(res.data.total_ratings);
                setTotalStores(res.data.total_stores);
                setTotalUsers(res.data.total_users);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 text-lg">Loading Dashboard...</p>
            </div>
        );
    }

    const stats = [
        { title: 'Total Stores', value: totalStores, icon: <FaStore className="text-blue-500 w-8 h-8" /> },
        { title: 'Total Ratings', value: totalRatings, icon: <FaStar className="text-yellow-400 w-8 h-8" /> },
        { title: 'Total Users', value: totalUsers, icon: <FaUsers className="text-green-500 w-8 h-8" /> },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {stats.map((stat) => (
                <div
                    key={stat.title}
                    className="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                    <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
                    <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-gray-500">{stat.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminDashboard;
