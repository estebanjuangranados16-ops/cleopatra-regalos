import React from 'react';

const AdminApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Admin App</h1>
        <p className="text-gray-600">
          La aplicación de administración está temporalmente deshabilitada.
        </p>
      </div>
    </div>
  );
};

export default AdminApp;