import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosPublic from './useAxiosPublic';


const useCompanyInfo = () => {
    const {user} = useAuth()
      const axiosSecure = useAxiosPublic();
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const res = await axiosSecure.get(`/employee/company-info/${user?.email}`);
        setCompanyData(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch company info');
        setCompanyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, axiosSecure]);

  return { companyData, loading, error };
};

export default useCompanyInfo;
