import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import AllRequestTable from '../../../../AllRequestTable';
import useAxiosSecure from '../../../../../hooks/useAxiosSecure';
import useAuth from '../../../../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const AllRequestsPage = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure(); 
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    try {
      const { data } = await axiosSecure.get(`/requests-employee/${user?.email}`);
      setAssets(data);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err.response?.data?.message || "Failed to fetch asset requests.");
    }
  }, [axiosSecure, user?.email]);

  const updateStatus = async (id, status) => {
    try {
      const res = await axiosSecure.patch(`/requests/${id}/status`, { status });
      toast.success(res.data.message);
      refetch(); // Refresh list after status update
    } catch (err) {
      toast.error('Failed to update status',err);
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <Helmet>
        <title>All Requests</title>
      </Helmet>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            {error && <p className="text-red-500">{error}</p>}
            <div className='inline-block min-w-full shadow-lg rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead className='bg-gradient-to-r from-blue-500 to-purple-500'>
                  <tr>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Name</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Asset Type</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Email</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Asset Name</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Request Date</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Additional Note</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Quantity</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Status</th>
                    <th className='px-5 py-3 text-white text-left text-sm uppercase font-medium'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-gray-500">No asset requests found.</td>
                    </tr>
                  ) : (
                    assets.map((asset) => (
                      <AllRequestTable
                        key={asset._id}
                        assets={asset}
                        updateStatus={updateStatus} 
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllRequestsPage;
