import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UnauthWrapper = () => {
  const { user, isAuthenticated } = useSelector(store => store.auth);

  if (user && isAuthenticated) {
    return <Navigate to={"/dashboard"} replace />
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default UnauthWrapper