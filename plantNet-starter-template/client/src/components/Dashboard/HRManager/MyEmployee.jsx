import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyEmployee = () => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axiosSecure.get("/my-team", {
        });
        setTeam(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch team data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [axiosSecure]);

  useEffect(() => {
    if (team) console.table(team);
  }, [team]);

  if (loading) return <p>Loading team data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!team) return <p>No team data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2>Total: {team?.teamMembers?.length || 0}</h2>
      <h2 className="text-2xl font-bold mb-4">{team?.companyName} Team</h2>
      <p className="text-gray-600">Team Leader: {team?.fullName}</p>
      <p className="text-gray-600">Email: {team?.email}</p>
      <img src={team?.companyLogo} alt="Company Logo" className="w-20 h-20 rounded-full mt-2" />

      <h3 className="text-xl font-semibold mt-6 mb-3">Team Members</h3>
      <ul className="divide-y divide-gray-300">
        {team?.teamMembers?.length === 0 ? (
          <p>No team members found.</p>
        ) : (
          team?.teamMembers?.map((member) => (
            <li key={member._id} className="py-3 flex items-center gap-4">
              <img src={member.photo} alt={member.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
                <p className="text-sm text-blue-600">{member.role}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default MyEmployee;
