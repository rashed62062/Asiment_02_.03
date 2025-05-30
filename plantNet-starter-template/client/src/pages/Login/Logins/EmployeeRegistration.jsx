import { useState } from "react";
import { FcGoogle } from "react-icons/fc"; // Icon for Google login
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const EmployeeRegistration = () => {
  const {signInWithGoogle} = useAuth(AuthContext)
    const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.dateOfBirth) {
      toast.error("All fields are required!");
      return;
    }

    toast.success("Employee registered successfully!");
    setFormData({ fullName: "", email: "", password: "", dateOfBirth: "" });
  };

  const handleGoogleSignIn = async () => {
    try {
      //User Registration using google
      await signInWithGoogle()
      toast.success('Login Successful')
      navigate('/')
    } catch (err) {
      console.log(err)
      toast.error(err?.message)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #6A11CB 0%, #2575FC 100%)",
      }}
    >
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Register New Employee
        </h2>

        {/* Form Section */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="px-4 text-gray-500">OR</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        {/* Social Login Section */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            <FcGoogle className="text-xl mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
