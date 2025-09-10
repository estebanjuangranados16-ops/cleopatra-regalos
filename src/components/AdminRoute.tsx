import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SimpleAdmin from './AdminSimple';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, logout } = useAuth();

  if (isAdmin) {
    return (
      <SimpleAdmin 
        isOpen={true} 
        onClose={logout} 
      />
    );
  }

  return <>{children}</>;
};

export default AdminRoute;