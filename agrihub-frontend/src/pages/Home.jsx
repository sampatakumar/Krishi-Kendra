import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ShoppingCart, ArrowRight, ShieldCheck, 
  Truck, Star, CheckCircle, Sprout, Tractor, Package, Tag
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [addedItem, setAddedItem] = useState(null);

  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (category) url += `category=${encodeURIComponent(category)}`;
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleQuickAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'farmer') {
      alert('Only farmers can purchase products.');
      return;
    }

    addToCart(product, 1);
    setAddedItem(product._id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  // High-res agricultural category banners from Stitch system
  const categoryTiles = [
    {
      name: 'Seeds',
      title: 'High-Yield Seeds',
      subtitle: 'Hybrid Corn, Soybeans, Paddy & Wheat',
      img: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      badge: 'Certified',
      colSpan: 'col-span-1 md:col-span-2 row-span-2'
    },
    {
      name: 'Machinery',
      title: 'Heavy Machinery',
      subtitle: 'Tractors, Harvesters & Tillage',
      img: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      badge: 'Heavy Duty',
      colSpan: 'col-span-1 md:col-span-2'
    },
    {
      name: 'Fertilizers',
      title: 'Crop Fertilizers',
      subtitle: 'Organic & NPK Soil Boosters',
      img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      badge: 'Soil Nutrients',
      colSpan: 'col-span-1'
    },
    {
      name: 'Pesticides',
      title: 'Crop Protection',
      subtitle: 'Eco Insecticides & Fungicides',
      img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      badge: 'Eco Safe',
      colSpan: 'col-span-1'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Stitch Hero Section */}
      <section className="relative bg-primary-container text-on-primary overflow-hidden rounded-b-2xl border-b border-primary">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80" 
            alt="Agricultural Field" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-primary-container/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-margin-desktop py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="badge-stitch bg-secondary-container text-on-secondary-container mb-4">
              Seasonal Campaign 2026
            </span>
            <h1 className="font-h1 text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Spring Planting & Field Essentials
            </h1>
            <p className="font-body-lg text-lg text-surface-variant mb-8 leading-relaxed">
              Gear up for maximum harvest with field-tested machinery, high-germination seed varieties, and organic soil boosters direct from verified suppliers.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setCategory('Seeds')}
                className="bg-secondary text-on-secondary font-h3 font-semibold text-base px-6 py-3 rounded-lg hover:bg-secondary-dark transition-all flex items-center gap-2 shadow-md"
              >
                <Sprout size={20} /> Shop Seeds
              </button>
              <button 
                onClick={() => setCategory('Machinery')}
                className="bg-white/10 text-white font-h3 font-semibold text-base px-6 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2 backdrop-blur-sm"
              >
                <Tractor size={20} /> Explore Machinery
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop space-y-12">
        {/* Categories Bento Grid */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-xs font-bold text-secondary-dark uppercase tracking-widest font-body-md">Curated Categories</span>
              <h2 className="font-h2 text-2xl md:text-3xl font-bold text-on-surface">Browse Farming Supplies</h2>
            </div>
            {category && (
              <button 
                onClick={() => setCategory('')} 
                className="text-sm text-primary font-semibold hover:underline"
              >
                Clear Category Filter ({category})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
            {categoryTiles.map((tile, idx) => (
              <div 
                key={idx}
                onClick={() => setCategory(tile.name)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer border border-outline-variant/30 bg-surface shadow-sm hover:shadow-md hover:border-primary/50 transition-all ${tile.colSpan}`}
              >
                <img 
                  src={tile.img} 
                  alt={tile.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="badge-stitch bg-white/90 text-primary backdrop-blur-sm text-[11px]">
                    {tile.badge}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                  <div>
                    <h3 className="font-h3 text-xl font-bold text-white mb-1 group-hover:text-secondary-container transition-colors">
                      {tile.title}
                    </h3>
                    <p className="text-xs text-white/80 font-body-md">{tile.subtitle}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter and Search Bar Header */}
        <section className="bg-surface p-4 md:p-6 rounded-xl border border-outline-variant/40 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter size={20} className="text-on-surface-variant" />
            <span className="text-sm font-bold text-on-surface">Filter By:</span>
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/60 text-on-surface text-sm rounded-lg px-3 py-2 outline-none focus:border-primary font-body-md cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Seeds">Seeds</option>
              <option value="Fertilizers">Fertilizers</option>
              <option value="Pesticides">Pesticides</option>
              <option value="Machinery">Machinery</option>
              <option value="Tools">Tools</option>
            </select>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-1/2">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search seed varieties, fertilizers, tractor models..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-l-lg pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary font-body-md"
              />
            </div>
            <button 
              type="submit" 
              className="bg-primary text-on-primary font-semibold text-sm px-6 py-2.5 rounded-r-lg hover:bg-primary-container transition-colors"
            >
              Search
            </button>
          </form>
        </section>

        {/* Products Marketplace Grid */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-h2 text-2xl font-bold text-on-surface">
              {category ? `${category} Products` : 'Featured Marketplace Products'}
            </h2>
            <span className="text-xs text-on-surface-variant font-semibold">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-surface rounded-xl border border-outline-variant/30">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold text-on-surface-variant">Loading marketplace products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-surface rounded-xl border border-outline-variant/40 p-8">
              <Package size={48} className="mx-auto text-on-surface-variant/40 mb-4" />
              <h3 className="text-lg font-bold text-on-surface mb-2">No products found</h3>
              <p className="text-sm text-on-surface-variant mb-6">Try clearing your search query or selecting a different category filter.</p>
              <button 
                onClick={() => { setSearch(''); setCategory(''); }} 
                className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product._id} className="card-stitch flex flex-col justify-between group">
                  <Link to={`/product/${product._id}`} className="block relative h-48 overflow-hidden rounded-t-lg bg-surface-container-low">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80'} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="badge-stitch bg-primary text-on-primary text-[10px]">
                        {product.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${product._id}`} className="block mb-1">
                        <h3 className="font-h3 text-base font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline mb-3 pt-3 border-t border-outline-variant/30">
                        <div className="text-xl font-bold font-h1 text-primary-dark">
                          ₹{product.price.toLocaleString('en-IN')}
                        </div>
                        <div className={`text-xs font-semibold ${product.stock > 0 ? 'text-primary' : 'text-danger'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAddToCart(e, product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          addedItem === product._id 
                            ? 'bg-secondary text-on-secondary' 
                            : 'bg-primary text-on-primary hover:bg-primary-container'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {addedItem === product._id ? (
                          <><CheckCircle size={15} /> Added!</>
                        ) : (
                          <><ShoppingCart size={15} /> Add to Cart</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stitch Agronomist Insight / SEO Block */}
        <section className="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary border border-outline-variant/30">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-container text-on-primary rounded-xl">
              <Sprout size={28} />
            </div>
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest font-body-md">Agronomist Tip</span>
              <h3 className="font-h2 text-xl font-bold text-on-surface mb-2">Optimizing Seed Germination this Season</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                Ensure soil moisture levels stay between 60-70% prior to sowing high-yield hybrid seeds. Pair your seed varieties with certified organic nitrogen boosters to enhance root establishment during early growth cycles.
              </p>
              <div className="flex gap-6 text-xs text-on-surface font-semibold">
                <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-primary" /> Verified Agri Experts</span>
                <span className="flex items-center gap-1.5"><Truck size={16} className="text-primary" /> Rural Express Shipping</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
