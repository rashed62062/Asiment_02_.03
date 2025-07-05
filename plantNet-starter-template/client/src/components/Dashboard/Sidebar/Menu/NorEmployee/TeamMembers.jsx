import { FaUser } from 'react-icons/fa';
import useCompanyInfo from '../../../../../hooks/useCompanyInfo';
import useAuth from '../../../../../hooks/useAuth';

const TeamMembers = () => {
  const { user } = useAuth();
  const { companyData, loading, error } = useCompanyInfo(user?.email);

  if (loading) return <p className="text-blue-500 text-center mt-10">Loading company info...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <section className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-16 min-h-screen">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Company Header */}
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-12">
  <img
    src={companyData?.companyLogo || 'https://i.ibb.co/7WBNM9N/default-avatar.png'}
    alt="Company Logo"
    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
  />
  <div></div>
          <div className="text-center align-middle sm:text-left">
            <h2 className="text-5xl font-bold  text-gray-800">{companyData?.companyName}</h2>
            <p className="text-gray-600 text-md">Total Employees: {companyData?.totalEmployees || 0}</p>
          </div>
        </div>

        {/* Section Title */}
        <h3 className="text-2xl font-semibold mb-8 text-gray-700 border-b-2 border-purple-400 inline-block">
          Team Members
        </h3>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {companyData?.employees?.map((emp, index) => (
            <div
              key={index}
              className="relative bg-white shadow-lg hover:shadow-2xl transition duration-300 rounded-2xl p-6 text-center overflow-hidden group"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"></div>

              {/* Image */}
              <img
                src={emp?.companyLogo || 'https://i.ibb.co/7WBNM9N/default-avatar.png'}
                alt={emp?.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white object-cover z-10 relative"
              />

              {/* Info */}
              <h4 className="text-xl font-semibold text-gray-800 z-10 relative">{emp?.name}</h4>
              <p className="text-gray-500 text-sm mb-3 z-10 relative">{emp?.email}</p>

              {/* Role */}
              <div className="flex justify-center items-center gap-2 z-10 relative">
                <FaUser className="text-purple-600" />
                <span className="text-sm text-gray-700 font-medium bg-purple-100 px-3 py-1 rounded-full">
                  Member
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
