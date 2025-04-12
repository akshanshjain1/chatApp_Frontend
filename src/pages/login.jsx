import { useInputValidation } from "6pp";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaGoogle, FaLock, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { auth, provider } from "../services/firebaseConfig";
function Login() {
  const username = useInputValidation("");
  const password = useInputValidation("");
  const [isloading, setisloading] = useState(false);
  const {user}=useSelector(state=>state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const config = {
      withCredentials: true,
      "Content-Type": "application/json",
    };
    try {
      setisloading(true);
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.data));
      toast.success(data.message);
      
      
      navigate("/chatroom");
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.data || "Something went wrong"
      );
    } finally {
      setisloading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // await loginWithPopup(); // Use popup instead of redirect
      // const userToken = await getAccessTokenSilently();
      // console.log("Access Token:", userToken);
      // console.log(user)
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const { data } = await axios.post(
        `${server}/api/v1/user/auth0-login`,
        {
          email: user.email,
          name: user.displayName,
          authtype: "google",
          avatar: user.photoURL,
        },
        { withCredentials: true }
      );

      dispatch(userExists(data.data));
      toast.success(data.message);
          
      navigate("/chatroom");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back to Chatkaro
        </h2>
        <p className="text-gray-500 text-center mt-2">Login to continue</p>

        {/* Manual Login Form */}
        <form className="mt-6 space-y-5" onSubmit={handleLogin}>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Username"
              value={username.value}
              required
              onChange={username.changeHandler}
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="password"
              placeholder="Password"
              value={password.value}
              required
              onChange={password.changeHandler}
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold text-base transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
        <div className="text-[0.9rem] flex flex-row justify-end pt-[0.6rem]">
          <a href="/forgot-password" className="text-blue-600 text-right">
            Forgot password
          </a>
        </div>
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="w-full h-[1px] bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-base">OR</span>
          <div className="w-full h-[1px] bg-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 py-3 rounded-lg text-white font-semibold text-base transition duration-300 ease-in-out shadow-md hover:shadow-lg"
          >
            <FaGoogle className="text-lg" /> Login with Google
          </button>
          {/* <button
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold text-base transition duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          <FaFacebook className="text-lg" /> Login with Facebook
        </button> */}
        </div>
        <div className="text-center mt-4">
          <span
            className="inline-block px-6 py-3 text-blue-600 font-semibold border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
}
export default Login;
