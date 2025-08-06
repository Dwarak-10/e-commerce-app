import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const RoleGuard = ({ allowedRoles, children, redirectTo = '/' }) => {
  const role = useSelector((state) => state?.auth?.user?.role)

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default RoleGuard
