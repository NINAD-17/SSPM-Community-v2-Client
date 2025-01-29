import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const RegisterForm = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gradYear, setGradYear] = useState("");
    const [branch, setBranch] = useState("");
    const currYear = new Date().getFullYear();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.user);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(
                register({
                    firstName: fname,
                    lastName: lname,
                    email,
                    password,
                    graduationYear: gradYear,
                    branch,
                })
            ).unwrap();
            toast.success('Registration successful!');
            navigate("/home");
        } catch (err) {
            toast.error(err?.message || 'Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col gap-8 justify-center items-center w-full min-h-screen px-4 overflow-auto">
            <div>
                <p className="text-2xl text-slate-700">Register to</p>
                <h1 className="text-4xl font-extrabold text-blue-800 md:text-5xl">
                    SSPM COMMUNITY
                </h1>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl w-full sm:w-2/3 md:w-3/5 lg:w-96">
                <form onSubmit={handleSubmit}>
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
                                value={fname}
                                onChange={(event) =>
                                    setFname(event.target.value)
                                }
                                placeholder="First Name"
                                className="mb-2 w-full outline-1 outline-blue-400 rounded-xl p-2 text-md"
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
                                value={lname}
                                onChange={(event) =>
                                    setLname(event.target.value)
                                }
                                placeholder="Last Name"
                                className="mb-2 w-full outline-1 outline-blue-400 rounded-xl p-2 text-md"
                            />
                        </div>
                    </div>
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
                            value={branch}
                            onChange={(event) => setBranch(event.target.value)}
                            className="mb-2 w-full outline-1 outline-blue-400 rounded-xl p-2 text-md"
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
                            max={currYear + 4}
                            value={gradYear}
                            onChange={(event) =>
                                setGradYear(event.target.value)
                            }
                            className="mb-2 w-full outline-1 outline-blue-400 rounded-xl p-2 text-md"
                            placeholder={currYear}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className={`w-full p-2 rounded-xl mt-7 text-white 
                            ${status === "loading" 
                                ? "bg-blue-400 cursor-not-allowed" 
                                : "bg-blue-800 hover:bg-blue-500"
                            }`}
                    >
                        {status === "loading" ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            "Register"
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
};

export default RegisterForm;
