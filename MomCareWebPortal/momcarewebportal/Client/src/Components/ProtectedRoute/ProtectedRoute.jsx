import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");

  if (!token) {
    // Redirect to login if no token found
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
