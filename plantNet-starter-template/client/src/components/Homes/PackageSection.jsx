import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PackageSection = () => {
  const navigate = useNavigate();
  const [employeeLimit, setEmployeeLimit] = useState(5); // Initial employee limit
  const [packages, setPackages] = useState([
    { id: 1, members: 5, price: 5 },
    { id: 2, members: 10, price: 8 },
    { id: 3, members: 20, price: 15 },
  ]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', image: 'https://i.postimg.cc/JhYxLW72/image.png' },
    { id: 2, name: 'Jane Smith', image: 'https://i.postimg.cc/JhYxLW72/image.png' },
    { id: 3, name: 'Michael Lee', image: 'https://i.postimg.cc/JhYxLW72/image.png' },
    // Add more users as needed
  ]);
  const [teamMembers, setTeamMembers] = useState([]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = () => {
    if (selectedPackage) {
      setEmployeeLimit(employeeLimit + selectedPackage.members);
      alert(`You have purchased the package for ${selectedPackage.members} members.`);
  
      navigate('/dashboard/my-employee') // Redirect to employee page after purchase
    }
  };

  const handleAddToTeam = (employee) => {
    if (!teamMembers.includes(employee)) {
      setTeamMembers([...teamMembers, employee]);
      alert(`${employee.name} added to the team!`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Employee Limit and Packages</h2>
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <div>
            <p className="text-xl">Current Employee Limit: {employeeLimit}</p>
          </div>
          <button
            onClick={() => navigate('dashboard/add-employee')} // Navigate to employee page for adding employees
            className="bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
          >
            Add Employees
          </button>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Choose a Package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 ${
                selectedPackage?.id === pkg.id ? 'border-4 border-blue-500' : ''
              }`}
            >
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                {pkg.members} Members for ${pkg.price}
              </h3>
              <button
                onClick={() => handlePackageSelect(pkg)}
                className={`${
                  selectedPackage?.id === pkg.id ? 'bg-blue-500' : 'bg-gray-500'
                } text-white py-2 px-4 rounded-lg w-full mb-4 transition duration-300 ease-in-out hover:bg-blue-600`}
              >
                {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="mt-8">
            <button
              onClick={handlePurchase}
              className="bg-green-500 text-white py-3 px-8 rounded-lg w-full hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Purchase Package
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Employees to Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <img
                src={employee.image}
                alt={employee.name}
                className="w-16 h-16 rounded-full object-cover shadow-lg"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">{employee.name}</p>
              </div>
              <button
                onClick={() => handleAddToTeam(employee)}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Add to the Team
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageSection;
