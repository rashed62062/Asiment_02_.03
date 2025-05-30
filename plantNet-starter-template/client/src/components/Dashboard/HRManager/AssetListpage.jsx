import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const AssetListpage = () => {
  const [asset, setAsset] = useState([]);

  useEffect(() => {
    fetchAllAssets();
  }, []);

  const fetchAllAssets = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-assets`
      );
      setAsset(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:bg-blue-100"
        />
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex gap-6 items-center justify-between">
        <div className="flex gap-4">
          <select
            className="p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="">All Stock Status</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            className="p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          >
            <option value="">All Types</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>
        </div>

        {/* Sorting Section */}
        <select
          className="p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        >
          <option value="">Sort by Quantity</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* List Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {asset.map((product) => {
          // Determine product status
          const status =
            product.quantity === 0
              ? "Out of Stock"
              : product.quantity <= 1
              ? "Available"
              : "Available";

          return (
            <div
              key={product.id}
              className="p-4 border bg-white border-gray-300 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-700 mt-2">Type: {product.productType}</p>
              <p className="text-gray-700">Quantity: {product.quantity}</p>
              <p className="text-gray-700">
                Date Added: {format(new Date(product.AddDate), "P")}
              </p>
              <p className="mt-2">
                Status:{" "}
                <span
                  className={`${
                    status === "Available"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </span>
              </p>
              <div className="flex gap-3 mt-4">
                <NavLink
                  to={`/update/${product._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 ease-in-out"
                >
                  Update
                </NavLink>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetListpage;
