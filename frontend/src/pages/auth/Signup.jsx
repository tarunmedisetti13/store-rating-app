import React, { useState } from "react";
import { Link } from "react-router-dom";
const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setErrorMessage("All fields are required!");
            return;
        }

        setErrorMessage(""); // clear error
        console.log("Signup Data:", { name, email, password });
        // call API here
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 border border-gray-200 p-8 w-96 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-2xl font-bold text-center">Signup</h2>

                {errorMessage && (
                    <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}

                <div className="flex flex-col">
                    <label htmlFor="name" className="mb-1 font-medium">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-3 py-2  "
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded px-3 py-2 "
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-1 font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded px-3 py-2 "
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded py-2 hover:bg-blue-600 transition cursor-pointer"
                >
                    Signup
                </button>
                <Link to='/login'>Already have an account?login</Link>
            </form>
        </div>
    );
};

export default Signup;
