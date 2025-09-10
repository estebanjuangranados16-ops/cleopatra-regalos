import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AdminPanelPage from '../components/admin/AdminPanelPage';
import { Navigate, Link } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { colors } = useTheme();

  // Redirigir si no está autenticado o no es admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-8">
            No tienes permisos de administrador para acceder a esta página.
          </p>
          <div className="flex gap-4">
            <Link
              to="/"
              className="px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: colors.primary }}
            >
              Ir al Inicio
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <AdminPanelPage />;
};

export default AdminPage;