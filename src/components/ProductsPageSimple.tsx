import React from 'react';
import { X } from 'lucide-react';

interface ProductsPageProps {
  isOpen: boolean;
  onClose: () => void;
  products?: any[];
  onProductsChange?: () => void;
}

const ProductsPageSimple: React.FC<ProductsPageProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Todos los Productos</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          La página completa de productos está temporalmente deshabilitada mientras se corrigen los tipos.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ProductsPageSimple;