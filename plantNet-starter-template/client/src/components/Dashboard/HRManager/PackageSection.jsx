import { useState, useEffect } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PackageSection = () => {

  const navigate = useNavigate();
  
  const [currentTeamCount, setCurrentTeamCount] = useState(3);
  const [packageLimit, setPackageLimit] = useState(5);
  const [users, setUsers] = useState([]);
  const [teamId, setTeamId] = useState("teamId123");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/all-users`);
      setUsers(data.map((user) => ({ ...user, isSelected: false })));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddToTeam = (userId) => {
    if (currentTeamCount < packageLimit) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isSelected: !user.isSelected } : user
        )
      );
    } else {
      toast.error("Package limit reached. Please increase your package.");
    }
  };



  const handleIncreaseLimit = () => {
    navigate("/dashboard/packages");
  };

  const handleAddSelected = async () => {
    const selectedUsers = users.filter((user) => user.isSelected);
    if (selectedUsers.length === 0) {
      toast.error("No users selected.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-to-team`,
        {
          users: selectedUsers.map((user) => ({ _id: user._id })),
          teamId,
        }
      );

      if (response.data.success) {
        toast.success("Selected users have been added to your team!");
        setUsers((prevUsers) => prevUsers.filter((user) => !user.isSelected));
        setCurrentTeamCount((prevCount) => prevCount + selectedUsers.length);
      } else {
        toast.error(response.data.message || "There was an error adding users to the team.");
      }
    } catch (error) {
      console.error("Error adding users to the team:", error);
      toast.error("There was an error adding users to the team.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Your Team</h2>

      {/* Package Info */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-lg">Team Members: <span className="font-bold">{currentTeamCount}</span></p>
          <p className="text-lg">Package Limit: <span className="font-bold">{packageLimit}</span></p>
        </div>
        <button
        onClick={handleIncreaseLimit}
          className="bg-yellow-500 px-6 py-3 text-lg font-medium rounded-lg hover:bg-yellow-600 transition duration-200"
        >
          Increase Limit
        </button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={user.isSelected || false}
                onChange={() => handleAddToTeam(user._id)}
                className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 rounded-full cursor-pointer mr-4"
              />
              <img
                src={user.photo}
                alt={user.name}
                className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm"
              />
            </div>
            <h4 className="text-xl font-semibold">{user.name}</h4>
          </div>
        ))}
      </div>

      {/* Add Selected Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleAddSelected}
          className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white text-lg font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200"
        >
          Add Selected Members to Team
        </button>
      </div>
    </div>
  );
};

export default PackageSection;
