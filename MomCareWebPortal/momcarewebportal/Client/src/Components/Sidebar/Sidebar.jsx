import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { routeConfig } from "../../utils/routeConfig";
import "./Sidebar.scss";

const Sidebar = () => {
  const { user } = useAuth();

  // Filter routes based on user role and remove duplicate dashboard route
  const allowedRoutes = routeConfig
    .filter(route => route.allowedRoles.includes(user?.role))
    .filter((route, index, self) => 
      index === self.findIndex((r) => r.label === route.label)
    );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src="/mom-care-logo.png" alt="logo" />
        <h2 className="sidebar-title">MomCare Portal</h2>
      </div>
      <nav>
        <ul>
          {allowedRoutes.map(route => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  isActive ? "active-link" : ""
                }
              >
                {route.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
