import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProduct, fetchProducts } from '../services/products';
import { useAuth } from '../context/AuthContext';
import { addCartItem } from '../services/cart';
import ProductCard from '../componenets/ProductCard';
import QuantityStepper from '../componenets/Stepper';

import {
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  Award,
  CheckCircle,
  Package,
  ChevronRight,
  ArrowLeft,
  Zap,
  Loader2,
} from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const { user, refreshCartCount } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('story');


  useEffect(() => {
    setLoading(true);
    fetchProduct(slug)
      .then((res) => {
        const prodData = res.data;
        setProduct(prodData);

        if (prodData.category?.slug) {
          fetchProducts({ category__slug: prodData.category.slug })
            .then((relRes) => {
              const list = relRes.data.results ?? relRes.data;
              setRelatedProducts(list.filter((p) => p.id !== prodData.id).slice(0, 4));
            });
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);


  // add buy handler
  const handleBuyNow = async () => {
    if (outOfStock || adding) return;

    try {
      await handleAddToCart();
      navigate('/checkout');
    } catch (error) {
      console.error('Buy Now failed:', error);
    }
  };

  // add to cart handler
  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setAdding(true);
    setMessage('');
    try {
      await addCartItem(product.id, quantity);
      await refreshCartCount();
      setMessage('Item added to cart successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch {
      setMessage('Could not add item to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 text-center px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-sky-100 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">This product listing may have been removed or updated.</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock_quantity === 0;
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-6 sm:pt-3 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Link to="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          {product.category?.name && (
            <>
              <Link to={`/?category__slug=${product.category.slug}`} className="hover:text-sky-600">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase Dual Column */}
        <div className="grid lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:py-4 sm:p-5 border border-slate-200/80 shadow-sm mb-12">

          {/* Left Column: Image Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 relative group">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-sky-50">
                  <Package className="w-16 h-16 mb-2 stroke-[1.5]" />
                  <span className="text-sm font-semibold">Rural Handcrafted Item</span>
                </div>
              )}

              {product.category?.name && (
                <span className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                  {product.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Rating & Artisan Badge */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-700 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9 Rating
                </div>
                <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                  100% Handcrafted
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500">Taxes included • Free Rural Shipping</span>
              </div>

              {/* Stock Status Bar */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                {outOfStock ? (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Out of stock currently
                  </span>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" /> Available In Stock
                      </span>
                      <span className="text-slate-500">{product.stock_quantity} units remaining</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min((product.stock_quantity / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <p className="mt-5 text-sm text-slate-600 leading-relaxed">
                {product.description || 'This unique rural product is handcrafted by skilled traditional artisans using eco-friendly materials and heritage techniques passed down through generations.'}
              </p>
            </div>

            {/* Quantity Stepper & Add to Cart Action */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">

                  {/* Quantity Stepper */}
                  <QuantityStepper
                    quantity={quantity}
                    setQuantity={setQuantity}
                    min={1}
                    max={product.stock_quantity}
                    disabled={outOfStock}
                  />

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={outOfStock || adding}
                    className="flex-1 py-3 px-3 sm:px-5 rounded-xl
                   bg-amber-500 hover:bg-amber-600
                   text-white font-bold text-xs sm:text-sm
                   transition flex items-center justify-center gap-1.5
                   disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    disabled={outOfStock || adding}
                    className="flex-1 py-3 px-3 sm:px-5 rounded-xl
                   bg-sky-500 hover:bg-sky-600
                   text-white font-bold text-xs sm:text-sm
                   shadow-md shadow-sky-500/20
                   transition flex items-center justify-center gap-1.5
                   disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{outOfStock ? 'Out of Stock' : 'Buy Now'}</span>
                  </button>

                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full block text-center py-3.5 rounded-xl
                 bg-slate-900 hover:bg-slate-800
                 text-white font-bold text-sm transition shadow-lg"
                >
                  Sign in to Purchase
                </Link>
              )}

              {message && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200
                    text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {message}
                </div>
              )}
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100">
                <Award className="w-5 h-5 text-sky-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Artisan Certified</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Razorpay Protected</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <Truck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <span className="text-[11px] font-bold text-slate-800 block">Express Delivery</span>
              </div>
            </div>

          </div>

        </div>

        {/* Tabbed Specs & Story */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-12">
          <div className="flex border-b border-slate-200 gap-6 mb-6">
            <button
              onClick={() => setActiveTab('story')}
              className={`pb-3 font-bold text-sm transition border-b-2 ${activeTab === 'story'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              Artisan Story & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 font-bold text-sm transition border-b-2 ${activeTab === 'shipping'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
            >
              Shipping & Fair Pay Policy
            </button>
          </div>

          {activeTab === 'story' ? (
            <div className="prose prose-slate text-sm leading-relaxed text-slate-600 space-y-3">
              <p>
                Every RuralKart item carries the authentic fingerprint of rural heritage. Crafted using traditional wood, terracotta clay, brass, or hand-loomed natural fibers, these items promote eco-friendly and zero-waste living.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>100% natural and sustainably sourced raw materials</li>
                <li>Hand-carved and hand-painted by local community artisans</li>
                <li>Direct support for women self-help groups and cottage industries</li>
              </ul>
            </div>
          ) : (
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>
                <strong>Shipping Timeline:</strong> Orders are dispatched directly from village hubs within 24–48 hours. Estimated delivery takes 3–5 business days nationwide.
              </p>
              <p>
                <strong>Direct Artisan Payout:</strong> 100% of product pricing goes directly to the verified seller's account with no middleman margins.
              </p>
            </div>
          )}
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-slate-900">More From This Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}