

const About = () => {
  return (
    <div>
        <section id="about" className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 lg:px-20">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            About Our Asset Management System
          </h2>
          <p className="text-gray-600 text-center leading-relaxed mb-8">
            Welcome to XYZ's Asset Management System, the ultimate solution for managing company assets effectively! 
            Our system is designed to streamline the tracking and usage of company resources, ensuring smooth operations for businesses of all sizes. 
            Whether you're an HR Manager or an employee, our platform simplifies the management process for returnable and non-returnable items.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white shadow-md p-6 rounded-lg max-w-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">For HR Managers</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage your team's assets with ease. Approve or reject requests, monitor inventory, and maintain full control over your company's resources.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg max-w-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">For Employees</h3>
              <p className="text-gray-600 leading-relaxed">
                Request assets quickly and keep track of your assigned items. Our system makes it easy for employees to stay organized and productive.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-lg max-w-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Why Choose Us?</h3>
              <p className="text-gray-600 leading-relaxed">
                Our platform is built with user-friendly features, secure data handling, and powerful reporting tools to help your business thrive.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;