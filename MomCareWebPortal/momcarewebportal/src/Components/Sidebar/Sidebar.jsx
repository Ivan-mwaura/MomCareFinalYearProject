import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/mom-care-logo.png" alt="logo" />
        <h2 className="sidebar-title">MomCare Portal</h2>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Patient Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/alerts"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Alerts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Appointments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chws"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              CHW Management
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Resources
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Profile & Settings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                isActive ? "active-link" : ""
              }
            >
              Support
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
