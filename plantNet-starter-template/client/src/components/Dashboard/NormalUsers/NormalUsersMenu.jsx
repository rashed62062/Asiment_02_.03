import { MdHomeWork, } from 'react-icons/md'
import { FaPlusCircle, FaUsers } from 'react-icons/fa'
import MenuItem from '../Sidebar/Menu/MenuItem';
import { AiOutlineHome } from 'react-icons/ai';
const NormalUsersMenu  = () => {
  return (
    <>
      <MenuItem
        icon={AiOutlineHome}
        label='Home'
        address='normalEmploy'
      />
      <MenuItem
        icon={FaPlusCircle}
        label='Request Asset'
        address='request-asset'
      />

      <MenuItem 
      icon={MdHomeWork} 
      label='My Assets' 
      address='inventory' />
      <MenuItem
        icon={FaUsers}
        label='My-team'
        address='my-team'
      />
    </>
  )
}

export default NormalUsersMenu;
