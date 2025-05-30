import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../../../hooks/useAuth";
import { AuthContext } from "../../../../../providers/AuthProvider";

const AssetPage = () => {
  const {user} = useAuth(AuthContext)
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("");
  const [type, setType] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [notes, setNotes] = useState("");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch assets when search or filters change
  useEffect(() => {
    fetchAllAssets();
  }, [search, availability, type]);

  // Fetch assets with search and filters
  const fetchAllAssets = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/all-assets`, {
        params: {
          search,
          availability,
          type,
        },
      });
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle request submission
  const handleRequest = async () => {
    if (!selectedAsset) return;

    const requestData = {
      assetId: selectedAsset._id,
      notes,
      
      productQuantity: selectedAsset.productQuantity,
      productType: selectedAsset.productType,
      requestDate: new Date().toISOString(),
      
      requestedBy:{
        email: user?.email,
        name: user?.displayName,
      },
      status:'pending',
     
      name: selectedAsset.name,
      

    };

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/request-asset`, requestData);
      toast.success("Request submitted successfully!");
      setSelectedAsset(null);
      setNotes("");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit the request.");
    }
  };

  return (
    <div className="p-6">
      {/* Loading State */}
      {loading && <div className="text-center text-lg text-gray-600">Loading assets...</div>}

      {/* Search Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex gap-4">
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Availability</option>
          <option value="available">Available</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">All Types</option>
          <option value="returnable">Returnable</option>
          <option value="non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Assets List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => {
          // Determine availability based on quantity length
          const isAvailable = asset.quantity > 1;
          const availabilityStatus = isAvailable ? "Available" : "Out of Stock";
          return (
            <div
              key={asset._id}
              className="p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold">{asset.name}</h3>
              <p>Type: {asset.productType}</p>
              <p>
                Availability:{" "}
                <span
                  className={`${
                    isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {availabilityStatus}
                </span>
              </p>
              <button
                disabled={!isAvailable}
                onClick={() => setSelectedAsset(asset)}
                className={`mt-2 px-4 py-2 rounded-md ${
                  isAvailable
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
              >
                Request
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold">Request Asset</h2>
            <p className="mt-2">Asset: {selectedAsset.name}</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full mt-4 p-2 border border-gray-300 rounded-md"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetPage;
