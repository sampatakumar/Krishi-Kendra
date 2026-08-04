import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Trash2, ShoppingBag, ShieldCheck, CreditCard, 
  Truck, ArrowLeft, CheckCircle, Plus, Minus, MapPin, AlertCircle
} from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const shippingFee = cartTotal > 1000 ? 0 : 50;
  const grandTotal = cartTotal + shippingFee;

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert("Please fill in your complete shipping address details.");
      return;
    }
    setPlacingOrder(true);
    try {
      const items = cartItems.map(item => ({ product: item.product._id, quantity: item.quantity }));
      await axios.post('/api/orders', { items, shippingAddress, paymentMethod: 'Cash on Delivery' }, {
        headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });
      setOrderSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleRazorpayCheckout = async (e) => {
    if (e) e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      alert("Please fill in your complete shipping address details.");
      return;
    }
    
    setPlacingOrder(true);
    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setPlacingOrder(false);
        return;
      }

      // Create Order on Backend
      const result = await axios.post("/api/payment/create-order", {
        amount: grandTotal
      }, {
        headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
      });

      if (!result.data) {
        alert("Server error creating Razorpay order.");
        setPlacingOrder(false);
        return;
      }

      const { amount, id: order_id, currency } = result.data;

      const options = {
        key: import.meta.env.VITE_RAZER_KEY || 'rzp_test_TLgM4XlAYLtCd7',
        amount: amount.toString(),
        currency: currency,
        name: "Krishi-Kendra Marketplace",
        description: "Agricultural Supplies Purchase",
        order_id: order_id,
        handler: async function (response) {
          try {
            const data = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await axios.post("/api/payment/verify-payment", data, {
              headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
            });

            if (verifyRes.data.message === 'Payment verified successfully') {
              const items = cartItems.map(item => ({ product: item.product._id, quantity: item.quantity }));
              await axios.post('/api/orders', { 
                items, 
                shippingAddress, 
                paymentMethod: 'Razorpay',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              }, {
                headers: { Authorization: `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}` }
              });
              
              setOrderSuccess(true);
              clearCart();
            } else {
              alert('Payment verification signature invalid!');
            }
          } catch (err) {
            console.error('Verification error', err);
            alert('Payment verification failed on server.');
          }
        },
        prefill: {
          name: user.fullName || "User",
          email: user.email || "user@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#1B3022"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error in Razorpay Checkout', error);
      alert('Failed to initialize payment gateway.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-primary-container text-on-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle size={40} className="text-secondary" />
        </div>
        <h2 className="font-h1 text-3xl font-extrabold text-on-surface mb-3">Order Confirmed & Placed!</h2>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed">
          Thank you for ordering with Krishi Kendra. Your supplier has been notified to dispatch your agricultural products.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-sm px-8 py-3.5 rounded-lg shadow-sm hover:bg-primary-container transition-colors">
          <ShoppingBag size={18} /> Continue Shopping
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-4 py-20 text-center">
        <ShoppingBag size={56} className="mx-auto text-on-surface-variant/40 mb-4" />
        <h2 className="font-h1 text-2xl font-bold text-on-surface mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-on-surface-variant max-w-sm mx-auto mb-6">Explore our seeds, machinery, and fertilizer marketplace to add field supplies to your cart.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-lg hover:bg-primary-container transition-colors">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
        <div>
          <span className="text-xs font-bold text-secondary-dark uppercase tracking-widest font-body-md">Checkout</span>
          <h1 className="font-h1 text-2xl md:text-3xl font-extrabold text-on-surface">Secure Shopping Cart</h1>
        </div>
        <Link to="/" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Back to Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface rounded-xl border border-outline-variant/40 divide-y divide-outline-variant/30 overflow-hidden shadow-sm">
            {cartItems.map(item => (
              <div key={item.product._id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                  <img 
                    src={item.product.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=300&q=80'} 
                    alt={item.product.title} 
                    className="w-20 h-20 object-cover rounded-lg border border-outline-variant/30 bg-surface-container-low shrink-0"
                  />
                  <div>
                    <span className="badge-stitch bg-surface-container text-on-surface text-[10px] mb-1">
                      {item.product.category}
                    </span>
                    <h3 className="font-h3 text-base font-bold text-on-surface line-clamp-1">{item.product.title}</h3>
                    <p className="text-sm font-bold text-primary-dark mt-0.5">₹{item.product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/30">
                  <div className="flex items-center border border-outline-variant/60 rounded-lg overflow-hidden bg-surface-container-low">
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="p-2 text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 font-bold text-xs text-on-surface">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="p-2 text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-h1 text-base font-bold text-on-surface">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-xs font-semibold text-danger hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-center gap-3 text-xs text-on-surface-variant font-semibold">
            <Truck size={20} className="text-primary shrink-0" />
            <span>Free shipping on all farm orders above ₹1,000. Delivered directly to your village/pin address.</span>
          </div>
        </div>

        {/* Order Summary & Payment Panel */}
        <div className="bg-surface p-6 rounded-xl border border-outline-variant/40 shadow-sm space-y-6 sticky top-24">
          <h3 className="font-h2 text-xl font-bold text-on-surface pb-3 border-b border-outline-variant/30">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Items Total ({cartItems.length})</span>
              <span className="font-bold text-on-surface">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Rural Dispatch Shipping</span>
              <span className="font-bold text-on-surface">
                {shippingFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${shippingFee}`}
              </span>
            </div>
            <div className="pt-3 border-t border-outline-variant/30 flex justify-between text-base font-bold text-on-surface">
              <span>Grand Total</span>
              <span className="font-h1 text-2xl font-extrabold text-primary-dark">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Shipping Form */}
          <form className="space-y-3 pt-3 border-t border-outline-variant/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface uppercase tracking-wider font-body-md mb-1">
              <MapPin size={15} className="text-primary" /> Delivery Address
            </div>
            <input 
              type="text" 
              placeholder="Street / Farm / Village Address *"
              value={shippingAddress.street} 
              onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
              required 
            />
            <input 
              type="text" 
              placeholder="District / City *"
              value={shippingAddress.city} 
              onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
              required 
            />
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="State *"
                value={shippingAddress.state} 
                onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
              <input 
                type="text" 
                placeholder="Pincode *"
                value={shippingAddress.zipCode} 
                onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg p-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="button" 
                onClick={handleRazorpayCheckout}
                disabled={placingOrder}
                className="w-full bg-primary text-on-primary py-3.5 px-4 rounded-lg font-bold text-sm hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CreditCard size={18} />
                {placingOrder ? 'Processing Payment...' : `Pay via Razorpay (₹${grandTotal.toLocaleString('en-IN')})`}
              </button>

              <button 
                type="button" 
                onClick={handleCheckout}
                disabled={placingOrder}
                className="w-full bg-surface-container text-on-surface border border-outline-variant/60 py-3 px-4 rounded-lg font-bold text-xs hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Truck size={16} />
                {placingOrder ? 'Placing Order...' : 'Pay Cash on Delivery (COD)'}
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-outline-variant/30 text-center">
            <span className="text-[11px] text-on-surface-variant font-semibold flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-primary" /> 256-bit Encrypted Razorpay Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
