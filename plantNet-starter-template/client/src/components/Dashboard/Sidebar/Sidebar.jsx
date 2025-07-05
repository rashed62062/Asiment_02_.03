import { useState } from 'react';
import { GrLogout } from 'react-icons/gr';
import { FcSettings } from 'react-icons/fc';
import { AiOutlineBars } from 'react-icons/ai';
import { BsGraphUp } from 'react-icons/bs';
import MenuItem from './Menu/MenuItem';
import useAuth from '../../../hooks/useAuth';
import AdminMenu from './Menu/AdminMenu';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo-flat.png';
import NormalUsersMenu from '../NormalUsers/NormalUsersMenu';

const Sidebar = () => {
  const { logOut } = useAuth();
  const [isOpen, setOpen] = useState(false);

  // Example roles (these should come from auth/user context in a real app)
  const isAdmin = true;
  const isNormalEmployee =  false ;

  const handleToggle = () => setOpen(!isOpen);

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
        <div className="p-4 font-bold">
          <Link to="/">
            <img src={logo} alt="logo" width="100" height="100" />
          </Link>
        </div>
        <button onClick={handleToggle} className="p-4">
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between bg-gray-100 w-64 px-2 py-4 absolute inset-y-0 left-0 transform ${
          !isOpen && '-translate-x-full'
        } md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <div>
          <div className="hidden md:flex px-4 py-2 shadow-lg rounded-lg justify-center items-center bg-lime-100">
            <Link to="/">
              <img src={logo} alt="logo" width="100" height="100" />
            </Link>
          </div>

          <nav className="flex flex-col mt-6">
            {/* Role-based rendering */}
            {isAdmin && (
              <>
                <AdminMenu />
                <MenuItem icon={BsGraphUp} label="Statistics" address="/dashboard" />
              </>
            )}

            {!isAdmin && isNormalEmployee && (
              <>
                <NormalUsersMenu />
              </>
            )}

            {!isAdmin && !isNormalEmployee && (
              <>
                <NormalUsersMenu />
                <MenuItem icon={BsGraphUp} label="Statistics" address="/dashboard" />
              </>
            )}
          </nav>
        </div>

        <div>
          <hr />
          <MenuItem icon={FcSettings} label="Profile" address="/dashboard/profile" />
          <button
            onClick={logOut}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300"
          >
            <GrLogout className="w-5 h-5" />
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
