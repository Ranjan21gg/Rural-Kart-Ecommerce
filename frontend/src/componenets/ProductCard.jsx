import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addCartItem } from '../services/cart';
import {
  ShoppingCart,
  Star,
  Check,
  Package,
  AlertCircle,
} from 'lucide-react';

export default function ProductCard({ product }) {
  const { user, refreshCartCount } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock_quantity === 0;
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (outOfStock || adding) return;

    setAdding(true);
    try {
      await addCartItem(product.id, 1);
      await refreshCartCount();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // ignore transient error
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative rounded-2xl bg-white border
     border-slate-200/80 hover:border-sky-300 shadow-sm
      hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300
       flex flex-col overflow-hidden">
      {/* Top Image Box */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square
       bg-slate-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108
             transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center
           text-slate-400 bg-linear-to-br from-sky-50 to-slate-100">
            <Package className="w-10 h-10 mb-1 stroke-[1.5]" />
            <span className="text-xs font-medium">Rural Craft</span>
          </div>
        )}

        {/* Category Pill Over Image */}
        {product.category?.name && (
          <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md
           text-white text-[10px] font-extrabold uppercase tracking-wider
            px-2.5 py-1 rounded-full shadow-md">
            {product.category.name}
          </span>
        )}

        {/* Stock Badge Overlay */}
        {outOfStock ? (
          <span className="absolute top-3 right-3 bg-rose-500
           text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
            Sold Out
          </span>
        ) : lowStock ? (
          <span className="absolute top-3 right-3 bg-amber-500
           text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow animate-pulse">
            Only {product.stock_quantity} left
          </span>
        ) : null}
      </Link>

      {/* Content Box */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 text-xs text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9</span>
            <span className="text-slate-400 text-[11px] font-normal">(Artisan Certified)</span>
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 text-sm leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={outOfStock || adding}
            className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${added
              ? 'bg-emerald-600 text-white'
              : outOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 hover:shadow-sky-500/30'
              }`}
            title={outOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {adding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : added ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}