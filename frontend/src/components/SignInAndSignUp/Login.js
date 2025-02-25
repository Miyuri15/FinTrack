import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode"; // Correct import

function Login() {
  const navigate = useNavigate();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: enteredEmail, password: enteredPassword }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Login failed");
        }

        // Store token in local storage
        localStorage.setItem("token", result.token);

        // Decode the token
        const decodedToken = jwtDecode(result.token); // Use jwtDecode directly
        console.log("Decoded token:", decodedToken); // Debugging

        // Redirect based on role
        if (decodedToken.role === "admin") {
            navigate("/dashboard");
        } else {
            navigate("/dashboard");
        }
    } catch (error) {
        setErrorMessage(error.message);
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.message,
            timer: 2000,
            showConfirmButton: false,
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side with Image and Intro Text */}
      <div
        className="relative hidden h-full md:flex md:w-3/5 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/loginscrn.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-70"></div>
        <div className="absolute top-9 left-9 cursor-pointer w-90 h-90">
          <img src="/images/logo.png" alt="Logo" className="w-140 h-34 mx-5" />
        </div>
        <div className="flex flex-col items-start justify-end p-10 bg-blue-900 bg-opacity-30 text-white h-full w-full">
          <h1 className="text-3xl font-bold mb-5">Login</h1>
          <h2 className="text-4xl font-extrabold mb-3">SKILLS CAREERS</h2>
          <p className="text-md leading-relaxed mb-9">
            Welcome to Skill Careers, where finding your dream job or the right
            talent is just a click away.
          </p>
        </div>
      </div>

      {/* Right Side with Form */}
      <div className="flex flex-col justify-center md:w-2/5 p-8">
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/logo.png"
            alt="logo"
            width={140}
            height={40}
            className="mb-5 ml-10 md:hidden"
          />
          <h2 className="text-xl text-blue-900 font-semibold text-center mb-2">
            Welcome Back! Let's Get You Started.
          </h2>
          <p className="text-blue-900 text-center text-md mt-4 mb-4 font-medium">
            Log in to access your account and continue your Financial Planing
          </p>
        </div>

        <form className="space-y-4 text-blue-900" onSubmit={handleLogin}>
          <label className="block">
            <input
              type="email"
              id="email"
              required
              ref={emailInputRef}
              className="w-full px-3 py-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
              placeholder="Email"
            />
          </label>

          <label className="block">
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
              className="w-full px-3 py-2 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-900 font-semibold"
              placeholder="Password"
            />
          </label>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-md font-medium text-center mt-2 text-black">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-900 font-bold">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;