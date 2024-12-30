
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import "./main.scss";

const App = () => {
  return (
    
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/chws" element={<CHWs />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
