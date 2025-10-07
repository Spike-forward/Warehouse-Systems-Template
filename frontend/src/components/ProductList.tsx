import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, createProduct, deleteProduct } from '../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Product>({
    model: '',
    name: '',
    need_import_permit: 0,
    need_export_permit: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      setShowModal(false);
      setFormData({
        model: '',
        name: '',
        need_import_permit: 0,
        need_export_permit: 0,
      });
      fetchProducts();
    } catch (err) {
      setError('Failed to create product');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <div className="section-header">
        <h2>Products</h2>
        <button className="btn" onClick={() => setShowModal(true)}>
          Add Product
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Model</th>
            <th>Name</th>
            <th>Import Permit</th>
            <th>Export Permit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.model}</td>
              <td>{product.name}</td>
              <td>{product.need_import_permit ? 'Yes' : 'No'}</td>
              <td>{product.need_export_permit ? 'Yes' : 'No'}</td>
              <td>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(product.id!)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Product</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Model:</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.need_import_permit === 1}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      need_import_permit: e.target.checked ? 1 : 0 
                    })}
                  />
                  Need Import Permit
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.need_export_permit === 1}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      need_export_permit: e.target.checked ? 1 : 0 
                    })}
                  />
                  Need Export Permit
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn">Create</button>
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

export default ProductList;
