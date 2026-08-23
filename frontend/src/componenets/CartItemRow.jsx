import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, Package } from 'lucide-react';

export default function CartItemRow({ item, onUpdateQuantity, onRemove, updating }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm gap-4 transition hover:border-sky-200">
      
      {/* Product Image & Title */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-20 w-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/60 relative">
          {item.product.image ? (
            <img
              src={item.product.image}
              alt={item.product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-sky-50">
              <Package className="w-6 h-6 stroke-[1.5]" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {item.product.category?.name && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              {item.product.category.name}
            </span>
          )}
          <Link
            to={`/products/${item.product.slug}`}
            className="block font-bold text-slate-900 hover:text-sky-600 transition truncate mt-0.5 text-base"
          >
            {item.product.name}
          </Link>
          <p className="text-xs text-slate-500 mt-1">
            Unit Price: <span className="font-semibold text-slate-700">₹{Number(item.product.price).toLocaleString('en-IN')}</span>
          </p>
        </div>
      </div>

      {/* Quantity Stepper & Price Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Stepper */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={updating || item.quantity <= 1}
            className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center shadow-sm transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-extrabold text-sm text-slate-800">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={updating || item.quantity >= item.product.stock_quantity}
            className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-90px">
          <span className="text-[10px] text-slate-400 block font-medium uppercase">Subtotal</span>
          <span className="text-base font-black text-slate-900">
            ₹{Number(item.subtotal).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={updating}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}