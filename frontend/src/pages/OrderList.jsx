import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/orders';
import {
  Package,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react';
import PageHeader from '../componenets/PageHeader';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending Payment',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Clock,
  },
  paid: {
    label: 'Payment Confirmed',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
  },
  shipped: {
    label: 'Shipped / In Transit',
    badgeStyle: 'bg-sky-50 text-sky-800 border-sky-200',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: AlertTriangle,
  },
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((res) => setOrders(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 max-w-4xl mx-auto space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-6 animate-pulse" />
        <div className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-6 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <PageHeader
            icon={<Package />}
            bg={'bg-sky-500'}
            title={'My Orders'}
            description={'Track and manage your purchase orders'}
          />
        </div>

        {orders.length === 0 ? (
          /* Empty Orders View */
          <div className="py-20 text-center bg-white rounded-3xl border border-sky-100 shadow-sm px-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 mx-auto flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">No Orders Yet</h3>
            <p className="text-sm text-slate-500 mt-1">You haven't placed any orders on RuralKart so far.</p>
            <Link
              to="/"
              className="mt-6 inline-block px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Orders Card List */
          <div className="space-y-4">
            {orders.map((order) => {
              // console.log("ORDER:", order);
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const IconComp = statusCfg.icon;

              return (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-lg hover:shadow-sky-500/5 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* LEFT — Order Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 group-hover:text-sky-600 transition">
                          Order #{order.id}
                        </span>

                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusCfg.badgeStyle}`}
                        >
                          <IconComp className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />

                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>

                        <span>•</span>

                        <span>
                          {order.items?.length || 1} items
                        </span>
                      </div>
                    </div>

                    {/* RIGHT — Products + Total + Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">

                      {/* Product Images */}
                      <div className="flex items-center">
                        <div className="flex -space-x-3">
                          {order.items?.slice(0, 3).map((item) => (
                            <div
                              key={item.id}
                              className="w-11 h-11 rounded-xl bg-slate-100 border-2 border-white overflow-hidden shadow-sm"
                            >
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name || 'Product'}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                                  —
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Remaining items */}
                          {order.items?.length > 3 && (
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total */}
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Total
                        </span>

                        <span className="text-lg font-black text-slate-900">
                          ₹{Number(order.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        className="w-5 h-5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all shrink-0"
                      />

                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}