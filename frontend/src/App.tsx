import React, { useState } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import CustomerList from './components/CustomerList';
import SupplierList from './components/SupplierList';
import InStockOrderList from './components/InStockOrderList';
import OutStockOrderList from './components/OutStockOrderList';
import InventoryList from './components/InventoryList';

type TabType = 'products' | 'customers' | 'suppliers' | 'instock' | 'outstock' | 'inventory';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Warehouse Management System</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={activeTab === 'customers' ? 'active' : ''} 
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
          <button 
            className={activeTab === 'suppliers' ? 'active' : ''} 
            onClick={() => setActiveTab('suppliers')}
          >
            Suppliers
          </button>
          <button 
            className={activeTab === 'instock' ? 'active' : ''} 
            onClick={() => setActiveTab('instock')}
          >
            In-Stock Orders
          </button>
          <button 
            className={activeTab === 'outstock' ? 'active' : ''} 
            onClick={() => setActiveTab('outstock')}
          >
            Out-Stock Orders
          </button>
          <button 
            className={activeTab === 'inventory' ? 'active' : ''} 
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
        </nav>
      </header>
      <main className="App-main">
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'customers' && <CustomerList />}
        {activeTab === 'suppliers' && <SupplierList />}
        {activeTab === 'instock' && <InStockOrderList />}
        {activeTab === 'outstock' && <OutStockOrderList />}
        {activeTab === 'inventory' && <InventoryList />}
      </main>
    </div>
  );
}

export default App;
