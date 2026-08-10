import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { AiOutlineSafety } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiMail } from "react-icons/ci";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.user.role === "jobSeeker") {
        navigate("/JobSeekerDashboardTemplate/JobSeekerDashboard");
      } else if (data.user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/");
      }

      console.log(data);
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const funcShowPassword = () => {
    setShowPassword(showPassword === "password" ? "text" : "password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill all fields.");
      return;
    }

    await login(formData.email, formData.password);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-100 h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-2xl font-bold self-start ml-4 fixed inset-0 top-6 md:text-3xl">
        💼 JobPortal
      </h1>
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-semibold">Welcome Back</h1>
        <p className="flex justify-center text-center text-gray-700 font-medium">
          Access your account to explore jobs, <br /> track applications, and
          connect with employers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="shadow-md rounded-md pt-10 pb-5 bg-white w-4/5 flex flex-col justify-center items-center md:w-3/5 lg:w-2/5"
      >
        <div className="border-2 border-gray-200 rounded-md shadow-md w-4/5 ">
          <GoogleLogin
            locale="en"
            onSuccess={async (credentialResponse) => {
              try {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/api/auth/google`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      credential: credentialResponse.credential,
                      action: "login",
                    }),
                  },
                );

                const data = await response.json();

                console.log(data);

                // User doesn't exist
                if (response.status === 404) {
                  navigate("/accountType", {
                    state: {
                      message:
                        "No account found We couldn't find an existing JobPortal account linked to your Google account. Choose the type of account you'd like to create below.. Please sign up first.",
                    },
                  });

                  return;
                }

                if (!response.ok) {
                  throw new Error(data.message);
                }

                // Existing user
                if (data.user.role === "jobSeeker") {
                  navigate("/JobSeekerDashboardTemplate/JobSeekerDashboard");
                } else if (data.user.role === "employer") {
                  navigate("/employer/dashboard");
                } else {
                  navigate("/");
                }
              } catch (error) {
                setError(error.message);
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
            }}
          />
        </div>

        <div className="flex justify-center items-center gap-2 w-4/5 mt-6">
          <hr className="border-1 border-gray-300 flex-1" />
          <p>OR</p>
          <hr className="border-1 border-gray-300 flex-1" />
        </div>

        <div className="flex flex-col gap-6 w-4/5 mt-6">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <div className="px-4 py-1 rounded-md border-2 border-gray-300 text-gray-700 outline-none flex gap-2 items-center">
              <CiMail size={20} style={{ color: "gray" }} />
              <input
                required
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="outline-none text-gray-700"
                name="email"
                type="email"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700" htmlFor="password">
              Password
            </label>

            <div className="px-4 py-1 rounded-md border-2 border-gray-300 flex justify-between items-center ">
              <div className="flex items-center gap-2">
                <RiLockPasswordLine size={20} style={{ color: "gray" }} />{" "}
                <input
                  required
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  name="password"
                  className="outline-none text-gray-700"
                  type={showPassword}
                  placeholder="Password"
                />
              </div>
              {showPassword === "password" ? (
                <IoEyeOff
                  style={{ color: "gray" }}
                  onClick={funcShowPassword}
                  size={20}
                />
              ) : (
                <IoEye
                  style={{ color: "gray" }}
                  onClick={funcShowPassword}
                  size={20}
                />
              )}
            </div>

            <div className="flex justify-between">
              <div className="flex gap-1">
                <input type="checkbox" />
                <p className=" text-[0.8rem] sm:text-[1rem]">Remember me</p>
              </div>
              <div>
                <p className="cursor-pointer text-blue-600 font-medium text-[0.8rem] sm:text-[1rem]">
                  Forgot Password
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-4/5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md mt-6 py-2 font-medium text-gray-100 text-[1.3rem] hover:scale-[1.01] transition-all"
        >
          {loading ? "signing in..." : "Sign In"}
        </button>
        <p className="mt-4">
          Don't have an account ?{" "}
          <span className="text-blue-600 font-medium">
            <Link to="/accountType">Sign Up</Link>
          </span>
        </p>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <p className="flex items-center mt-8 gap-1 text-gray-600">
          <AiOutlineSafety size={20} /> Your data is safe and secure with us.
        </p>
      </form>
    </div>
  );
};

export default Login;
