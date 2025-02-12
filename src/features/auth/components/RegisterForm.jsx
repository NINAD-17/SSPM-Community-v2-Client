import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerInit, registerVerifyOTP, registerComplete } from "../authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const { 
        registrationStep, 
        verifiedEmail, 
        actionStatus, 
        error 
    } = useSelector((state) => state.auth);

    // Email Step State
    const [email, setEmail] = useState("");
    
    // OTP Step State
    const [otp, setOtp] = useState("");
    
    // Form Step State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        graduationYear: "",
        branch: "",
    });

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(registerInit(email)).unwrap();
            toast.success('OTP sent successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to send OTP');
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(registerVerifyOTP({ email: verifiedEmail, otp })).unwrap();
            toast.success('Email verified successfully!');
        } catch (err) {
            toast.error(err.message || 'OTP verification failed');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(registerComplete({ 
                ...formData, 
                email: verifiedEmail 
            })).unwrap();
            toast.success('Registration successful!');
            navigate('/home');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        }
    };

    if (registrationStep === 'email') {
        return (
            <div className="flex flex-col gap-8 justify-center items-center min-h-screen">
                <div>
                    <p className="text-2xl text-slate-700">Register to</p>
                    <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                        SSPM COMMUNITY
                    </h1>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl w-full max-w-md">
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400 focus:border-transparent`}
                                disabled={registrationStep === "otp"}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={actionStatus === "loading"}
                            className="w-full p-2 bg-blue-800 text-white rounded-xl cursor-pointer hover:bg-blue-500"
                        >
                            {actionStatus === "loading" ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                </div>
                            ) : (
                                "Send OTP"
                            )}
                        </button>
                        <p className="text-sm text-gray-500 cursor-pointer text-center mt-2">
                            Already a user?{" "}
                            <span
                                className="hover:underline text-blue-500 hover:text-blue-600"
                                onClick={() => navigate("/login")}
                            >
                                Login here
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    if (registrationStep === 'otp') {
        return (
            <div className="flex flex-col gap-8 justify-center items-center min-h-screen">
                <div>
                    <p className="text-2xl text-slate-700">Register to</p>
                    <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                        SSPM COMMUNITY
                    </h1>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl w-full max-w-md">
                    <form onSubmit={handleOTPSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400  focus:border-transparent"
                                placeholder="Enter OTP"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={actionStatus === "loading"}
                            className="w-full p-2 bg-blue-800 text-white rounded-xl"
                        >
                            {actionStatus === "loading" ? (
                                <div className="flex justify-center items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white cursor-pointer hover:bg-blue-500"></div>
                                </div>
                            ) : (
                                "Verify OTP"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Registration Form
    return (
        <div className="flex flex-col gap-8 justify-center items-center min-h-screen">
            <div>
                <p className="text-2xl text-slate-700">Register to</p>
                <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                    SSPM COMMUNITY
                </h1>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl w-full max-w-md">
                <form onSubmit={handleFormSubmit}>
                    <div className="flex flex-col sm:flex-row gap-5">
                        <div>
                            <label
                                htmlFor="fname"
                                className="block text-sm font-medium mb-2 lg:text-md"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                name="fname"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        firstName: e.target.value,
                                    })
                                }
                                className="mb-2 w-full bg-white rounded-xl p-2 text-md focus:-outline-offset-1 outline-blue-400  focus:border-transparent"
                                required
                                placeholder="First Name"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lname"
                                className="block text-sm font-medium mb-2 lg:text-md"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lname"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        lastName: e.target.value,
                                    })
                                }
                                className="mb-2 w-full bg-white rounded-xl p-2 text-md focus:-outline-offset-1 outline-blue-400  focus:border-transparent"
                                required
                                placeholder="Last Name"
                            />
                        </div>
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
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400 focus:border-transparent"
                            placeholder="Create a strong password (min 8 characters)"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="branch"
                            className="block text-sm font-medium mb-2 lg:text-md"
                        >
                            Branch
                        </label>
                        <input
                            type="text"
                            name="branch"
                            value={formData.branch}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    branch: e.target.value,
                                })
                            }
                            className="mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400 focus:border-transparent"
                            placeholder="Enter your Branch - Computer Engineering"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="gradYear"
                            className="block text-sm font-medium mb-2 lg:text-md"
                        >
                            Graduation Year
                        </label>
                        <input
                            type="number"
                            name="gradYear"
                            min={2000}
                            max={currentYear + 4}
                            value={formData.graduationYear}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    graduationYear: e.target.value,
                                })
                            }
                            className="mb-2 w-full bg-white rounded-xl p-2 text-md
                                focus:-outline-offset-1 outline-blue-400 focus:border-transparent"
                            placeholder={currentYear}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={actionStatus === "loading"}
                        className="w-full p-2 mt-4 bg-blue-800 text-white rounded-xl cursor-pointer hover:bg-blue-500"
                    >
                        {actionStatus === "loading" ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            "Complete Registration"
                        )}
                    </button>
                    
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
