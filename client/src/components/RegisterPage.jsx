import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { MdOutlineMail, MdOutlinePassword } from "react-icons/md";  
import { FaRegEye, FaRegEyeSlash, FaUser } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import API_URL from "../../config";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordView = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        { username, email, password },
        { withCredentials: true }
      );
      // console.log("registered successful:", response.data);

      setMessage({ text: "🎉 Registered Successful!", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error("Register failed:", error.response?.data || error.message);
      setMessage({ text: "Register Failed. Try again", type: "error" });
    }
  };

  return (
    <div className="w-full h-screen relative flex items-center justify-center px-4"> 

      {/* Register Box */}
      <form
        onSubmit={handleSubmit}
        className="relative z-20 w-[90%] max-w-lg p-8 sm:p-10 bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center gap-6 text-white"
      >
        <h1 className="text-3xl font-bold">Welcome!</h1>

        {message.text && (
          <p
            className={`text-base font-medium ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Inputs */}
        <div className="w-full flex flex-col gap-5 mt-5">

          {/* User */}
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
            <FaUser  className="text-white" size={18} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="bg-transparent border-none outline-none w-full text-base placeholder-gray-400 text-white"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition ">
            <MdOutlineMail className="text-white" size={22} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="bg-transparent border-none outline-none w-full text-base placeholder-gray-400 text-white "
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg relative hover:bg-gray-700 transition">
            <MdOutlinePassword className="text-white" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent border-none outline-none w-full text-base placeholder-gray-400 text-white"
              required
            />
            {showPassword ? (
              <FaRegEyeSlash
                onClick={togglePasswordView}
                className="absolute right-4 text-white cursor-pointer"
              />
            ) : (
              <FaRegEye
                onClick={togglePasswordView}
                className="absolute right-4 text-white cursor-pointer"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600 rounded-lg transition font-semibold"
        >
          Register
        </button>

        {/* Divider */} 
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-gray-700"></div>
            <span className="px-4 text-sm text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        
        {/* Social */}
        <div className="flex justify-center w-full">
          <div className="flex items-center p-3 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition">
            <FcGoogle size={24} />
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
