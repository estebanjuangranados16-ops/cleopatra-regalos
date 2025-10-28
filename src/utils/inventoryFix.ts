// Utilidad para arreglar problemas de inventario
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';

export const inventoryFix = {
  // Limpiar y reinicializar todo el inventario
  async resetInventory(): Promise<void> {
    console.log('🔄 Reinicializando inventario...');
    
    try {
      // Limpiar inventario existente
      inventoryService.clearInventory();
      console.log('✅ Inventario limpiado');
      
      // Obtener productos actuales
      const products = await productService.getProducts();
      console.log(`📦 Encontrados ${products.length} productos`);
      
      // Inicializar inventario para cada producto
      for (const product of products) {
        const stock = product.stock || 10; // Stock por defecto
        inventoryService.initializeProduct(String(product.id), stock, 3);
        console.log(`✅ ${product.name}: ${stock} unidades`);
      }
      
      console.log('🎉 Inventario reinicializado correctamente');
      
      // Mostrar resumen
      const inventory = inventoryService.getInventory();
      console.log('📊 Resumen de inventario:');
      inventory.forEach(item => {
        console.log(`- Producto ${item.productId}: ${item.available} disponibles de ${item.stock} total`);
      });
      
    } catch (error) {
      console.error('❌ Error reinicializando inventario:', error);
    }
  },

  // Verificar estado del inventario
  checkInventoryStatus(): void {
    console.log('🔍 Verificando estado del inventario...');
    
    const inventory = inventoryService.getInventory();
    
    if (inventory.length === 0) {
      console.log('⚠️ No hay inventario inicializado');
      return;
    }
    
    console.log(`📦 Total de productos en inventario: ${inventory.length}`);
    
    inventory.forEach(item => {
      const status = item.available > 0 ? '✅' : '❌';
      console.log(`${status} Producto ${item.productId}: ${item.available}/${item.stock} (Reservado: ${item.reserved})`);
    });
    
    const lowStock = inventoryService.getLowStockProducts();
    if (lowStock.length > 0) {
      console.log('⚠️ Productos con stock bajo:');
      lowStock.forEach(item => {
        console.log(`- Producto ${item.productId}: ${item.available} unidades`);
      });
    }
  },

  // Agregar stock a un producto específico
  addStockToProduct(productId: string, quantity: number): boolean {
    console.log(`📈 Agregando ${quantity} unidades al producto ${productId}`);
    
    const success = inventoryService.addStock(productId, quantity, 'Manual stock addition');
    
    if (success) {
      const item = inventoryService.getProductInventory(productId);
      console.log(`✅ Stock actualizado: ${item?.available} disponibles`);
    } else {
      console.log('❌ Error agregando stock');
    }
    
    return success;
  },

  // Verificar si un producto tiene stock
  checkProductStock(productId: string, quantity: number = 1): boolean {
    const hasStock = inventoryService.isInStock(productId, quantity);
    const item = inventoryService.getProductInventory(productId);
    
    console.log(`🔍 Producto ${productId}:`);
    console.log(`- Stock disponible: ${item?.available || 0}`);
    console.log(`- Cantidad solicitada: ${quantity}`);
    console.log(`- Tiene stock: ${hasStock ? '✅' : '❌'}`);
    
    return hasStock;
  }
};

// Función para ejecutar desde la consola del navegador
(window as any).inventoryFix = inventoryFix;