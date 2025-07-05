import { useState, useEffect } from 'react';


export const usePaymentStatus = (email) => {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Simulate API call but always return "paid"
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsPaid(true); // Force "paid" status
      setIsLoading(false);
    };

    if (email) checkPaymentStatus();
    else setIsLoading(false);
  }, [email]);

  return { isPaid, isLoading };
};

export default usePaymentStatus;