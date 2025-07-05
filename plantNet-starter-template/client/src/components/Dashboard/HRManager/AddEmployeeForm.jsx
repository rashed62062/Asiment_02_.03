import { useState, useEffect } from 'react';
import useHrId from '../../../hooks/useHrId';
import useAxiosPublic from '../../../hooks/useAxiosPublic';

const AddEmployeeForm = () => {
  const hrId = useHrId(); // Custom hook to get current HR ID
  const [employee, setEmployee] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('');
  const [max, setMax] = useState(0);
  const [current, setCurrent] = useState(0);
  const axiosSecure = useAxiosPublic(); 

  useEffect(() => {
    const fetchCounts = async () => {
      if (!hrId) return;

      try {
        const res = await axiosSecure.get(`/hr/by-id/${hrId}`);
        setMax(res.data.package?.maxEmployees || 0);
        setCurrent(res.data.employees?.length || 0);
      } catch (error) {
        console.error('Failed to fetch HR data', error);
      }
    };

    fetchCounts();
  }, [hrId, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (current >= max) {
      setStatus('❌ Employee limit reached. Please upgrade your package.');
      return;
    }

    try {
      await axiosSecure.post(`/hr/${hrId}/add-employee`, employee);
      setStatus('✅ Employee added successfully');
      setEmployee({ name: '', email: '' });
      setCurrent((prev) => prev + 1);
    } catch (err) {
      setStatus('❌ Failed to add employee');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded bg-white max-w-md mx-auto mt-10 shadow-lg"
    >
      <h2 className="text-xl font-semibold">Add New Employee</h2>
      {status && <p className="text-sm font-medium text-blue-600">{status}</p>}

      <input
        type="text"
        name="name"
        placeholder="Employee Name"
        value={employee.name}
        onChange={handleChange}
        required
        className="border p-2 w-full rounded bg-gray-100"
      />

      <input
        type="email"
        name="email"
        placeholder="Employee Email"
        value={employee.email}
        onChange={handleChange}
        required
        className="border p-2 w-full rounded bg-gray-100"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Employee
      </button>

      <p className="text-sm mt-2 text-gray-600">
        Used: {current} / {max}
      </p>
    </form>
  );
};

export default AddEmployeeForm;
