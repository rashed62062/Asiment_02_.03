import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PackageSelector from '../../../components/Shared/PackageSelector';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import useAuth from '../../../hooks/useAuth';
import { ImageUpload } from '../../../utils';



const JoinAsHRManager = () => {
const { createUser, updateUserProfile } = useAuth();

  const axiosSecure = useAxiosPublic();
  
  
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    companyLogo: null,
    email: '',
    password: '',
    dateOfBirth: '',
    package: '',
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const packages = [
    { id: '1', name: '5 Members', price: 5, description: '5 Members for $5' },
    { id: '2', name: '10 Members', price: 8, description: '10 Members for $8' },
    { id: '3', name: '20 Members', price: 15, description: '20 Members for $15' },
  ];

  useEffect(() => {
    if (formData.companyLogo) {
      const objectUrl = URL.createObjectURL(formData.companyLogo);
      setLogoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLogoPreview(null);
    }
  }, [formData.companyLogo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.package) newErrors.package = 'Package selection is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
     

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const selectedPackage = packages.find(pkg => pkg.id === formData.package);
      if (!selectedPackage) throw new Error('Selected package not found');

     


      let logoUrl = '';
try {
  logoUrl = await ImageUpload(formData.companyLogo); 
} catch (error) {
  console.error('Image upload failed', error);
  setErrors({ ...errors, form: 'Image upload failed. Please try again.' });
  setIsSubmitting(false);
  return;
}


      const formattedData = {
        fullName: formData.fullName,
        companyName: formData.companyName,
        companyLogo: logoUrl,
        email: formData.email,
        password: formData.password,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString().split('T')[0],
        package: {
          id: selectedPackage.id,
          name: selectedPackage.name,
          price: selectedPackage.price,
          maxEmployees:
            selectedPackage.name.includes('5') ? 5 :
            selectedPackage.name.includes('10') ? 10 :
            selectedPackage.name.includes('20') ? 20 : 0
        },
        employees: [],
        createdAt: new Date().toISOString()
      };

      console.log("Registration data:", formattedData);

      // Send data to your backend API
      const response = await axiosSecure.post('/hr/register', formattedData);
      console.log("Registration response:", response.data);

      


     // 3. Finally, sign in the user
      await createUser(formData.email, formData.password);
await updateUserProfile(formData.fullName, logoUrl || 'https://default-url.com/image.jpg');


            navigate('/dashboard', {
                state: {
                    package: selectedPackage,
                    email: formData.email,
                    registrationData: response.data
                },
            });
        } catch (error) {
            console.error('Registration failed:', error);
            setErrors({
                ...errors,
                form: error.response?.data?.message || error.message || 'Registration failed. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
  
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
          HR Manager Registration
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-white p-10 rounded-xl shadow-lg">
        {errors.form && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {errors.form}
          </div>
        )}
        
        <form className="space-y-8" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`peer placeholder-transparent w-full border rounded-md px-3 pt-5 pb-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                autoComplete="name"
              />
              <label htmlFor="fullName" className="absolute left-3 top-2 text-sm text-gray-600 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400">
                Full Name
              </label>
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Company Name */}
            <div className="relative">
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className={`peer placeholder-transparent w-full border rounded-md px-3 pt-5 pb-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                autoComplete="organization"
              />
              <label htmlFor="companyName" className="absolute left-3 top-2 text-sm text-gray-600 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400">
                Company Name
              </label>
              {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>}
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (optional)</label>
            <input
              type="file"
              name="companyLogo"
              id="companyLogo"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoPreview && (
              <img src={logoPreview} alt="Preview" className="mt-3 max-h-24 rounded-md border object-contain" />
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Email & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={`peer placeholder-transparent w-full border rounded-md px-3 pt-5 pb-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                autoComplete="email"
              />
              <label htmlFor="email" className="absolute left-3 top-2 text-sm text-gray-600 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400">
                Email address
              </label>
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`peer placeholder-transparent w-full border rounded-md px-3 pt-5 pb-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                autoComplete="new-password"
              />
              <label htmlFor="password" className="absolute left-3 top-2 text-sm text-gray-600 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400">
                Password
              </label>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* DOB */}
          <div className="relative">
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="Date of Birth"
              className={`peer placeholder-transparent w-full border rounded-md px-3 pt-5 pb-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <label htmlFor="dateOfBirth" className="absolute left-3 top-2 text-sm text-gray-600 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400">
              Date of Birth
            </label>
            {errors.dateOfBirth && <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Package */}
          <PackageSelector
            packages={packages}
            selectedPackageId={formData.package}
            onSelect={(id) => setFormData({ ...formData, package: id })}
            error={errors.package}
          />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-6 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="white" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinAsHRManager;