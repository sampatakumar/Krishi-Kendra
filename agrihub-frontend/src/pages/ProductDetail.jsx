import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ShoppingCart, ArrowLeft, CheckCircle, ShieldCheck, 
  Truck, Package, User, Star, Plus, Minus, AlertTriangle
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'farmer') {
      alert('Only farmers can buy products.');
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold text-on-surface-variant">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-danger mb-4" />
        <h2 className="text-xl font-bold text-on-surface mb-2">Product Not Found</h2>
        <p className="text-sm text-on-surface-variant mb-6">The requested agricultural item might have been removed or is unavailable.</p>
        <button onClick={() => navigate('/')} className="bg-primary text-on-primary text-sm font-bold px-6 py-2.5 rounded-lg">
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 space-y-8">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Marketplace</Link>
        <span>/</span>
        <span className="text-primary">{product.category}</span>
        <span>/</span>
        <span className="text-on-surface truncate max-w-[200px]">{product.title}</span>
      </div>

      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      {/* Main Product Specs Card */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Product Image Section */}
        <div className="bg-surface-container-low p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/30 min-h-[380px]">
          <img 
            src={product.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80'} 
            alt={product.title} 
            className="max-h-[380px] w-full object-contain rounded-lg shadow-sm"
          />
        </div>

        {/* Product Info & Purchase Form */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge-stitch bg-primary-container text-on-primary">
                {product.category}
              </span>
              <span className="badge-stitch bg-surface-container text-on-surface border border-outline-variant/50">
                Verified Agriculture Grade
              </span>
            </div>

            <h1 className="font-h1 text-2xl md:text-3xl font-extrabold text-on-surface mb-3 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-h1 text-3xl md:text-4xl font-extrabold text-primary-dark">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-on-surface-variant">Includes all taxes</span>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-body-md">Description</h3>
              <p className="text-sm text-on-surface leading-relaxed">{product.description}</p>
            </div>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 mb-6">
              <div>
                <span className="text-xs text-on-surface-variant block mb-1">Seller / Supplier</span>
                <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                  <User size={15} className="text-primary" />
                  {product.seller?.fullName || 'Verified Agri Seller'}
                </span>
              </div>

              <div>
                <span className="text-xs text-on-surface-variant block mb-1">Stock Availability</span>
                <span className={`text-sm font-bold flex items-center gap-1.5 ${product.stock > 0 ? 'text-primary' : 'text-danger'}`}>
                  <Package size={15} />
                  {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-outline-variant/60 rounded-lg overflow-hidden bg-surface-container-low">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={product.stock === 0}
                  className="p-3 text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-bold text-sm text-on-surface">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={product.stock === 0}
                  className="p-3 text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3.5 px-6 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  added 
                    ? 'bg-secondary text-on-secondary' 
                    : 'bg-primary text-on-primary hover:bg-primary-container'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <><CheckCircle size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart (₹{(product.price * quantity).toLocaleString('en-IN')})</>
                )}
              </button>
            </div>

            <div className="flex items-center justify-around pt-3 border-t border-outline-variant/30 text-xs text-on-surface-variant font-semibold">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-primary" /> Verified Quality</span>
              <span className="flex items-center gap-1.5"><Truck size={16} className="text-primary" /> Express Rural Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
