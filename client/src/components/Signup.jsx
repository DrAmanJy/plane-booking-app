import { useState } from "react";
import { useNavigate } from "react-router";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isBluer, setIsBluer] = useState({});
  const [formError, setFormError] = useState({});
  const [disable, setDisable] = useState(true);
  // const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsBluer((prev) => ({
      ...prev,
      [name]: false,
    }));
    setFormError({});
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setIsBluer((prev) => ({
      ...prev,
      [name]: true,
    }));
    validation({ name, value });
  };

  const validation = ({ name, value }) => {
    let error = "";
    const trimmedValue = value.trim();

    switch (name) {
      case "name":
        if (!trimmedValue) {
          error = "Please enter your name.";
        } else if (trimmedValue.length < 3) {
          error = "Name must be at least 3 characters.";
        }
        break;

      case "email":
        if (!trimmedValue) {
          error = "Please enter your email.";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmedValue)
        ) {
          error = "Invalid email address.";
        }
        break;

      case "password":
        if (!trimmedValue) {
          error = "Please enter your password.";
        } else if (!/[0-9]/.test(trimmedValue)) {
          error = "Password must include at least one number.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(trimmedValue)) {
          error = "Password must include at least one special character.";
        } else if (trimmedValue.length < 6) {
          error = "Password must be at least 6 characters.";
        }
        break;

      default:
        break;
    }

    setFormError((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Registered successfully");
        // navigate("/");
      } else {
        const errorData = await res.json();
        if (errorData.message === "Email already exists") {
          setFormError((prev) => ({ ...prev, email: errorData.message }));
        }
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              name="name"
              onChange={handleInput}
              onBlur={handleBlur}
              value={formData.name}
              type="text"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formError.name && (
              <p className="text-red-600 text-sm mt-1">{formError.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              name="email"
              onChange={handleInput}
              onBlur={handleBlur}
              value={formData.email}
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formError.email && (
              <p className="text-red-600 text-sm mt-1">{formError.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              name="password"
              onChange={handleInput}
              onBlur={handleBlur}
              value={formData.password}
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formError.password && (
              <p className="text-red-600 text-sm mt-1">{formError.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
