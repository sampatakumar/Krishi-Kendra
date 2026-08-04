import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { 
  PackagePlus, Edit, Trash2, Package, DollarSign, 
  ShoppingBag, CheckCircle, X, Plus, Clock, User, MapPin
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editingStockId, setEditingStockId] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Seeds',
    stock: '',
    image: ''
  });

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('/api/products/seller/myproducts');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get('/api/orders/seller/myorders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
    fetchMyOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData);
      setShowForm(false);
      fetchMyProducts();
      setFormData({ title: '', description: '', price: '', category: 'Seeds', stock: '', image: '' });
    } catch (error) {
      console.error('Error adding product', error);
      alert('Failed to add product.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchMyProducts();
      } catch (error) {
        console.error('Error deleting product', error);
      }
    }
  };

  const handleUpdateStock = async (id) => {
    try {
      await axios.put(`/api/products/${id}`, { stock: Number(newStockValue) });
      setEditingStockId(null);
      fetchMyProducts();
    } catch (error) {
      console.error('Error updating stock', error);
      alert('Failed to update stock');
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + (order.sellerTotal || 0), 0);

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 space-y-8">
      {/* Header & Main Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <span className="text-xs font-bold text-secondary-dark uppercase tracking-widest font-body-md">Vendor Console</span>
          <h1 className="font-h1 text-2xl md:text-3xl font-extrabold text-on-surface">Seller Dashboard</h1>
          <p className="text-xs text-on-surface-variant">Manage your agricultural catalog, stock inventory, and incoming farmer orders.</p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-primary text-on-primary font-bold text-sm px-5 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
        >
          <PackagePlus size={18} /> {showForm ? 'Close Form' : 'Add New Product'}
        </button>
      </div>

      {/* Summary Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-outline-variant/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Listed Products</span>
            <span className="font-h1 text-3xl font-extrabold text-on-surface">{products.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-outline-variant/40 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Customer Orders</span>
            <span className="font-h1 text-3xl font-extrabold text-on-surface">{orders.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed/40 text-secondary-dark flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-outline-variant/40 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Total Sales Revenue</span>
            <span className="font-h1 text-3xl font-extrabold text-primary-dark">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/40 text-tertiary flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Add Product Form Modal */}
      {showForm && (
        <div className="bg-surface p-6 md:p-8 rounded-2xl border border-primary/30 shadow-md space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
            <h2 className="font-h2 text-xl font-bold text-on-surface flex items-center gap-2">
              <Plus className="text-primary" /> Add New Agricultural Product
            </h2>
            <button onClick={() => setShowForm(false)} className="text-on-surface-variant hover:text-on-surface">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Product Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange}
                placeholder="e.g. Premium Hybrid Corn Seeds (50kg)"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Category *</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md cursor-pointer"
              >
                <option value="Seeds">Seeds</option>
                <option value="Fertilizers">Fertilizers</option>
                <option value="Pesticides">Pesticides</option>
                <option value="Machinery">Machinery</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Price (₹) *</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                min="0" 
                step="0.01"
                placeholder="299.00"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">Stock Units *</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange}
                min="0"
                placeholder="100"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-on-surface block mb-1">Image URL (Optional)</label>
              <input 
                type="text" 
                name="image" 
                value={formData.image} 
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-on-surface block mb-1">Product Description *</label>
              <textarea 
                name="description" 
                rows="3"
                value={formData.description} 
                onChange={handleChange}
                placeholder="Provide detailed specifications, usage guide, or grade details..."
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-5 py-2.5 border border-outline-variant/60 rounded-lg text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
              >
                Publish Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Catalog Table */}
      <div className="bg-surface rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm space-y-4 p-6">
        <h2 className="font-h2 text-xl font-bold text-on-surface">Product Inventory</h2>

        {loading ? (
          <div className="py-12 text-center text-xs font-semibold text-on-surface-variant">Loading product inventory...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-xs text-on-surface-variant">
            No products listed yet. Click "Add New Product" above to publish your first item.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-surface">
              <thead className="bg-surface-container-low text-on-surface-variant font-bold border-b border-outline-variant/30 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Stock Inventory</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=150&q=80'} 
                          alt={product.title} 
                          className="w-10 h-10 object-cover rounded-lg border border-outline-variant/30"
                        />
                        <div>
                          <div className="font-bold text-sm line-clamp-1">{product.title}</div>
                          <div className="text-[11px] text-on-surface-variant line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge-stitch bg-surface-container text-on-surface">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-primary-dark">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      {editingStockId === product._id ? (
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="number" 
                            value={newStockValue} 
                            onChange={e => setNewStockValue(e.target.value)}
                            min="0"
                            className="w-16 bg-surface border border-primary rounded p-1 text-xs outline-none"
                          />
                          <button 
                            onClick={() => handleUpdateStock(product._id)} 
                            className="bg-primary text-on-primary text-[10px] font-bold px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingStockId(null)} 
                            className="text-[10px] font-bold text-on-surface-variant px-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${product.stock === 0 ? 'text-danger' : 'text-on-surface'}`}>
                            {product.stock} units {product.stock === 0 && '(Out of stock)'}
                          </span>
                          <button 
                            onClick={() => { setEditingStockId(product._id); setNewStockValue(product.stock); }}
                            className="text-primary hover:text-primary-dark p-1"
                            title="Edit Stock Quantity"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(product._id)} 
                        className="text-danger hover:bg-danger-container/20 p-2 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Orders List Section */}
      <div className="bg-surface rounded-xl border border-outline-variant/40 p-6 space-y-4 shadow-sm">
        <h2 className="font-h2 text-xl font-bold text-on-surface">Incoming Farmer Orders</h2>

        {ordersLoading ? (
          <div className="py-12 text-center text-xs font-semibold text-on-surface-variant">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-on-surface-variant">No orders received yet.</div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="p-4 md:p-6 rounded-xl border border-outline-variant/30 bg-surface-container-low space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
                  <div>
                    <span className="font-h1 text-sm font-bold text-on-surface">Order #{order._id.substring(order._id.length - 8)}</span>
                    <span className="text-xs text-on-surface-variant ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="badge-stitch bg-primary-container text-on-primary">
                    {order.status || 'Processing'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Buyer Info</span>
                    <p className="font-bold text-on-surface flex items-center gap-1.5"><User size={14} className="text-primary" /> {order.buyer?.fullName}</p>
                    <p className="text-on-surface-variant">{order.buyer?.email}</p>
                    
                    <span className="font-bold text-on-surface-variant block mt-3 mb-1 uppercase tracking-wider">Shipping Address</span>
                    <p className="text-on-surface flex items-start gap-1.5">
                      <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-on-surface-variant block mb-1 uppercase tracking-wider">Payment Method</span>
                    <p className="font-bold text-on-surface flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-primary" /> {order.paymentMethod || 'Cash on Delivery'}
                    </p>

                    <div className="mt-3 p-3 bg-surface rounded-lg border border-outline-variant/30">
                      <span className="text-on-surface-variant block">Your Order Payout</span>
                      <span className="font-h1 text-xl font-extrabold text-primary-dark">₹{order.sellerTotal?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
