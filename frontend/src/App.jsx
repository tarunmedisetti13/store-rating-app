import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import StoreDashboard from './pages/store/StoreDashboard'
import UserDashboard from './pages/user/UserDashboard'
import SessionExpired from './components/SessionExpired'
import Users from './pages/admin/Users'
import Stores from './pages/admin/Stores'
import Admins from './pages/admin/Admins'
import Profile from './pages/admin/Profile'
import StoreProfile from './pages/store/StoreProfile'
import StoreUserRatings from './pages/store/StoreUserRatings'
import StoresList from './pages/user/StoresList'
import UserRatings from './pages/user/UserRatings'
import UserProfile from './pages/user/UserProfile'
const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/unauthorized';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/unauthorized' element={<SessionExpired />} />
        <Route path='/admin/stores' element={<Stores />} />
        <Route path='/admin/users' element={<Users />} />
        <Route path='/admin/admins' element={<Admins />} />
        <Route path='/admin/profile' element={<Profile />} />
        <Route path='/store/profile' element={<StoreProfile />} />
        <Route path='/store/user-ratings' element={<StoreUserRatings />} />
        <Route path='/user/stores' element={<StoresList />} />
        <Route path='/user/ratings' element={<UserRatings />} />
        <Route path='/user/profile' element={<UserProfile />} />
        <Route path='/admin/dashboard' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path='/store/dashboard' element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <StoreDashboard />
          </ProtectedRoute>
        } /><Route path='/user/dashboard' element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </>
  )
}

export default App
