import axios from 'axios';

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async'

import AllRequestTable from '../../../../AllRequestTable';

const AllRequestsPage = () => {
  
  // Example status value

  const [asset, setAsset] = useState([]);

  useEffect(() => {
    fetchAllAssets();
  }, []);

  const fetchAllAssets = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/requests-employee`
      );
      setAsset(data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>All Requests</title>
      </Helmet>
      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow-lg rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead className='bg-gradient-to-r from-blue-500 to-purple-500'>
                  <tr>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Name
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Asset Type
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Asset Name
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Request Date
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Additional note
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Quantity
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Status
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 text-white text-left text-sm uppercase font-medium'
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                {asset.map((assets) => (
                    <AllRequestTable key={assets._id} assets={assets} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AllRequestsPage
