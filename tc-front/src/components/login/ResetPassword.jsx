import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Integration removed
    setSuccess("This is a demo. Password reset logic is removed.");
  };

  return (
    <div className="min-h-screen flex bg-[#BFD7ED] items-center justify-center p-4">
      <div className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">Reset Password</h2>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 mb-6 rounded-2xl text-center">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block p-2 text-gray-500">Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white p-3 rounded-2xl font-semibold transition duration-300 hover:shadow-lg ${
              email.trim()
                ? "cursor-pointer bg-[#A5CCFF] hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!email.trim()}
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Back to{" "}
          <span
            className="cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
