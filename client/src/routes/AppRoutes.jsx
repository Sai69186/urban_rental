import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageTransitionLoader from '../components/common/PageTransitionLoader';

// Layouts
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Pages
import Scene from '../pages/public/KageLandingPage';
import Home from '../pages/public/Home';
import ExploreProperties from '../pages/public/ExploreProperties';
import PropertyDetails from '../pages/public/PropertyDetails';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin Pages
import AdminOverview from '../pages/admin/AdminOverview';
import UserManagement from '../pages/admin/UserManagement';
import PropertyApprovals from '../pages/admin/PropertyApprovals';
import ApplicationsList from '../pages/admin/ApplicationsList';
import AgreementsList from '../pages/admin/AgreementsList';
import PaymentsList from '../pages/admin/PaymentsList';
import MaintenanceList from '../pages/admin/MaintenanceList';
import ComplaintsList from '../pages/admin/ComplaintsList';
import AuditLogs from '../pages/admin/AuditLogs';
import BroadcastNotification from '../pages/admin/BroadcastNotification';

// Owner Pages
import OwnerOverview from '../pages/owner/OwnerOverview';
import MyProperties from '../pages/owner/MyProperties';
import TenantApplications from '../pages/owner/TenantApplications';
import OwnerAgreements from '../pages/owner/OwnerAgreements';
import RentLedger from '../pages/owner/RentLedger';
import OwnerMaintenance from '../pages/owner/OwnerMaintenance';
import OwnerProfile from '../pages/owner/OwnerProfile';

// Tenant Pages
import TenantOverview from '../pages/tenant/TenantOverview';
import Favorites from '../pages/tenant/Favorites';
import MyApplications from '../pages/tenant/MyApplications';
import MyRental from '../pages/tenant/MyRental';
import TenantAgreement from '../pages/tenant/TenantAgreement';
import RentPay from '../pages/tenant/RentPay';
import TenantMaintenance from '../pages/tenant/TenantMaintenance';
import SubmitComplaint from '../pages/tenant/SubmitComplaint';
import TenantProfile from '../pages/tenant/TenantProfile';

const AppRoutes = () => {
  return (
    <PageTransitionLoader>
      <Routes>
        {/* Public Pages with Top Navbar & Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreProperties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Role Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/overview" element={<AdminOverview />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/properties" element={<PropertyApprovals />} />
            <Route path="/admin/applications" element={<ApplicationsList />} />
            <Route path="/admin/agreements" element={<AgreementsList />} />
            <Route path="/admin/payments" element={<PaymentsList />} />
            <Route path="/admin/maintenance" element={<MaintenanceList />} />
            <Route path="/admin/complaints" element={<ComplaintsList />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/broadcast" element={<BroadcastNotification />} />
          </Route>
        </Route>

        {/* Owner Role Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/owner/overview" element={<OwnerOverview />} />
            <Route path="/owner/properties" element={<MyProperties />} />
            <Route path="/owner/applications" element={<TenantApplications />} />
            <Route path="/owner/agreements" element={<OwnerAgreements />} />
            <Route path="/owner/rent-ledger" element={<RentLedger />} />
            <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
            <Route path="/owner/profile" element={<OwnerProfile />} />
          </Route>
        </Route>

        {/* Tenant Role Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['tenant']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/tenant/overview" element={<TenantOverview />} />
            <Route path="/tenant/favorites" element={<Favorites />} />
            <Route path="/tenant/applications" element={<MyApplications />} />
            <Route path="/tenant/rental" element={<MyRental />} />
            <Route path="/tenant/agreement" element={<TenantAgreement />} />
            <Route path="/tenant/rent" element={<RentPay />} />
            <Route path="/tenant/maintenance" element={<TenantMaintenance />} />
            <Route path="/tenant/complaints" element={<SubmitComplaint />} />
            <Route path="/tenant/profile" element={<TenantProfile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransitionLoader>
  );
};

export default AppRoutes;
