import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Leaf, ShoppingCart, User, LogOut, Package, Menu, X, 
  Search, ShieldCheck, Truck, Headphones, Sprout
} from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { CartContext } from './context/CartContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import SellerDashboard from './pages/SellerDashboard';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant/30 shadow-sm">
      {/* Top Advisory Bar */}
      <div className="bg-primary text-on-primary text-xs py-1.5 px-4 font-body-md">
        <div className="max-w-container-max mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="badge-stitch bg-secondary-container text-on-secondary-container text-[10px]">
              Direct Farmers Access
            </span>
            <span className="hidden sm:inline text-white/90">Verified seeds, fertilizers & machinery delivered direct to your farm.</span>
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1"><Headphones size={13} /> 1800-KRISHI (Toll Free)</span>
          </div>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 text-primary text-2xl font-bold tracking-tight font-h1 group" onClick={closeMenu}>
            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-md group-hover:bg-primary-container transition-colors">
              <Sprout size={24} />
            </div>
            <div className="flex flex-col leading-tight">
              <span>Krishi Kendra</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-secondary-dark font-body-md">Agricultural Marketplace</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-h3 text-sm">
            <Link 
              to="/" 
              className={`pb-1 transition-all ${location.pathname === '/' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Marketplace
            </Link>
            {user?.role === 'seller' && (
              <Link 
                to="/dashboard" 
                className={`pb-1 transition-all ${location.pathname === '/dashboard' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              >
                Seller Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'farmer' && (
                <Link 
                  to="/cart" 
                  className="relative flex items-center gap-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface px-4 py-2.5 rounded-lg transition-colors font-medium text-sm"
                >
                  <ShoppingCart size={18} className="text-primary" />
                  <span>Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-secondary text-on-secondary font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center ml-1 animate-pulse">
                      {totalCartCount}
                    </span>
                  )}
                </Link>
              )}

              {user.role === 'seller' && (
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg hover:bg-primary-container transition-colors text-sm font-semibold shadow-sm"
                >
                  <Package size={18} />
                  <span>Manage Products</span>
                </Link>
              )}

              <div className="flex items-center gap-3 pl-3 border-l border-outline-variant/40">
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-on-surface leading-tight">{user.fullName}</span>
                  <span className="text-xs text-on-surface-variant capitalize">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors ml-1"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary-fixed/20 rounded-lg transition-colors border border-outline-variant/50"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2.5 text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container rounded-lg transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden p-2 text-on-surface rounded-lg border border-outline-variant/40 bg-surface-container-low"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface p-4 flex flex-col gap-3 shadow-lg">
          <Link to="/" className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-surface-container" onClick={closeMenu}>
            Marketplace Home
          </Link>
          {user ? (
            <>
              {user.role === 'seller' && (
                <Link to="/dashboard" className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-surface-container flex items-center gap-2" onClick={closeMenu}>
                  <Package size={18} /> Seller Dashboard
                </Link>
              )}
              {user.role === 'farmer' && (
                <Link to="/cart" className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-surface-container flex items-center justify-between" onClick={closeMenu}>
                  <span className="flex items-center gap-2"><ShoppingCart size={18} /> My Shopping Cart</span>
                  {totalCartCount > 0 && (
                    <span className="bg-secondary text-on-secondary text-xs px-2 py-0.5 rounded-full font-bold">
                      {totalCartCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="mt-2 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">{user.fullName}</div>
                  <div className="text-xs text-on-surface-variant capitalize">{user.role}</div>
                </div>
                <button onClick={handleLogout} className="px-3 py-1.5 text-xs font-semibold text-error border border-error/30 rounded-lg">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/login" className="py-2 text-center text-sm font-semibold border border-outline rounded-lg" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="py-2 text-center text-sm font-semibold bg-primary text-on-primary rounded-lg" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-on-background">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
          </Routes>
        </main>
        
        {/* Stitch Inspired Footer */}
        <footer className="bg-primary-container text-on-primary mt-16 border-t border-primary">
          <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2 text-xl font-bold font-h1 text-white mb-3">
                  <Sprout className="text-secondary" /> Krishi Kendra
                </div>
                <p className="text-sm text-on-primary-container leading-relaxed mb-4">
                  Empowering agricultural growth with field-tested seeds, machinery, and crop health solutions. Direct from verified sellers to your farm.
                </p>
                <div className="flex gap-4 text-white/80 text-xs">
                  <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-secondary" /> Verified Suppliers</span>
                </div>
              </div>

              <div>
                <h4 className="font-h3 text-white text-base font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-on-primary-container">
                  <li><Link to="/" className="hover:text-white transition-colors">Seeds & Planting</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Heavy Machinery</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Fertilizers & Nutrients</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Crop Protection</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-h3 text-white text-base font-semibold mb-4">Farmer Support</h4>
                <ul className="space-y-2 text-sm text-on-primary-container">
                  <li><a href="#" className="hover:text-white transition-colors">Agronomist Advisory</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Shipping & Rural Delivery</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Razorpay Payment Security</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Seller Verification</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-h3 text-white text-base font-semibold mb-4">Agri Updates</h4>
                <p className="text-xs text-on-primary-container mb-3">Subscribe to seasonal planting guides & discount alerts.</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter email..." 
                    className="px-3 py-2 text-sm bg-white text-on-surface rounded-l-lg outline-none w-full"
                  />
                  <button className="bg-secondary text-on-secondary px-4 text-xs font-bold rounded-r-lg hover:bg-secondary-dark transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-on-primary-container">
              <p>&copy; {new Date().getFullYear()} Krishi Kendra Marketplace. Built for Rugged Agricultural Dependability.</p>
              <div className="flex gap-4 mt-3 sm:mt-0">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Help Desk</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
