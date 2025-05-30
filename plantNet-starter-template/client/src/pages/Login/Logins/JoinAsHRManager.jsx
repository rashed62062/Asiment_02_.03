import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProvider';

const JoinAsHRManager = () => {
  const { createUser, updateUserProfile } = useAuth(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    selectedPackage: '',
    companyLogo: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      companyLogo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { fullName, companyName, email, password, dateOfBirth, selectedPackage, companyLogo } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', fullName);
    formDataToSend.append('companyName', companyName);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    formDataToSend.append('dateOfBirth', dateOfBirth);
    formDataToSend.append('selectedPackage', selectedPackage);
    if (companyLogo) {
      formDataToSend.append('companyLogo', companyLogo);
    }

    try {
      // Step 1: Create user with email/password
      const result = await createUser(email, password);
      console.log("User Created:", result);

      // Step 2: Upload user profile photo
      await updateUserProfile(fullName, companyLogo?.name || '');

      // Step 3: Send form data to the backend
      await axios.post(`${import.meta.env.VITE_API_URL}/hr-manager`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsSubmitted(true);
      toast.success("Registration successful!");

      // Redirect to payment page after registration
      navigate('/payment');

      // Reset the form
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        selectedPackage: '',
        companyLogo: null,
      });

    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "An error occurred.");
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Join as HR Manager</h1>

        {isSubmitted ? (
          <div className="text-center text-lg text-green-600">
            <p>Registration successful! Redirecting to payment...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="input-style" />
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} required className="input-style" />
            </div>

            {/* Company Logo */}
            <div>
              <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700">Company Logo</label>
              <input type="file" id="companyLogo" name="companyLogo" accept="image/*" onChange={handleFileChange} className="input-style" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="input-style" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required className="input-style" />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="input-style" />
            </div>

            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Package</label>
              <div className="flex space-x-4">
                {['5 Members for $5', '10 Members for $8', '20 Members for $15'].map((pkg) => (
                  <div key={pkg}>
                    <input type="radio" id={pkg} name="selectedPackage" value={pkg} checked={formData.selectedPackage === pkg} onChange={handleInputChange} className="focus:ring-blue-500" />
                    <label htmlFor={pkg} className="ml-2 text-sm">{pkg}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full py-3 mt-4 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition duration-300" disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Signup'}
            </button>

            {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default JoinAsHRManager;
