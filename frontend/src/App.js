import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Properties from './components/properties';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import AllProperties from './components/AllProperties';
import Payment from './components/Payment';
import AddProperty from './components/AddProperty';
import EditProperty from './components/EditProperty';

// Protected Route Component - Redirects to login if not authenticated
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If admin-only route and user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" />;
  }
  
  return children;
};

// Public Route Component - Redirects to home if already logged in
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Public routes - accessible without authentication */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected routes - require authentication */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/properties/add" element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          } />
          <Route path="/properties" element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute adminOnly={true}>
              <UserList />
            </ProtectedRoute>
          } />
          <Route path="/all-properties" element={
            <ProtectedRoute>
              <AllProperties />
            </ProtectedRoute>
          } />
          <Route path="/payment/:propertyId" element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/properties/edit/:id" element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          } />

          {/* Catch all other routes and redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
