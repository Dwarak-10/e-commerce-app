import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RoleRedirect = () => {
  const user = useSelector(store => store.user);
  const role = user?.role;

  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (role === 'vendor') {
    return <Navigate to="/vendor" replace />;
  } else if (role === 'customer') {
    return <Navigate to="/home" replace />;
  } else {

    return <Navigate to="/login" replace />;
  }
};
export default RoleRedirect;