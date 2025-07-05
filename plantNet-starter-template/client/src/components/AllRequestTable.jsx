import { format } from "date-fns";

// eslint-disable-next-line react/prop-types
const AllRequestTable = ({ assets, updateStatus }) => {
  const {
    notes,
    requestedBy,
    requestDate,
    productType,
    status,
    name,
    quantity,
    _id,
  } = assets || {};


  const statusClasses = {
    approved: {
      bg: "bg-green-100",
      text: "text-green-500",
      dot: "bg-green-500",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-500",
      dot: "bg-red-500",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-500",
      dot: "bg-yellow-500",
    },
  };

  const currentStatus = statusClasses[status?.toLowerCase()] || statusClasses.pending;

  return (
    <tr className="bg-white hover:bg-gray-100 transition duration-200">
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {requestedBy?.name || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {productType || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {requestedBy?.email || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
        {name || "N/A"}
      </td>
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        {requestDate ? format(new Date(requestDate), "P") : "N/A"}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        {notes?.substring(0, 10) || "N/A"}..
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        {quantity ?? 1}
      </td>
      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${currentStatus.bg} ${currentStatus.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`}></span>
          <h2 className="text-sm font-normal capitalize">{status}</h2>
        </div>
      </td>
      <td className="px-4 py-4 text-sm whitespace-nowrap">
        <div className="flex items-center gap-x-6">
          <button
            onClick={() => updateStatus(_id, "approved")}
            disabled={status?.toLowerCase() === "approved"}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-2 px-4 rounded-full transition duration-200"
            title="Approve"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>

          <button
            onClick={() => updateStatus(_id, "rejected")}
            disabled={status?.toLowerCase() === "rejected"}
            className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2 px-4 rounded-full transition duration-200"
            title="Reject"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AllRequestTable;
