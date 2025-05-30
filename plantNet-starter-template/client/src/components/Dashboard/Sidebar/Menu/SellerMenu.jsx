import { BsFillHouseAddFill } from 'react-icons/bs'
import { MdHomeWork, MdOutlineManageHistory } from 'react-icons/md'
import MenuItem from './MenuItem'
import { FaPlusCircle, FaUsers } from 'react-icons/fa'
const SellerMenu = () => {
  return (
    <>
      <MenuItem
        icon={FaPlusCircle}
        label='Request Asset'
        address='request-asset'
      />
      <MenuItem icon={MdHomeWork} label='My Assets' address='inventory' />
      <MenuItem
        icon={FaUsers}
        label='My-team'
        address='my-team'
      />
    </>
  )
}

export default SellerMenu
