import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/layout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Patients from "./Pages/Patients/Patients";
import Alerts from "./Pages/Alerts/Alerts";
import Appointments from "./Pages/Appointments/Appointments";
import Analytics from "./Pages/Analytics/Analytics";
import CHWs from "./Pages/CHWs/CHWs";
import Resources from "./Pages/Resources/Resources";
import Profile from "./Pages/Profile/Profile";
import Support from "./Pages/Support/Support";
import LoginPage from "./Pages/LoginPage/LoginPage";
import PublicRoute from "./Components/PublicRoute/PublicRoute";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import "./main.scss";

const App = () => {
  return (
    <Layout>
      <div className="main-content">
        <Routes>
          {/* Public route: Only accessible if not authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          
          {/* Protected routes: Accessible only to authenticated users */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chws"
            element={
              <ProtectedRoute>
                <CHWs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Layout>
  );
};

export default App;
