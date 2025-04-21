import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/layout";
import LoginPage from "./Pages/LoginPage/LoginPage";
import UnauthorizedPage from "./Pages/UnauthorizedPage/UnauthorizedPage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { routeConfig } from "./utils/routeConfig";
import "./main.scss";

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <div className="main-content">
        <Routes>
          {routeConfig.map(({ path, component: Component, allowedRoles }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute allowedRoles={allowedRoles}>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
