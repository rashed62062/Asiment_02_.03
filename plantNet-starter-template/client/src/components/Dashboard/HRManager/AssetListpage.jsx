import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const AssetListpage = () => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllAssets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assets, searchTerm, stockFilter, typeFilter, sortOrder]);

  const fetchAllAssets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-assets`
      );
      setAssets(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching assets:", error);
      setError("Failed to fetch assets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...assets];

    if (searchTerm) {
      result = result.filter((asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockFilter) {
      if (stockFilter === "Available") {
        result = result.filter((asset) => asset.quantity > 0);
      } else if (stockFilter === "Out of Stock") {
        result = result.filter((asset) => asset.quantity <= 0);
      }
    }

    if (typeFilter) {
      result = result.filter((asset) => asset.productType === typeFilter);
    }

    if (sortOrder) {
      result.sort((a, b) => {
        return sortOrder === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      });
    }

    setFilteredAssets(result);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/assets/${id}`);
        fetchAllAssets();
      } catch (error) {
        console.error("Error deleting asset:", error);
        setError("Failed to delete asset. Please try again.");
      }
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    return date && !isNaN(parsedDate) ? format(parsedDate, "P") : "No Date";
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading assets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out hover:bg-blue-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex gap-6 items-center justify-between flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <select
            className="p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">All Stock Status</option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            className="p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Returnable">Returnable</option>
            <option value="Non-returnable">Non-returnable</option>
          </select>
        </div>

        <select
          className="p-3 border border-gray-300 rounded-md bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Quantity</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredAssets.length} of {assets.length} assets
      </div>

      {/* List Section */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          No assets found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((product) => {
            const status =
              product.quantity <= 0
                ? "Out of Stock"
                : product.quantity <= 5
                ? "Low Stock"
                : "Available";

            return (
              <div
                key={product._id}
                className="p-4 border bg-white border-gray-300 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-gray-700 mt-2">Type: {product.productType}</p>
                <p className="text-gray-700">Quantity: {product.quantity}</p>
                <p className="text-gray-700">Date Added: {formatDate(product.AddDate)}</p>
                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      status === "Available"
                        ? "text-green-600"
                        : status === "Low Stock"
                        ? "text-yellow-600"
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
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssetListpage;
