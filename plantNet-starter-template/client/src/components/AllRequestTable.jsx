import { format } from "date-fns";

const AllRequestTable = ({assets}) => {

    const{
       notes,

        requestedBy,
        requestDate,
        productType,
        status,
        name

    } = assets || {};
    return (
        <tr className='bg-white hover:bg-gray-100 transition duration-200'>
                    <td className='px-4 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {requestedBy?.name}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {productType}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500 whitespace-nowrap'>
                      {requestedBy?.email}
                    </td>
                    <td className='px-4 py-4 text-sm text-gray-500 whitespace-nowrap'>
                  {name}
                    </td>
                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                      {format(new Date(requestDate), 'P')}
                    </td>
                    <td className='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                      {notes.substring(0,10)}..
                    </td>
                    <td className='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                      5
                    </td>
                    <td className='px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap'>
                      <div className='inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-100 text-yellow-500'>
                        <span className='h-1.5 w-1.5 rounded-full bg-green-500'></span>
                        <h2 className='text-sm font-normal'>{status}</h2>
                      </div>
                    </td>
                    <td className='px-4 py-4 text-sm whitespace-nowrap'>
                      <div className='flex items-center gap-x-6'>
                        <button
                          className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-200'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='m4.5 12.75 6 6 9-13.5'
                            />
                          </svg>
                        </button>

                        <button
                          className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full transition duration-200'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636'
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
    );
};

export default AllRequestTable;