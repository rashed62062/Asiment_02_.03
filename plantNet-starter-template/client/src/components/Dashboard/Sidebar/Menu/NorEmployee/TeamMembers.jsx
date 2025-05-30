import React from 'react';
import { FaUserShield, FaUser } from 'react-icons/fa';

const TeamMembers = () => {
  // Sample team member data
  const members = [
    {
      id: 1,
      name: 'John Doe',
      image: 'https://i.postimg.cc/DZFLMKy2/certificate.jpg',
      type: 'admin', // Can be 'admin' or 'normal'
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: 'https://i.postimg.cc/DZFLMKy2/certificate.jpg',
      type: 'normal', // Can be 'admin' or 'normal'
    },
    {
      id: 3,
      name: 'Alice Johnson',
      image: 'https://i.postimg.cc/xdVzXSmK/user3.jpg',
      type: 'admin', // Can be 'admin' or 'normal'
    },
  ];

  return (
    <section className="bg-gradient-to-r from-blue-100 to-purple-200 py-16">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          My team Members 
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white shadow-lg transform transition-all hover:scale-105 hover:shadow-xl rounded-xl p-6 text-center relative overflow-hidden"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 transition-transform duration-300 hover:scale-110"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <div className="mt-2 flex justify-center items-center">
                {member.type === 'admin' ? (
                  <FaUserShield className="text-blue-600 text-2xl" />
                ) : (
                  <FaUser className="text-gray-600 text-2xl" />
                )}
                <span className="ml-2 text-sm font-medium text-gray-500">{member.type}</span>
              </div>

              {/* Hover Overlay for Extra Interactivity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
