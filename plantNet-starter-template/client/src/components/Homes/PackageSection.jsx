import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import AddEmployeeForm from '../Dashboard/HRManager/AddEmployeeForm';

const PackageSection = () => {
  const axiosSecure = useAxiosPublic();
  const navigate = useNavigate();

  const [employeeLimit, setEmployeeLimit] = useState(5);
  const [employees, setEmployees] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [packages] = useState([
    { id: 1, members: 5, price: 5 },
    { id: 2, members: 10, price: 8 },
    { id: 3, members: 20, price: 15 },
  ]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/all-users");
        setEmployees(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [axiosSecure]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handlePurchase = async () => {
    if (selectedPackage) {
      try {
        await axiosSecure.patch('/hr/upgrade-package', {
          packageId: selectedPackage.id,
          members: selectedPackage.members,
          price: selectedPackage.price,
        });

        setEmployeeLimit(prev => prev + selectedPackage.members);
        alert(`You have purchased ${selectedPackage.members} members package.`);
        navigate('/dashboard/my-employee');
      } catch (err) {
        console.error(err);
        alert("Failed to upgrade package.");
      }
    }
  };

  const handleAddToTeam = (employee) => {
    if (!teamMembers.find(e => e.id === employee.id)) {
      if (teamMembers.length >= employeeLimit) {
        alert("Employee limit reached.");
        return;
      }
      setTeamMembers([...teamMembers, employee]);
      alert(`${employee.name} added to the team!`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Employee Limit and Packages</h2>
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
          <p className="text-xl">Current Employee Limit: {employeeLimit}</p>
          <button
            onClick={() => navigate('/dashboard/add-employee')}
            className="bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-600"
          >
            Add Employees
          </button>
        </div>
      </div>

      {/* Packages */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Choose a Package</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map(pkg => (
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
                } text-white py-2 px-4 rounded-lg w-full mb-4`}
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
              className="bg-green-500 text-white py-3 px-8 rounded-lg w-full hover:bg-green-600"
            >
              Purchase Package
            </button>
          </div>
        )}
      </div>

      {/* Add Employees */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Employees to Team</h2>
        {loading && <p>Loading employees...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map(employee => (
            <div
              key={employee.id}
              className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4"
            >
              <img
                src={employee.image}
                alt={employee.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">{employee.name}</p>
              </div>
              <button
                onClick={() => handleAddToTeam(employee)}
                className="ml-auto bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              >
                Add to the Team
              </button>
            </div>
          ))}
        </div>
        
      </div>
      <div>
        <h1>My team</h1>
        <AddEmployeeForm></AddEmployeeForm>
      </div>
    </div>
  );
};

export default PackageSection;
