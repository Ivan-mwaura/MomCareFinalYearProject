
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.scss";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};


