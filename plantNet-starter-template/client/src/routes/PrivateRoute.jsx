import PropTypes from 'prop-types'
import useAuth from '../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from '../components/Shared/LoadingSpinner'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while fetching user data or authenticating
  if (loading) return <LoadingSpinner />

  // If the user is authenticated, render the children components
  if (user) return children

  // Redirect to login page if the user is not authenticated
  return <Navigate to='/login' state={{ from: location }} replace={true} />
}

PrivateRoute.propTypes = {
  children: PropTypes.element.isRequired, // Makes sure the children are a valid React element
}

export default PrivateRoute
