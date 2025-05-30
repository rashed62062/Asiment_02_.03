import { useContext, useState } from "react";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from "../../providers/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const AddPlantForm = () => {
  const { user } = useContext(AuthContext);

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = event.target;
    const name = form.name.value;
    const productType = form.productType.value;
    const quantity = parseFloat(form.quantity.value);
    const AddDate =  new Date().toISOString()

    const formData = {
      name,
      HR: {
        email: user?.email,
        name: user?.displayName,
      },
      productType,
      quantity,
      AddDate,
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/assets`, formData);
      setSuccess(true);
      form.reset(); // Reset form after success
      toast.success('added successfully asset')
    } catch (error) {
      setError("Failed to add the asset. Please try again.",error);
      toast.error('Failed to add the asset',error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center bg-gray-100 py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Add a New Asset
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-lime-600">
                Basic Information
              </h3>
              {/* Name */}
              <div className="space-y-1 text-sm">
                <label htmlFor="name" className="block text-gray-600">
                  Product Name
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:ring-2 focus:ring-lime-500 rounded-md bg-white shadow-sm"
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Product Name"
                  required
                />
              </div>
              {/* Select Product Type */}
              <div className="space-y-1 text-sm">
                <label htmlFor="productType" className="block text-gray-600">
                  Product Type
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-lime-300 focus:ring-2 focus:ring-lime-500 rounded-md bg-white shadow-sm"
                  name="productType"
                >
                  <option value="Returnable">Returnable</option>
                  <option value="Non-returnable">Non-returnable</option>
                </select>
              </div>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-lime-600">
                Additional Details
              </h3>
              {/* Quantity */}
              <div className="space-y-1 text-sm">
                <label htmlFor="quantity" className="block text-gray-600">
                  Quantity
                </label>
                <input
                  className="w-full px-4 py-3 text-gray-800 border border-lime-300 focus:ring-2 focus:ring-lime-500 rounded-md bg-white shadow-sm"
                  name="quantity"
                  id="quantity"
                  type="number"
                  placeholder="Available Quantity"
                  min="1"
                  required
                />
              </div>


              
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              className={`w-full lg:w-1/2 mx-auto p-3 text-lg font-medium text-white transition duration-200 rounded-md shadow-md ${
                loading ? "bg-gray-500" : "bg-lime-500 hover:bg-lime-600"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>

          {/* Error or Success Message */}
          {error && (
            <p className="text-red-600 text-center mt-4">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center mt-4">Asset added successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddPlantForm;
