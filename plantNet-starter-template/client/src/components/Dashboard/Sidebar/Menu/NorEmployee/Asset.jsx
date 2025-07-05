import { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import useAuth from '../../../../../hooks/useAuth';
import useAxiosSecure from '../../../../../hooks/useAxiosSecure';

const Asset = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchAllAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosSecure.get("/requests-employee", {
        params: { email: user?.email },
      });
      setAssets(data);
    } catch (error) {
      setError('Error fetching assets.',error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAssets();
  }, [user?.email]);

  const handleCancelRequest = async (id) => {
    console.log("🚀 ~ handleCancelRequest ~ id:", id)
    
    try {
      await axiosSecure.delete(`/requests/${id}`);
      fetchAllAssets();
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusFilterChange = (e) => setFilterStatus(e.target.value);
  const handleTypeFilterChange = (e) => setFilterType(e.target.value);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? asset.status.toLowerCase() === filterStatus.toLowerCase() : true;
    const matchesType = filterType ? asset.productType.toLowerCase() === filterType.toLowerCase() : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const styles = StyleSheet.create({
    page: { padding: 20 },
    heading: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    section: { marginBottom: 10 },
  });

  const MyDocument = ({ asset }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.heading}>Company Asset Report</Text>
        <View style={styles.section}>
          <Text>Asset Name: {asset.name}</Text>
          <Text>Asset Type: {asset.productType}</Text>
          <Text>Request Date: {new Date(asset.requestDate).toLocaleDateString('en-US')}</Text>
          <Text>Approval Date: {asset.approvalDate ? new Date(asset.approvalDate).toLocaleDateString('en-US') : 'N/A'}</Text>
        </View>
        <Text>Print Date: {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Requested Assets</h2>

      <div className="flex mb-6 flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Asset Name"
          className="p-2 border rounded-md w-full sm:w-auto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
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

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {filteredAssets.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-8">No assets found matching your filters.</p>
      )}

      <div className="space-y-6">
        {filteredAssets.map((asset) => (
          <div key={asset._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">{asset.name}</h3>
              <span className={`text-sm py-1 px-3 rounded-full ${
                asset.status === 'Approved' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                {asset.status}
              </span>
            </div>
            <p className="text-gray-600 mb-1">Asset Type: {asset.productType}</p>
            <p className="text-gray-600 mb-1">Request Date: {new Date(asset.requestDate).toLocaleDateString('en-US')}</p>
            <p className="text-gray-600 mb-4">
              Approval Date: {asset.approvalDate ? new Date(asset.approvalDate).toLocaleDateString('en-US') : 'N/A'}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCancelRequest(asset._id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Cancel Request
              </button>
              <button
                disabled={asset.status !== 'Approved'}
                className={`py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
                  asset.status !== 'Approved'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Return Asset
              </button>
              <PDFDownloadLink
                document={<MyDocument asset={asset} />}
                fileName={`asset-${asset._id}-report.pdf`}
              >
                {({ loading }) => (
                  <button
                    disabled={loading}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
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
