import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeCartItem } from '../services/cart';
import { useAuth } from '../context/AuthContext';
import CartItemRow from '../componenets/CartItemRow';
import {
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import PageHeader from '../componenets/PageHeader';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const { refreshCartCount } = useAuth();
  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await fetchCart();
      setCart(res.data);
      await refreshCartCount();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setUpdatingId(itemId);
    try {
      const res = await updateCartItem(itemId, newQuantity);

      setCart(res.data);

      await refreshCartCount();

    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      await removeCartItem(itemId);
      await loadCart();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 max-w-5xl mx-auto">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6" />
          <div className="h-24 bg-slate-200 rounded-2xl" />
          <div className="h-24 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  const totalAmount = Number(cart?.total || 0);
  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min((totalAmount / freeShippingThreshold) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-4 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <PageHeader
              bg={'bg-sky-500'}
              icon={<ShoppingCart size={21} />}
              title={'Shopping Cart'}
              description={'Review your chosen products before checkout'}
            />
          </div>

          {!isEmpty && (
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3.5 py-2 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          )}
        </div>

        {isEmpty ? (
          /* Empty Cart View */
          <div className="py-20 text-center bg-white rounded-3xl border border-sky-100 shadow-sm max-w-xl mx-auto px-6">
            <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              Explore authentic handcrafted ceramics, handloom silk, and organic products directly from rural artisans.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" /> Browse Marketplace
            </Link>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Items List */}
            <div className="lg:col-span-7 space-y-4">

              {/* Free Shipping Tracker */}
              <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5 text-sky-600">
                    <Truck className="w-4 h-4" />
                    {totalAmount >= freeShippingThreshold
                      ? 'You unlocked FREE Rural Express Shipping!'
                      : `Add ₹${freeShippingThreshold - totalAmount} more for FREE Shipping`}
                  </span>
                  <span className="text-slate-400">{Math.round(progressToFreeShipping)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-linear-to-r from-sky-400 to-sky-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    updating={updatingId === item.id}
                  />
                ))}
              </div>

            </div>


            {/* Right Column: Summary Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg shadow-sky-500/5 space-y-4">

              <h3 className="text-lg font-black text-slate-900 pb-2 border-b border-slate-200">
                Order Summary
              </h3>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span className="font-bold text-slate-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-emerald-600">
                    {totalAmount >= freeShippingThreshold ? 'FREE' : '₹50'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>GST / Tax</span>
                  <span className="font-medium text-slate-500">Included</span>
                </div>

                {couponApplied && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold bg-emerald-50 p-2 rounded-xl text-xs">
                    <span>Artisan Special Discount</span>
                    <span>-₹50</span>
                  </div>
                )}
              </div>

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Promo / Coupon code"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 uppercase font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Grand Total */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium block">Total Payable</span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{(totalAmount + (totalAmount >= freeShippingThreshold ? 0 : 50) - (couponApplied ? 50 : 0)).toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Razorpay Secured
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-2xl bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-sm shadow-xl shadow-sky-500/25 transition flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted 256-bit Razorpay Checkout</span>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}