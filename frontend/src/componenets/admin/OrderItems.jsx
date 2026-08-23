import { Package } from 'lucide-react';

export default function OrderItems({ items = []}) {
  if (!items.length) {
    return (
      <div className="py-4 text-center text-xs text-slate-400">
        No product information available.
      </div>
    );
  }

  return (
    <div className='divide-y divide-slate-100'>
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 p-4"
        >
          {/* Product Image */}
          <div
            className="rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 w-16 h-16"
          >
            {item.product_image ? (
              <img
                src={item.product_image}
                alt={item.product_name || 'Product'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package
                  className={`text-slate-300 ${compact ? 'w-5 h-5' : 'w-6 h-6'
                    }`}
                />
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 whitespace-normal wrap-break-word leading-5">
              {item.product_name || 'Unknown Product'}
            </h3>

            <p className="text-xs text-slate-500 mt-0.5">
              Qty: {item.quantity}
            </p>

            <p className="text-xs text-slate-400 mt-0.5">
              ₹{Number(item.price_at_purchase).toLocaleString('en-IN')} each
            </p>
          </div>

          {/* Item Total */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-slate-900">
              ₹{(
                Number(item.price_at_purchase) * item.quantity
              ).toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}