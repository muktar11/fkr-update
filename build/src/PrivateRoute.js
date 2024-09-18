import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, allowedRoles, ...rest }) => {
  // Get the user's role from local storage or wherever it is stored
  const userRole = localStorage.getItem('userRole');

  // Check if the user's role is allowed for this route
  const isRoleAllowed = allowedRoles.includes(userRole);

  return (
    <Route
      {...rest}
      element={isRoleAllowed ? <Component /> : <Navigate to="/" replace />}
    />
  );
};

export default PrivateRoute;