import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../services/admin';
import OrderItems from '../../componenets/admin/OrderItems';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Filter,
  User,
  Calendar,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../../componenets/PageHeader';
import Pagination from '../../componenets/Pagination';

const NEXT_STATUS = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  shipped: 'bg-sky-50 text-sky-700 border-sky-200',
  delivered: 'bg-slate-100 text-slate-700 border-slate-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_ICONS = {
  pending: Clock,
  paid: CheckCircle,
  shipped: Truck,
  delivered: Package,
  cancelled: AlertTriangle,
};

const ACTION_STYLES = {
  paid: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  shipped: 'bg-sky-600 hover:bg-sky-700 text-white',
  delivered: 'bg-slate-900 hover:bg-slate-800 text-white',
  cancelled: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
};

const PAGE_SIZE = 5

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [pageData, setPageData] = useState({ count: 0, next: null, previous: null });

  const statusFilter = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);


  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;

      const res = await fetchAllOrders(params);
      setOrders(res.data.results ?? res.data);
      setPageData({
        count: res.data.count ?? res.data.length,
        next: res.data.next ?? null,
        previous: res.data.previous ?? null,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Could not load customer orders.'
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);


  useEffect(() => {
    // Defer execution outside the immediate synchronous render cycle
    const timer = setTimeout(() => {
      loadOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [statusFilter, page, loadOrders]);


  const setPage = (updater) => {
    const newPage = typeof updater === 'function' ? updater(page) : updater;
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage);
    setSearchParams(next);
    window.scrollTo({ top: 0 });
  };

  const handleStatusFilterChange = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('status', value);
    } else {
      next.delete('status');
    }
    next.delete('page');
    setSearchParams(next);
  };


  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError('');

    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      setError(
        err.response?.data?.status?.[0] ||
        err.response?.data?.detail ||
        'Could not update order status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-5 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">

          <PageHeader className="mb-0" bg="bg-sky-600" icon={<Package />} title="Customer Orders" description="Manage orders and fulfillment status" />

          {/* FILTER */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                <Filter className="w-4 h-4 text-sky-600" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filter Orders</span>
                <select value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)} className="mt-0.5 bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer capitalize min-w-32.5">
                  <option value="">All Orders</option>
                  {Object.keys(STATUS_STYLES).map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-sm font-medium">{error}</p>
            </div>

            <button onClick={loadOrders} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-white border border-rose-200 hover:bg-rose-100 transition-colors shrink-0">
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center shadow-sm">
            <div className="w-11 h-11 mx-auto mb-4 rounded-full bg-sky-50 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-sky-600 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Loading orders</p>
            <p className="text-xs text-slate-400 mt-1">Please wait while we fetch your orders.</p>
          </div>
        )}

        {/* ORDERS */}
        {!loading && orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-20 px-6 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Package className="w-7 h-7 text-slate-400" />
            </div>

            <p className="text-base font-bold text-slate-800">No orders found</p>

            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              There are no orders matching the selected status filter.
            </p>

            {statusFilter && (
              <button onClick={() => handleStatusFilterChange('')} className="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors cursor-pointer">
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-8">

              {orders.map((order) => {
                const nextOptions = NEXT_STATUS[order.status] || [];
                const badgeClass = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                const StatusIcon = STATUS_ICONS[order.status] || Package;

                return (
                  <div key={order.id} className="bg-sky-100 rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-200">

                    {/* ORDER TOP BAR */}
                    <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-sky-600" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order</span>
                              <span className="text-sm font-bold text-slate-900">#{order.id}</span>
                            </div>

                            <p className="text-xs text-slate-500 mt-0.5">
                              {order.items?.length || 0} {order.items?.length === 1 ? 'product' : 'products'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${badgeClass}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {order.status}
                          </span>

                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</p>
                            <p className="text-base font-extrabold text-slate-900">
                              ₹{Number(order.total_amount).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="grid lg:grid-cols-5">

                      {/* ORDER INFORMATION */}
                      <div className="lg:col-span-2 p-4 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-100">

                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-sky-600" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900">Customer Details</h3>
                        </div>

                        {/* CUSTOMER */}
                        <div className="mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Customer</p>

                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-sky-600" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{order.customer_username}</p>
                              <p className="text-[11px] text-slate-400">Customer account</p>
                            </div>
                          </div>
                        </div>

                        {/* DATE */}
                        <div className="mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Ordered On</p>

                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-slate-500" />
                            </div>

                            <p className="text-sm font-medium text-slate-700">
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* SHIPPING */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Shipping Address</p>

                          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-sky-600" />
                            </div>

                            <p className="text-sm leading-relaxed text-slate-600 wrap-break-words">
                              {order.shipping_address || 'Registered Address'}
                            </p>
                          </div>
                        </div>

                        {/* STATUS ACTIONS */}
                        {nextOptions.length > 0 && (
                          <div className="mt-6 pt-5 border-t border-slate-100">

                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div>
                                <p className="text-xs font-bold text-slate-800">Update Order Status</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Move this order to the next stage.</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                              {nextOptions.map((next) => {
                                const ActionIcon = STATUS_ICONS[next];
                                const isUpdating = updatingId === order.id;

                                return (
                                  <button key={next} onClick={() => handleStatusChange(order.id, next)} disabled={isUpdating} className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${ACTION_STYLES[next]}`}>
                                    {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                                    {isUpdating ? 'Updating...' : `Mark as ${next}`}
                                  </button>
                                );
                              })}
                            </div>

                          </div>
                        )}

                      </div>

                      {/* PRODUCTS */}
                      <div className="lg:col-span-3 p-4 sm:p-5 lg:p-6">

                        <div className="flex items-center justify-between gap-3 mb-4">

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900">Order Items</h3>
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                                {order.items?.length || 0}
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-0.5">Products included in this order</p>
                          </div>

                          <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-sky-600" />
                          </div>

                        </div>

                        {/* PRODUCT LIST */}
                        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                          <div className="max-h-64 overflow-y-auto scrollbar-thin">
                            <OrderItems items={order.items} />
                          </div>
                        </div>

                        {/* MOBILE TOTAL */}
                        <div className="mt-4 lg:hidden px-4 py-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Total Amount</p>
                            <p className="text-xs text-slate-500 mt-0.5">Final order value</p>
                          </div>

                          <p className="text-xl font-extrabold text-slate-900 whitespace-nowrap">
                            ₹{Number(order.total_amount).toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* DESKTOP TOTAL */}
                        <div className="hidden lg:flex mt-4 px-5 py-4 rounded-xl bg-sky-50 border border-sky-100 items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Total Amount</p>
                            <p className="text-xs text-slate-500 mt-0.5">Final order value</p>
                          </div>

                          <p className="text-2xl font-extrabold text-slate-900 whitespace-nowrap">
                            ₹{Number(order.total_amount).toLocaleString('en-IN')}
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* PAGINATION */}
            <div className="mt-6">
              <Pagination page={page} setPage={setPage} hasNext={!!pageData.next} hasPrevious={!!pageData.previous} count={pageData.count} pageSize={PAGE_SIZE} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}