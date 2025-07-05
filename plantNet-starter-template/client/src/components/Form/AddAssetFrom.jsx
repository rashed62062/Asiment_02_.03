import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../providers/AuthProvider";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddAssetForm = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      productType: "Returnable",
      quantity: 1,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Quantity validation
    if (data.quantity <= 0) {
      setError("Quantity must be greater than zero.");
      setLoading(false);
      return;
    }

    const formData = {
      name: data.name,
      HR: {
        email: user?.email,
        name: user?.displayName,
      },
      productType: data.productType,
      quantity: parseFloat(data.quantity),
      AddDate: new Date().toISOString(),
    };

    try {
      await axiosSecure.post(`/assets`, formData);
      setSuccess(true);
      reset(); // Reset form after success
      toast.success("Asset added successfully!");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to add the asset. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                  id="name"
                  type="text"
                  placeholder="Product Name"
                  {...register("name", { required: "Product name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              {/* Product Type */}
              <div className="space-y-1 text-sm">
                <label htmlFor="productType" className="block text-gray-600">
                  Product Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-lime-300 focus:ring-2 focus:ring-lime-500 rounded-md bg-white shadow-sm"
                  id="productType"
                  {...register("productType")}
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
                  id="quantity"
                  type="number"
                  placeholder="Available Quantity"
                  min="1"
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: {
                      value: 1,
                      message: "Quantity must be at least 1",
                    },
                    valueAsNumber: true,
                  })}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.quantity.message}
                  </p>
                )}
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

          {/* Feedback Messages */}
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          {success && (
            <p className="text-green-600 text-center mt-4">
              Asset added successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAssetForm;