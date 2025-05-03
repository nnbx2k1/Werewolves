import photoPath from "../../assets/2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignUpUser() {
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profilePicture: null,
    email: "",
    password: "",
    role: "client"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setFormData({ ...formData, profilePicture: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setShowError(false);
    setLoading(true);
  
    try {
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: "client"
      };
  
      await register(userData);
      navigate("/chatuser");  // ✅ Correct redirection
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="bg-[#F0F4FA] min-h-screen rounded-3xl flex items-center justify-center p-6">
      <div className="flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side Photo */}
        <div className="w-1/2 flex rounded-3xl items-center justify-center ">
          <img
            src={photoPath}
            alt="Side Visual"
            className="w-full rounded-3xl h-full object-cover"
          />
        </div>

        {/* Middle Spacer */}
        <div className="w-[30px] bg-[#F0F4FA]"></div>

        {/* Right Side Form */}
        <div className="w-full rounded-3xl md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-[#72A1CD]">
            Basic Information
          </h2>

          {/* Profile Preview */}
          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-8 border-[#72A1CD]"
              />
            </div>
          )}

          {showError && error && (
            <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Profile Picture Input */}
            <div>
              <label className="block mb-2 text-gray-700 font-medium">Profile Picture</label>
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 border rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#72A1CD]"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#72A1CD]"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#72A1CD]"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#72A1CD]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#72A1CD] hover:bg-[#5f90bc] text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              {loading ? 'Creating account...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
