import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import { server } from "../constants/config";

const ResetPassword = () => {
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {token}=useParams()
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/user/reset-password`, { token,password });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h2>
        <p className="text-gray-500 text-center mt-2">Type your new password</p>
        <form className="mt-6 space-y-5" onSubmit={handleReset}>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="password"
              placeholder="New password"
              value={password}
              required
              onChange={(e) => setpassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold text-base transition duration-300 ease-in-out shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? "Password Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-blue-600 hover:underline text-sm">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
