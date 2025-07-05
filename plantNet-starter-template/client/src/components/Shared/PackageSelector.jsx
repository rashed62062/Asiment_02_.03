const PackageSelector = ({ packages, selectedPackageId, onSelect, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Select a Package</label>
      <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative border rounded-lg p-4 cursor-pointer ${
              selectedPackageId === pkg.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onClick={() => onSelect(pkg.id)}
          >
            <div className="flex items-center">
              <input
                id={`package-${pkg.id}`}
                name="package"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                checked={selectedPackageId === pkg.id}
                onChange={() => {}}
              />
              <label htmlFor={`package-${pkg.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                {pkg.name}
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">{pkg.description}</p>
            {selectedPackageId === pkg.id && (
              <div className="absolute top-0 right-0 h-5 w-5 -mt-1 -mr-1">
                <div className="h-full w-full rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PackageSelector;
