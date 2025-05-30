import { FaUserCog } from 'react-icons/fa'
import MenuItem from './MenuItem'

const AdminMenu = () => {
  return (
    <>
      {/* <MenuItem icon={FaUserCog} label='Manage Users' address='manage-users' /> */}
      <MenuItem icon={FaUserCog} label='Asset List' address='asset-list' />
      <MenuItem icon={FaUserCog} label='Add an Asset' address='add-an-asset' />
      <MenuItem icon={FaUserCog} label='All Requests' address='all-requests' />
      <MenuItem icon={FaUserCog} label='My Employee' address='my-employee' />
      <MenuItem icon={FaUserCog} label='Add an Employee' address='add-employee' />
    </>
  )
}

export default AdminMenu
