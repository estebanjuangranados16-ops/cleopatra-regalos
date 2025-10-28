import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';
import { inventoryFix } from '../utils/inventoryFix';

const InventoryDebugger: React.FC = () => {
  const [inventory, setInventory] = useState(inventoryService.getInventory());
  const [products, setProducts] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productList = await productService.getProducts();
      setProducts(productList);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const refreshInventory = () => {
    setInventory(inventoryService.getInventory());
  };

  const resetInventory = async () => {
    await inventoryFix.resetInventory();
    refreshInventory();
    await loadProducts();
  };

  const addStock = (productId: string) => {
    inventoryFix.addStockToProduct(productId, 10);
    refreshInventory();
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Package className="w-5 h-5" />
      </motion.button>

      {/* Debug Panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed left-4 bottom-20 z-50 bg-white rounded-lg shadow-xl border max-w-md max-h-96 overflow-y-auto"
        >
          <div className="p-4 border-b bg-purple-50">
            <h3 className="font-semibold text-purple-800 flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Inventory Debugger
            </h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={refreshInventory}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </button>
              <button
                onClick={resetInventory}
                className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Reset All
              </button>
            </div>

            {/* Inventory Status */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Inventory Status ({inventory.length} items)
              </h4>
              
              {inventory.length === 0 ? (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  ⚠️ No inventory initialized
                </div>
              ) : (
                <div className="space-y-2">
                  {inventory.map(item => {
                    const product = products.find(p => String(p.id) === item.productId);
                    const hasStock = item.available > 0;
                    
                    return (
                      <div
                        key={item.productId}
                        className={`p-2 rounded text-xs ${
                          hasStock ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {hasStock ? (
                              <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-red-600 mr-1" />
                            )}
                            <span className="font-medium">
                              {product?.name || `Product ${item.productId}`}
                            </span>
                          </div>
                          <button
                            onClick={() => addStock(item.productId)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            +10
                          </button>
                        </div>
                        <div className="text-gray-600 mt-1">
                          Available: {item.available} | Total: {item.stock} | Reserved: {item.reserved}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Products without inventory */}
            {products.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Products ({products.length} total)
                </h4>
                {products.map(product => {
                  const hasInventory = inventory.some(inv => inv.productId === String(product.id));
                  
                  if (hasInventory) return null;
                  
                  return (
                    <div
                      key={product.id}
                      className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-yellow-800">
                          {product.name}
                        </span>
                        <button
                          onClick={() => {
                            inventoryService.initializeProduct(String(product.id), product.stock || 10, 3);
                            refreshInventory();
                          }}
                          className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          Init
                        </button>
                      </div>
                      <div className="text-yellow-600">
                        No inventory initialized
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default InventoryDebugger;