import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Stores from './pages/admin/Stores';
import Admins from './pages/admin/Admins';
import Profile from './pages/admin/Profile';

// Store Pages
import StoreDashboard from './pages/store/StoreDashboard';
import StoreProfile from './pages/store/StoreProfile';
import StoreUserRatings from './pages/store/StoreUserRatings';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import StoresList from './pages/user/StoresList';
import UserRatings from './pages/user/UserRatings';
import UserProfile from './pages/user/UserProfile';

// Common
import SessionExpired from './components/SessionExpired';

const App = () => {
  const location = useLocation();
  const hideNavbar = ['/login', '/signup', '/unauthorized'].includes(location.pathname);

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/unauthorized' element={<SessionExpired />} />

        {/* Admin Routes */}
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/stores'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Stores />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/admins'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admins />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/profile'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Store Owner Routes */}
        <Route
          path='/store/dashboard'
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/store/profile'
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/store/user-ratings'
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreUserRatings />
            </ProtectedRoute>
          }
        />

        {/* Normal User Routes */}
        <Route
          path='/user/dashboard'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/user/stores'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <StoresList />
            </ProtectedRoute>
          }
        />
        <Route
          path='/user/ratings'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserRatings />
            </ProtectedRoute>
          }
        />
        <Route
          path='/user/profile'
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
