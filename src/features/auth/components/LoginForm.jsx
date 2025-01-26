import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../authSlice";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(login({ email, password }))
            .unwrap()
            .then(() => navigate("/home"))
            .catch((err) => console.log(err));
    };

    return (
        <div className="flex flex-col gap-8 justify-center items-center w-full h-screen">
            <div>
                <p className="text-2xl text-slate-700">Log in to</p>
                <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                    SSPM COMMUNITY
                </h1>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl w-2/3 md:w-3/5 lg:w-96">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2 lg:text-md"
                        >
                            Your Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="mb-2 w-full outline-1 outline-blue-400 rounded-xl p-2 text-md"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-2 lg:text-md"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="mb-2 w-full outline-1 outline-blue-400 rounded-xl p-2 text-md"
                            placeholder="Enter password"
                        />
                    </div>
                    <div>
                        <p className="text-right text-sm text-blue-800 cursor-pointer">
                            forgot password?
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-800 p-2 rounded-xl mt-7 text-white hover:bg-blue-500"
                    >
                        Log In
                    </button>
                    <p className="text-sm text-gray-500 cursor-pointer text-center mt-2">
                        Not registered yet?{" "}
                        <span
                            className="hover:underline text-blue-500 hover:text-blue-600"
                            onClick={() => navigate("/register")}
                        >
                            Register here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
