
import { useNavigate } from "react-router-dom";

const PackagesPage = ({ setPackageLimit }) => {
  const packages = [
    { id: 1, members: 5, price: 5 },
    { id: 2, members: 10, price: 8 },
    { id: 3, members: 20, price: 15 },
  ];

  const navigate = useNavigate();

  const handlePurchase = (members) => {
    setPackageLimit(members);
    alert(`Successfully purchased package for ${members} members!`);
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose a Package</h2>
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
          >
            <p className="text-lg font-medium text-gray-700">
              {pkg.members} members for ${pkg.price}
            </p>
            <button
              onClick={() => handlePurchase(pkg.members)}
              className="bg-lime-500 text-white px-4 py-2 rounded-md hover:bg-lime-600"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;

