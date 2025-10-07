import React, { useState, useEffect } from 'react';
import { OutStockOrder, Customer, Product, OrderItem, OrderLink, InStockOrder } from '../types';
import { 
  getOutStockOrders, 
  createOutStockOrder, 
  getCustomers, 
  getProducts,
  getInStockOrders 
} from '../services/api';

const OutStockOrderList: React.FC = () => {
  const [orders, setOrders] = useState<OutStockOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [instockOrders, setInstockOrders] = useState<InStockOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<OutStockOrder>({
    order_number: '',
    customer_id: 0,
    notes: '',
    items: [],
    links: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, productsRes, instockRes] = await Promise.all([
        getOutStockOrders(),
        getCustomers(),
        getProducts(),
        getInStockOrders(),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setInstockOrders(instockRes.data);
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

  const handleAddLink = () => {
    const newLink: OrderLink = {
      instock_order_id: 0,
      quantity: 0,
      product_id: 0,
    };
    setFormData({
      ...formData,
      links: [...(formData.links || []), newLink],
    });
  };

  const handleUpdateLink = (index: number, field: keyof OrderLink, value: any) => {
    const links = [...(formData.links || [])];
    links[index] = { ...links[index], [field]: value };
    setFormData({ ...formData, links });
  };

  const handleRemoveLink = (index: number) => {
    const links = formData.links?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, links });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOutStockOrder(formData);
      setShowModal(false);
      setFormData({
        order_number: '',
        customer_id: 0,
        notes: '',
        items: [],
        links: [],
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
        <h2>Out-Stock Orders</h2>
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
            <th>Vendor</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.customer_name}</td>
              <td>{order.vendor_name || 'N/A'}</td>
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
              <h3>Create Out-Stock Order</h3>
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

              <h4 style={{ marginTop: '20px' }}>Links to In-Stock Orders</h4>
              {formData.links?.map((link, index) => (
                <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <div className="form-group">
                    <label>In-Stock Order:</label>
                    <select
                      value={link.instock_order_id}
                      onChange={(e) => handleUpdateLink(index, 'instock_order_id', parseInt(e.target.value))}
                      required
                    >
                      <option value="0">Select In-Stock Order</option>
                      {instockOrders.map((o) => (
                        <option key={o.id} value={o.id}>{o.order_number}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Product:</label>
                    <select
                      value={link.product_id}
                      onChange={(e) => handleUpdateLink(index, 'product_id', parseInt(e.target.value))}
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
                      value={link.quantity}
                      onChange={(e) => handleUpdateLink(index, 'quantity', parseInt(e.target.value))}
                      required
                      min="1"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => handleRemoveLink(index)}
                  >
                    Remove Link
                  </button>
                </div>
              ))}
              
              <button type="button" className="btn btn-secondary" onClick={handleAddLink}>
                Add Link
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

export default OutStockOrderList;
