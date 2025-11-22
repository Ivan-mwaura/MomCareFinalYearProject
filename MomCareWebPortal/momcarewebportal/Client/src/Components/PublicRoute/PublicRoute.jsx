import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const PublicRoute = ({ children }) => {
  const token = Cookies.get("token");

  if (token) {
    // Redirect authenticated users to the dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;

