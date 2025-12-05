import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_PASSWORD) {
      localStorage.setItem("authToken", "LOGGED_IN");
      navigate("/");
    } else {
        toast.error("Wrong Password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80 text-center border border-gray-300"
      >
        <h2 className="text-xl font-bold mb-4">Enter Password</h2>

        <input
          type="password"
          className="w-full border p-2 rounded mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
}
