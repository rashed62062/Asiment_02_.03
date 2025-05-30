import { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import useAuth from '../../../../../hooks/useAuth';
import { AuthContext } from '../../../../../providers/AuthProvider';
import axios from 'axios';

const Asset = () => {
  const { user } = useAuth(AuthContext);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  // Fetch assets from the API
  const fetchAllAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/requests-employee`, {
          params: { email: user?.email },
        }
      );
      setAssets(data);
    } catch (error) {
      setError('Error fetching assets.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAssets();
  }, [user?.email]);

  // Handle input change for search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change for status
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Handle filter change for type
  const handleTypeFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  // Filter assets based on search and filter criteria
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? asset.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchesType = filterType ? asset.productType.toLowerCase() === filterType.toLowerCase() : true;

    return matchesSearch && matchesStatus && matchesType;
  });

  const styles = StyleSheet.create({
    page: { padding: 20 },
    section: { marginBottom: 10 },
    heading: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    table: { width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: '#f0f0f0', textAlign: 'left', padding: 8 },
    tableRow: { borderBottom: '1px solid #ccc' },
    tableCell: { padding: 8 },
  });

  const MyDocument = ({ asset }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.heading}>Company Asset Report</Text>
        <View style={styles.section}>
          <Text>Asset Name: {asset.name}</Text>
          <Text>Asset Type: {asset.productType}</Text>
          <Text>Request Date: {new Date(asset.requestDate).toLocaleDateString('en-US')}</Text>
          <Text>Approval Date: {new Date(asset.approvalDate).toLocaleDateString('en-US')}</Text>
        </View>
        <Text>Print Date: {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        My Requested Assets 
      </h2>

      {/* Search Section */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search by Asset Name"
          className="w-1/2 p-2 border rounded-md mr-4"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={handleStatusFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">Filter by Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <select
            value={filterType}
            onChange={handleTypeFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">Filter by Type</option>
            <option value="returnable">Returnable</option>
            <option value="non-returnable">Non-returnable</option>
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Asset List Section */}
      <div className="space-y-6">
        {filteredAssets.map((asset) => (
          <div key={asset._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">{asset.name}</h3>
              <span
                className={`text-sm py-1 px-3 rounded-full
                   ${asset.status === 'Approved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
              >
                {asset.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Asset Type: {asset.productType}</p>

            {/* Displaying formatted request date */}
            <p className="text-gray-600 mb-4">
              Request Date: {new Date(asset.requestDate).toLocaleDateString('en-US')}
            </p>

            <p className="text-gray-600 mb-4">
              Approval Date: {asset.status === 'Approved' ? new Date(asset.approvalDate).toLocaleDateString('en-US') : 'N/A'}
            </p>

            {/* Actions (buttons without functionality) */}
            <div className="flex gap-4">
              <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
                Cancel Request
              </button>

              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out">
                Return Asset
              </button>

              <PDFDownloadLink document={<MyDocument asset={asset} />} fileName={`asset-${asset._id}-report.pdf`}>
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
                  >
                    {loading ? 'Generating PDF...' : 'Print Asset Details'}
                  </button>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Asset;
