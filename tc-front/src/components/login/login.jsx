// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import login from "../../assets/1.svg";
import { authService } from "../../api/apiservices";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      const response = await authService.login(formData);
      
      // Store authentication data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Redirect based on user role
      if (response.user.role === "banker") {
        navigate("/banker/dashboard");
      } else if (response.user.role === "client") {
        navigate("/client/dashboard");
      } else {
        throw new Error("Invalid user role");
      }
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
      // Clear any existing auth data on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = formData.email.trim() !== "" && formData.password.trim() !== "";

  return (
    <div className="min-h-screen flex items-center mx-12 justify-center p-4 mt-16 bg-white">
      <div className="w-full max-w-5xl pt-6 pb-6 flex flex-col md:flex-row">
        {/* Left Section (Image) */}
        <div className="hidden md:flex md:w-1/2 bg-blue-200 p-6 rounded-r-4xl rounded-l-4xl mr-6">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-4xl font-bold pt-10 text-black mb-4">Login</h2>
            <img src={login} alt="login" className="w-3/4 pt-10" />
          </div>
        </div>

        {/* Right Section (Login Form) */}
        <div className="w-full md:w-1/2 p-6 shadow-2xl rounded-r-4xl rounded-l-4xl bg-gradient-to-br from-white via-[#e7f0fb] to-[#d4e4f7]">
          <h2 className="text-2xl font-semibold text-[#003B73] text-center mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block p-2 text-[#003B73]">Email:</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#72a1cd]"
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block p-2 text-[#003B73]">Password:</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#72a1cd]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-3 top-16 transform -translate-y-1/2 text-[#003B73]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div></div>
              <span
                onClick={() => navigate("/ResetPassword")}
                className="text-sm text-[#003B73] hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={!isFormComplete || loading}
              className={`w-2/4 mx-auto block text-white bg-[#003B73] p-3 rounded-2xl shadow-md font-semibold transition duration-300 hover:shadow-lg hover:bg-[#00264d] ${
                isFormComplete && !loading ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-4 text-[#003B73]">
            Don't have an account?{" "}
            <span
              className="font-bold underline cursor-pointer hover:text-[#00509e]"
              onClick={() => navigate("/SignUpUser")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
