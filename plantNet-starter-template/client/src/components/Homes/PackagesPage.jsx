import { FaUsers, FaDollarSign } from "react-icons/fa";

const PackagesPage = () => {
  const packages = [
    { id: 1, members: 5, price: 5, popular: false },
    { id: 2, members: 10, price: 8, popular: true },
    { id: 3, members: 20, price: 15, popular: false },
  ];

  const handlePurchase = (members) => {
    // Update package limit (simulate purchase)
    alert(`Package purchased! Your new limit is increased by ${members} members.`);
    // Redirect to the Add Employee Page
    window.location.href = "/add-employee";
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Choose a Package
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Upgrade your employee limit with our affordable packages!
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white shadow-lg p-8 rounded-lg max-w-sm text-center transition-transform transform hover:scale-105 hover:shadow-2xl ${
              pkg.popular ? "border-2 border-blue-500" : ""
            }`}
          >
            {/* Badge for Popular Plan */}
            {pkg.popular && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            {/* Plan Icon */}
            <div className="flex justify-center items-center text-blue-500 mb-4">
              <FaUsers className="text-4xl" />
            </div>

            {/* Plan Details */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {pkg.members} Members
            </h3>
            <p className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <FaDollarSign />
              {pkg.price}
            </p>
            <p className="text-gray-600 mb-6">
              Get access to {pkg.members} additional team members for only ${pkg.price}.
            </p>

            {/* Buy Now Button */}
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-200"
              onClick={() => handlePurchase(pkg.members)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesPage;
