import React, { useState, useEffect } from 'react';
import { InStockOrder, Customer, Supplier, Product, OrderItem } from '../types';
import { 
  getInStockOrders, 
  createInStockOrder, 
  getCustomers, 
  getSuppliers, 
  getProducts 
} from '../services/api';

const InStockOrderList: React.FC = () => {
  const [orders, setOrders] = useState<InStockOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<InStockOrder>({
    order_number: '',
    supplier_id: 0,
    customer_id: 0,
    notes: '',
    items: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, suppliersRes, productsRes] = await Promise.all([
        getInStockOrders(),
        getCustomers(),
        getSuppliers(),
        getProducts(),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setSuppliers(suppliersRes.data);
      setProducts(productsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: OrderItem = {
      product_id: 0,
      quantity: 0,
      need_import_permit: 0,
      need_export_permit: 0,
    };
    setFormData({
      ...formData,
      items: [...(formData.items || []), newItem],
    });
  };

  const handleUpdateItem = (index: number, field: keyof OrderItem, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = { ...items[index], [field]: value };
    setFormData({ ...formData, items });
  };

  const handleRemoveItem = (index: number) => {
    const items = formData.items?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, items });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInStockOrder(formData);
      setShowModal(false);
      setFormData({
        order_number: '',
        supplier_id: 0,
        customer_id: 0,
        notes: '',
        items: [],
      });
      fetchData();
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="section-header">
        <h2>In-Stock Orders</h2>
        <button className="btn" onClick={() => setShowModal(true)}>
          Create Order
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.customer_name}</td>
              <td>{order.supplier_name}</td>
              <td>{new Date(order.order_date || '').toLocaleDateString()}</td>
              <td>
                <span className={`badge badge-${order.status === 'completed' ? 'success' : 'warning'}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create In-Stock Order</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Order Number:</label>
                <input
                  type="text"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer:</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: parseInt(e.target.value) })}
                  required
                >
                  <option value="0">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Supplier:</label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: parseInt(e.target.value) })}
                  required
                >
                  <option value="0">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Notes:</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              
              <h4>Items</h4>
              {formData.items?.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <div className="form-group">
                    <label>Product:</label>
                    <select
                      value={item.product_id}
                      onChange={(e) => handleUpdateItem(index, 'product_id', parseInt(e.target.value))}
                      required
                    >
                      <option value="0">Select Product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.model} - {p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
                      required
                      min="1"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button type="button" className="btn btn-secondary" onClick={handleAddItem}>
                Add Item
              </button>
              
              <div className="form-actions">
                <button type="submit" className="btn">Create Order</button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InStockOrderList;
