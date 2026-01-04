import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  
  // Debug logging

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Завантаження...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>
          Доступ заборонено
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '20px' }}>
          Для доступу до цієї сторінки потрібні права адміністратора.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#556b2f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Назад
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
