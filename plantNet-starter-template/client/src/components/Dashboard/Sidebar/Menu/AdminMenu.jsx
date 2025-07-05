import { FaUserCog } from 'react-icons/fa'
import MenuItem from './MenuItem'
import { AiOutlineHome } from 'react-icons/ai';

const AdminMenu = () => {
  return (
    <>
      <MenuItem icon={AiOutlineHome} label='Home' address='HrHome' />

      <MenuItem icon={FaUserCog} label='Asset List' address='asset-list' />
    
      <MenuItem icon={FaUserCog} label='Add an Asset' address='add-an-asset' />
      <MenuItem icon={FaUserCog} label='All Requests' address='all-requests' />
      <MenuItem icon={FaUserCog} label='My Employee' address='my-employee' />
      <MenuItem icon={FaUserCog} label='Add an Employee' address='add-employee' />
    </>
  )
}

export default AdminMenu;
