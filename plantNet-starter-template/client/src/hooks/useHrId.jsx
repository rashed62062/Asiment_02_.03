import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from './useAxiosSecure';

const useHrId = () => {
  const { user } = useContext(AuthContext);
  const [hrId, setHrId] = useState(null);
  const axiosPublic = useAxiosSecure();

  useEffect(() => {
    const fetchHrId = async () => {
      if (!user?.email) return;

      try {
        const res = await axiosPublic.get(`/hr/email/${user.email}`);
        setHrId(res.data._id); // ✅ This line sets the HR ID
      } catch (error) {
        console.error('Failed to fetch HR ID:', error);
      }
    };

    fetchHrId();
  }, [user, axiosPublic]);

  return hrId;
};

export default useHrId;
