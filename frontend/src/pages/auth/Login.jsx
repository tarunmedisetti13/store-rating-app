import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loading from "../../components/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../api/Auth";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const from = location.state?.from?.pathname;
            if (from && from !== '/login') {
                navigate(from, { replace: true });
            } else {
                // Redirect to appropriate dashboard
                if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
                else if (user.role === 'store_owner') navigate('/store/dashboard', { replace: true });
                else navigate('/user/dashboard', { replace: true });
            }
        }
    }, [user, navigate, location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("All fields are required!");
            return;
        }

        try {
            setLoading(true);
            const res = await loginUser(email, password);

            if (res.data.token) {
                login(res.data.token);
            } else {
                setErrorMessage("Invalid response from server");
            }
        } catch (err) {
            console.error("Login error:", err);
            setErrorMessage(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 border border-gray-200 p-8 w-96 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-2xl font-bold text-center">Login</h2>

                {errorMessage && (
                    <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}

                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-1 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded px-3 py-2"
                        required
                    />
                </div>

                <div className="relative flex flex-col">
                    <label htmlFor="password" className="mb-1 font-medium">
                        Password
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded px-3 py-2"
                        required
                    />
                    <span
                        className="absolute right-2 top-1/2 mt-2 cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white rounded py-2 hover:bg-blue-600 transition cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <Link to='/signup' className="hover:underline text-center">
                    Don't have an account? Sign up
                </Link>
            </form>
            {loading && <Loading />}
        </div>
    );
};

export default Login;