// Inventory management service
export interface InventoryItem {
  productId: string;
  stock: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'RESERVED' | 'RELEASED';
  quantity: number;
  reason: string;
  timestamp: string;
  orderId?: string;
}

class InventoryService {
  private storageKey = 'cleopatra_inventory';
  private movementsKey = 'cleopatra_stock_movements';

  // Get inventory for all products
  getInventory(): InventoryItem[] {
    try {
      const inventory = localStorage.getItem(this.storageKey);
      return inventory ? JSON.parse(inventory) : [];
    } catch (error) {
      console.error('Error loading inventory:', error);
      return [];
    }
  }

  // Get inventory for specific product
  getProductInventory(productId: string): InventoryItem | null {
    const inventory = this.getInventory();
    return inventory.find(item => item.productId === productId) || null;
  }

  // Initialize inventory for a product
  initializeProduct(productId: string, initialStock: number, lowStockThreshold: number = 5): void {
    const inventory = this.getInventory();
    const existingItem = inventory.find(item => item.productId === productId);

    if (!existingItem) {
      const newItem: InventoryItem = {
        productId,
        stock: initialStock,
        reserved: 0,
        available: initialStock,
        lowStockThreshold,
        lastUpdated: new Date().toISOString()
      };

      inventory.push(newItem);
      this.saveInventory(inventory);

      // Record stock movement
      this.recordMovement({
        productId,
        type: 'IN',
        quantity: initialStock,
        reason: 'Initial stock'
      });
    }
  }

  // Add stock
  addStock(productId: string, quantity: number, reason: string = 'Stock replenishment'): boolean {
    try {
      const inventory = this.getInventory();
      const itemIndex = inventory.findIndex(item => item.productId === productId);

      if (itemIndex === -1) {
        this.initializeProduct(productId, quantity);
        return true;
      }

      inventory[itemIndex].stock += quantity;
      inventory[itemIndex].available = inventory[itemIndex].stock - inventory[itemIndex].reserved;
      inventory[itemIndex].lastUpdated = new Date().toISOString();

      this.saveInventory(inventory);
      this.recordMovement({ productId, type: 'IN', quantity, reason });

      return true;
    } catch (error) {
      console.error('Error adding stock:', error);
      return false;
    }
  }

  // Reserve stock (for pending orders)
  reserveStock(productId: string, quantity: number, orderId: string): boolean {
    try {
      const inventory = this.getInventory();
      const itemIndex = inventory.findIndex(item => item.productId === productId);

      if (itemIndex === -1 || inventory[itemIndex].available < quantity) {
        return false; // Not enough stock
      }

      inventory[itemIndex].reserved += quantity;
      inventory[itemIndex].available = inventory[itemIndex].stock - inventory[itemIndex].reserved;
      inventory[itemIndex].lastUpdated = new Date().toISOString();

      this.saveInventory(inventory);
      this.recordMovement({ 
        productId, 
        type: 'RESERVED', 
        quantity, 
        reason: 'Order reservation',
        orderId 
      });

      return true;
    } catch (error) {
      console.error('Error reserving stock:', error);
      return false;
    }
  }

  // Confirm sale (convert reserved to sold)
  confirmSale(productId: string, quantity: number, orderId: string): boolean {
    try {
      const inventory = this.getInventory();
      const itemIndex = inventory.findIndex(item => item.productId === productId);

      if (itemIndex === -1 || inventory[itemIndex].reserved < quantity) {
        return false;
      }

      inventory[itemIndex].stock -= quantity;
      inventory[itemIndex].reserved -= quantity;
      inventory[itemIndex].available = inventory[itemIndex].stock - inventory[itemIndex].reserved;
      inventory[itemIndex].lastUpdated = new Date().toISOString();

      this.saveInventory(inventory);
      this.recordMovement({ 
        productId, 
        type: 'OUT', 
        quantity, 
        reason: 'Sale confirmed',
        orderId 
      });

      return true;
    } catch (error) {
      console.error('Error confirming sale:', error);
      return false;
    }
  }

  // Release reserved stock (cancel order)
  releaseReservedStock(productId: string, quantity: number, orderId: string): boolean {
    try {
      const inventory = this.getInventory();
      const itemIndex = inventory.findIndex(item => item.productId === productId);

      if (itemIndex === -1 || inventory[itemIndex].reserved < quantity) {
        return false;
      }

      inventory[itemIndex].reserved -= quantity;
      inventory[itemIndex].available = inventory[itemIndex].stock - inventory[itemIndex].reserved;
      inventory[itemIndex].lastUpdated = new Date().toISOString();

      this.saveInventory(inventory);
      this.recordMovement({ 
        productId, 
        type: 'RELEASED', 
        quantity, 
        reason: 'Order cancelled',
        orderId 
      });

      return true;
    } catch (error) {
      console.error('Error releasing stock:', error);
      return false;
    }
  }

  // Check if product is in stock
  isInStock(productId: string, quantity: number = 1): boolean {
    const item = this.getProductInventory(productId);
    return item ? item.available >= quantity : false;
  }

  // Check if product is low stock
  isLowStock(productId: string): boolean {
    const item = this.getProductInventory(productId);
    return item ? item.available <= item.lowStockThreshold : false;
  }

  // Get low stock products
  getLowStockProducts(): InventoryItem[] {
    return this.getInventory().filter(item => item.available <= item.lowStockThreshold);
  }

  // Get stock movements
  getStockMovements(productId?: string): StockMovement[] {
    try {
      const movements = localStorage.getItem(this.movementsKey);
      const allMovements: StockMovement[] = movements ? JSON.parse(movements) : [];
      
      return productId 
        ? allMovements.filter(movement => movement.productId === productId)
        : allMovements;
    } catch (error) {
      console.error('Error loading stock movements:', error);
      return [];
    }
  }

  // Private methods
  private saveInventory(inventory: InventoryItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(inventory));
  }

  private recordMovement(movement: Omit<StockMovement, 'id' | 'timestamp'>): void {
    try {
      const movements = this.getStockMovements();
      const newMovement: StockMovement = {
        ...movement,
        id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };

      movements.push(newMovement);
      
      // Keep only last 1000 movements
      if (movements.length > 1000) {
        movements.splice(0, movements.length - 1000);
      }

      localStorage.setItem(this.movementsKey, JSON.stringify(movements));
    } catch (error) {
      console.error('Error recording movement:', error);
    }
  }

  // Clear all inventory data
  clearInventory(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.movementsKey);
  }
}

export const inventoryService = new InventoryService();