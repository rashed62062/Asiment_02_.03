import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { FiAlertTriangle, FiPackage, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { BsArrowRight, BsBoxSeam } from 'react-icons/bs';
import { MdPendingActions } from 'react-icons/md';
// import useAuth from '../../../hooks/useAuth';
// import usePaymentStatus from '../../../hooks/usePaymentStatus';

const HrHome = () => {
//   const { user } = useAuth();
//   const { isPaid } = usePaymentStatus(user?.email);
  const isPaid = true
  const navigate = useNavigate();

  // Sample data - replace with API calls in a real application
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'REQ-101', employee: 'John Doe', item: 'Laptop', type: 'Non-returnable', date: '2023-06-15' },
    { id: 'REQ-102', employee: 'Jane Smith', item: 'Monitor', type: 'Returnable', date: '2023-06-14' },
    { id: 'REQ-103', employee: 'Mike Johnson', item: 'Keyboard', type: 'Returnable', date: '2023-06-13' },
    { id: 'REQ-104', employee: 'Sarah Williams', item: 'Mouse', type: 'Returnable', date: '2023-06-12' },
    { id: 'REQ-105', employee: 'David Brown', item: 'Headset', type: 'Non-returnable', date: '2023-06-11' }
  ]);

  const [topRequestedItems, setTopRequestedItems] = useState([
    { name: 'Laptop', count: 23 },
    { name: 'Monitor', count: 18 },
    { name: 'Keyboard', count: 15 },
    { name: 'Mouse', count: 12 }
  ]);

  const [lowStockItems, setLowStockItems] = useState([
    { name: 'Laptop', quantity: 3 },
    { name: 'Monitor', quantity: 5 },
    { name: 'Keyboard', quantity: 2 },
    { name: 'Mouse', quantity: 8 }
  ]);

  // Pie chart data
  const pieData = [
    { name: 'Returnable', value: 65 },
    { name: 'Non-returnable', value: 35 }
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  // Check payment status on component mount
  useEffect(() => {
    if (!isPaid) {
      navigate('/payment');
    }
  }, [isPaid, navigate]);

  if (!isPaid) {
    return null; // Or a loading spinner while redirect happens
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">HR Manager Dashboard</h1>
      
      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Requests */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MdPendingActions className="mr-2 text-blue-500" />
                Pending Requests
              </h2>
              <Link to="/dashboard/all-requests" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View All <BsArrowRight className="ml-1" />
              </Link>
            </div>
            
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending requests</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingRequests.slice(0, 5).map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.employee}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.type === 'Returnable' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Top Requested Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiTrendingUp className="mr-2 text-purple-500" />
                Top Requested Items
              </h2>
              <Link to="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View Inventory <BsArrowRight className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {topRequestedItems.slice(0, 4).map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <BsBoxSeam className="text-gray-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.count} requests</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Limited Stock Items */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiAlertTriangle className="mr-2 text-red-500" />
                Limited Stock Items
              </h2>
              <Link to="/inventory" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                Reorder <BsArrowRight className="ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded">
                  <div className="flex items-center">
                    <FiPackage className="text-gray-500 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.quantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Returnable vs Non-returnable Pie Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Types</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Section 1: Recent Payments */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiDollarSign className="mr-2 text-green-500" />
                Recent Payments
              </h2>
              <Link to="/payments" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View All <BsArrowRight className="ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-2">
                <span>Subscription Renewal</span>
                <span className="text-green-600">$99.00</span>
              </div>
              <div className="flex justify-between p-2">
                <span>Feature Upgrade</span>
                <span className="text-green-600">$49.00</span>
              </div>
            </div>
          </div>

          {/* Additional Section 2: Quick Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-100 text-blue-800 p-3 rounded-lg hover:bg-blue-200 transition-colors">
                Approve Requests
              </button>
              <button className="bg-green-100 text-green-800 p-3 rounded-lg hover:bg-green-200 transition-colors">
                Add Inventory
              </button>
              <button className="bg-purple-100 text-purple-800 p-3 rounded-lg hover:bg-purple-200 transition-colors">
                Generate Report
              </button>
              <button className="bg-yellow-100 text-yellow-800 p-3 rounded-lg hover:bg-yellow-200 transition-colors">
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrHome;