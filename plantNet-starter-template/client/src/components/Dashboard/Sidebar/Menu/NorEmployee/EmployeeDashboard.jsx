import { useState } from 'react';
import useCompanyInfo from '../../../../../hooks/useCompanyInfo';
import useAuth from '../../../../../hooks/useAuth';

const EmployeeDashboard = () => {
  // User and company data
  const { user } = useAuth()

    const { companyData, } = useCompanyInfo(user?.email);
    const isAffiliated = companyData?.companyName ? true : false;




  // Sample requests data
  const [pendingRequests] = useState([
    { id: 'REQ-001', type: 'Leave', date: '2023-06-15', status: 'Pending' },
    { id: 'REQ-002', type: 'Expense', date: '2023-06-10', status: 'In Review' }
  ]);

  const [monthlyRequests] = useState([
    { id: 'REQ-003', type: 'Leave', date: '2023-06-05', status: 'Approved', resolvedDate: '2023-06-08' },
    { id: 'REQ-004', type: 'Training', date: '2023-06-01', status: 'Rejected', resolvedDate: '2023-06-03' }
  ]);

  // Additional sections data
  const [events] = useState([
    { title: 'Team Meeting', date: '2023-06-20', time: '10:00 AM' },
    { title: 'Company Workshop', date: '2023-06-25', time: '2:00 PM' }
  ]);

  const [notices] = useState([
    { title: 'Office Closure', date: '2023-07-04', content: 'Office will be closed for Independence Day' }
  ]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'In Review': 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.displayName || ' NON'}</h1>
       
        {/* Company Status */}
         {!isAffiliated ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You are not currently affiliated with any company. Please contact your HR department.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-sm text-blue-700">
              Currently affiliated with: <span className="font-medium">{companyData?.companyName}</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Pending Requests</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  + New Request
                </button>
              </div>
             
              {pendingRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">You have no pending requests</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                            <button className="text-red-600 hover:text-red-900">Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Monthly Requests */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">My Monthly Requests</h2>
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                    <option>June 2023</option>
                    <option>May 2023</option>
                    <option>April 2023</option>
                  </select>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm font-medium">
                    Export
                  </button>
                </div>
              </div>
             
              {monthlyRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No requests made this month</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolved</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={request.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.resolvedDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No upcoming events</p>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                      <h3 className="font-medium text-gray-800">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notices */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Notices</h2>
              <div className="space-y-4">
                {notices.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No current notices</p>
                ) : (
                  notices.map((notice, index) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4 py-2">
                      <h3 className="font-medium text-gray-800">{notice.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                      <p className="text-xs text-gray-400 mt-1">Posted: {notice.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Leave Application Form
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Expense Reimbursement
                </a>
                <a href="#" className="flex items-center text-blue-600 hover:text-blue-800">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  HR Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
