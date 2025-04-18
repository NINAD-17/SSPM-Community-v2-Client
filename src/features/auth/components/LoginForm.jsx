import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { loginInit, loginVerifyOTP } from "../authSlice";

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loginStep, verifiedEmail, actionStatus, error } = useSelector(
        (state) => state.auth
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [otp, setOtp] = useState("");

    const handleCredentialsSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(loginInit({ email, password })).unwrap();
            toast.success("OTP sent to your email!");
        } catch (err) {
            toast.error(err?.message || "Login failed. Please try again.");
            console.error(err);
        }
    };

    const handleOTPSubmitAndLogin = async (event) => {
        event.preventDefault();
        try {
            await dispatch(
                loginVerifyOTP({ email: verifiedEmail, otp })
            ).unwrap();
            toast.success("Successfully logged in!");
            const from = location.state?.from?.pathname || "/home";
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err?.message || "Login failed. Please try again.");
            console.error(err);
        }
    };

    if (loginStep === "credentials") {
        return (
            <div className="flex flex-col gap-8 justify-center items-center w-full h-screen">
                <div>
                    <p className="text-2xl text-slate-700">Log in to</p>
                    <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                        SSPM COMMUNITY
                    </h1>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl w-2/3 md:w-3/5 lg:w-96">
                    <form onSubmit={handleCredentialsSubmit}>
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
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                className="mb-2 w-full bg-white rounded-xl p-2 text-md focus:-outline-offset-1 outline-blue-400  focus:border-transparent"
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
                                className="mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400 focus:border-transparent"
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
                            disabled={actionStatus === "loading"}
                            className={`w-full p-2 rounded-xl mt-7 text-white cursor-pointer
                            ${
                                actionStatus === "loading"
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-800 hover:bg-blue-500"
                            }`}
                        >
                            {actionStatus === "loading" ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                "Log In"
                            )}
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
    }

    return (
        <div className="flex flex-col gap-8 justify-center items-center w-full h-screen">
            <div>
                <p className="text-2xl text-slate-700">Log in to</p>
                <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                    SSPM COMMUNITY
                </h1>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl w-2/3 md:w-3/5 lg:w-96">
                <form onSubmit={handleOTPSubmitAndLogin}>
                    <div>
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium mb-2 lg:text-md"
                        >
                            Your Email
                        </label>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(event) => setOtp(event.target.value)}
                            className="mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400  focus:border-transparent"
                            placeholder="Enter OTP"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={actionStatus === "loading"}
                        className={`w-full p-2 rounded-xl mt-7 text-white cursor-pointer
                            ${
                                actionStatus === "loading"
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-800 hover:bg-blue-500"
                            }`}
                    >
                        {actionStatus === "loading" ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            "Log In"
                        )}
                    </button>
                    <p className="text-sm text-gray-500 cursor-pointer text-center mt-2">
                        <span
                            className="hover:underline text-blue-500 hover:text-blue-600"
                            // onClick={() => navigate("/register")}
                        >
                            Re-Send OTP
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
