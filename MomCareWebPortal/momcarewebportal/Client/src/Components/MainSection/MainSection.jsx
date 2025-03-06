
import "./MainSection.scss";
import PropTypes from "prop-types";


const MainSection = ({ children }) => {
  return <div className="main-section">{children}</div>;
};

export default MainSection;

MainSection.propTypes = {

    children: PropTypes.node.isRequired,

};


