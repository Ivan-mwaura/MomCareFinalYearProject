import Dashboard from "../Pages/Dashboard/Dashboard";
import Patients from "../Pages/Patients/Patients";
import HealthRecords from "../Pages/HealthRecords/HealthRecords";
import AppointmentRecord from "../Pages/AppointmentRecord/AppointmentRecord";
import Alerts from "../Pages/Alerts/Alerts";
import Appointments from "../Pages/Appointments/Appointments";
import Analytics from "../Pages/Analytics/Analytics";
import CHWs from "../Pages/CHWs/CHWs";
import Doctors from "../Pages/Doctors/Doctors";

export const ROLES = {
  ADMIN: 'admin',
  CHW: 'chw',
  DOCTOR: 'doctor'
};

export const routeConfig = [
  {
    path: '/',
    label: 'Dashboard',
    component: Dashboard,
    icon: 'dashboard-icon',
    allowedRoles: [ROLES.ADMIN, ROLES.CHW, ROLES.DOCTOR]
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    component: Dashboard,
    icon: 'dashboard-icon',
    allowedRoles: [ROLES.ADMIN, ROLES.CHW, ROLES.DOCTOR]
  },
  {
    path: '/patients',
    label: 'Mothers Management',
    component: Patients,
    icon: 'patients-icon',
    allowedRoles: [ROLES.CHW]
  },
  {
    path: '/health-records',
    label: 'Health Records',
    component: HealthRecords,
    icon: 'health-records-icon',
    allowedRoles: [ROLES.CHW, ROLES.DOCTOR]
  },
  {
    path: '/appointment-record',
    label: 'Appointment Record',
    component: AppointmentRecord,
    icon: 'appointment-record-icon',
    allowedRoles: [ROLES.DOCTOR]
  },
  {
    path: '/alerts',
    label: 'Alerts',
    component: Alerts,
    icon: 'alerts-icon',
    allowedRoles: [ROLES.CHW]
  },
  {
    path: '/appointments',
    label: 'Appointments',
    component: Appointments,
    icon: 'appointments-icon',
    allowedRoles: [ROLES.CHW, ROLES.DOCTOR]
  },
  /*{
    path: '/analytics',
    label: 'Analytics',
    component: Analytics,
    icon: 'analytics-icon',
    allowedRoles: [ROLES.ADMIN, ROLES.CHW, ROLES.DOCTOR]
  },*/
  {
    path: '/chws',
    label: 'CHW Management',
    component: CHWs,
    icon: 'chw-icon',
    allowedRoles: [ROLES.ADMIN]
  },
  {
    path: '/doctors',
    label: 'Doctor Management',
    component: Doctors,
    icon: 'doctor-icon',
    allowedRoles: [ROLES.ADMIN]
  },
]; 