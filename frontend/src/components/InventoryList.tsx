import React, { useState, useEffect } from 'react';
import { Inventory, Customer } from '../types';
import { getInventory, getCustomers } from '../services/api';

const InventoryList: React.FC = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, customersRes] = await Promise.all([
        getInventory(),
        getCustomers(),
      ]);
      setInventory(inventoryRes.data);
      setCustomers(customersRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = selectedCustomer 
    ? inventory.filter(item => item.customer_id === selectedCustomer)
    : inventory;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="section-header">
        <h2>Inventory</h2>
        <div className="form-group" style={{ width: '300px', margin: 0 }}>
          <label>Filter by Customer:</label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
          >
            <option value="0">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product Model</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>No inventory items found</td>
            </tr>
          ) : (
            filteredInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.customer_name}</td>
                <td>{item.model}</td>
                <td>{item.product_name}</td>
                <td>
                  <span className={`badge badge-${item.quantity > 10 ? 'success' : item.quantity > 0 ? 'warning' : 'info'}`}>
                    {item.quantity}
                  </span>
                </td>
                <td>{new Date(item.last_updated || '').toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
