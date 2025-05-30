import { useState } from "react";

const Add = () => {
  // State for tracking employee count, package limit, and unaffiliated users
  const [employeeCount, setEmployeeCount] = useState(3); // Current number of employees
  const [packageLimit, setPackageLimit] = useState(5); // Current package limit
  const [unaffiliatedUsers, setUnaffiliatedUsers] = useState([
    {
      id: 1,
      image: "https://i.postimg.cc/JhYxLW72/image.png",
      name: "John Doe",
    },
    {
      id: 2,
      image: "https://i.postimg.cc/wjGRxxJL/user3.jpg",
      name: "Jane Smith",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/50",
      name: "Alice Johnson",
    },
  ]);

  // Function to add a user to the team
  const addToTeam = (userId) => {
    if (employeeCount < packageLimit) {
      setUnaffiliatedUsers((prev) => prev.filter((user) => user.id !== userId));
      setEmployeeCount((prev) => prev + 1);
    } else {
      alert("You have reached the package limit. Please increase the limit.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Package Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Package Information</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700">
            <strong>Current Employees:</strong> {employeeCount}
          </p>
          <p className="text-gray-700">
            <strong>Package Limit:</strong> {packageLimit}
          </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              window.location.href = "/packages"; // Redirect to packages page
            }}
          >
            Increase Limit
          </button>
        </div>
      </section>

      {/* Unaffiliated Users Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Unaffiliated Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unaffiliatedUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md p-4 rounded-lg flex items-center space-x-4"
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
              </div>
              <button
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 ml-auto"
                onClick={() => addToTeam(user.id)}
              >
                Add to Team
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Add;
