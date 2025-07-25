import Container from '../Container';
import { AiOutlineMenu } from 'react-icons/ai';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import avatarImg from '../../../assets/images/placeholder.jpg';
import logo from '../../../assets/images/logo-flat.png';
import useAuth from '../../../hooks/useAuth';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log('Successfully logged out');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className='fixed w-full bg-white z-10 shadow-sm'>
      <div className='py-4 border-b-[1px]'>
        <Container>
          <div className='flex flex-row items-center justify-between gap-3 md:gap-0'>
            {/* Logo */}
            <Link to='/'>
              <img src={logo} alt='logo' width='100' height='100' />
            </Link>

            {/* Dropdown Menu */}
            <div className='relative'>
              <div className='flex flex-row items-center gap-3'>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
                >
                  <AiOutlineMenu />
                  <div className='hidden md:block'>
                    <img
                      className='rounded-full'
                      referrerPolicy='no-referrer'
                      src={user?.photoURL || avatarImg}
                      alt='profile'
                      height='30'
                      width='30'
                    />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-48 bg-white overflow-hidden right-0 top-12 text-sm'>
                  <div className='flex flex-col cursor-pointer'>
                    <Link to='/' className='block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold'>
                      Home
                    </Link>

                    {user ? (
                      <>
                        <Link to='/dashboard' className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'>
                          Dashboard
                        </Link>
                        <div
                          onClick={handleLogout}
                          className='px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer'
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
                        <Link to='/login' className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'>
                          Login
                        </Link>
                        <Link to='/signup' className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'>
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
