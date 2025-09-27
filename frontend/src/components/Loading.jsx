// src/components/Loading.js
import React from "react";

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-white/70 flex justify-center items-center z-50 flex-col gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p>Server Loading...</p>
        </div>
    );
};

export default Loading;
