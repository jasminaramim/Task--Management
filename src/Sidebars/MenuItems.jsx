import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-2 my-5 transition-colors duration-300 transform hover:bg-red-500 hover:text-gray-800 ${
          isActive ? 'bg-red-500 text-gray-900' : 'text-gray-900'
        }`
      }
    >
      <Icon className='w-5 h-5' />
      <span className='mx-4 font-medium'>{label}</span>
    </NavLink>
  )
}

MenuItems.propTypes = {
  label: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired, // Ensures the icon is a valid component
}

export default MenuItems
