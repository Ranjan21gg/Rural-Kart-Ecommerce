import { useState, useEffect } from 'react';
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
  cancelled:
    'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetchAllOrders(
        statusFilter ? { status: statusFilter } : {}
      );

      setOrders(res.data.results ?? res.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Could not load customer orders.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

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
    <div className="min-h-screen bg-slate-50 py-6 sm:py-4 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-0">
          
          {/* Title */}
          <PageHeader
            className={'mb-6'}
            bg={'bg-yellow-700/70'}
            icon={<Package />}
            title={'Customer Orders'}
            description={'Manage orders and fulfillment status'}
          />

          {/* Filter */}
          <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-sky-500 shrink-0" />

            <span className="text-xs font-medium text-slate-500">
              Status
            </span>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer capitalize"
            >
              <option value="">All Orders</option>

              {Object.keys(STATUS_STYLES).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            <p className="text-xs font-semibold">
              {error}
            </p>

            <button
              onClick={loadOrders}
              className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}
        {loading && orders.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading orders...
            </div>
          </div>
        )}

        {/* =====================================================
            ORDERS
        ====================================================== */}
        {!loading && orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
            <Package className="w-8 h-8 mx-auto text-slate-300 mb-3" />

            <p className="text-sm font-semibold text-slate-700">
              No orders found
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Try changing the status filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">

            {orders.map((order) => {
              const nextOptions =
                NEXT_STATUS[order.status] || [];

              const badgeClass =
                STATUS_STYLES[order.status] ||
                STATUS_STYLES.pending;

              const StatusIcon =
                STATUS_ICONS[order.status] || Package;

              return (
                <div
                  key={order.id}
                  className=" bg-white rounded-2xl border border-slate-200 shadow-sm
                    overflow-hidden hover:border-slate-300 hover:shadow-md
                    transition-all duration-200"
                >
                  <div className="grid lg:grid-cols-5">

                    {/* =================================================
                        LEFT — ORDER INFORMATION
                    ================================================== */}
                    <div className="lg:col-span-2 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-100">

                      {/* Order Header */}
                      <div className="flex items-start justify-between gap-3 mb-5">

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Order
                          </p>

                          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                            #{order.id}
                          </h2>
                        </div>

                        <span
                          className={`
                            inline-flex items-center gap-1.5
                            px-2.5 py-1
                            rounded-full
                            border
                            text-[11px]
                            font-semibold
                            capitalize
                            ${badgeClass}
                          `}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status}
                        </span>
                      </div>

                      {/* Customer */}
                      <div className="mb-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                          Customer
                        </p>

                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-sky-600" />
                          </div>

                          <span className="text-sm font-semibold text-slate-800 truncate">
                            {order.customer_username}
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="mb-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                          Ordered On
                        </p>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />

                          <span>
                            {new Date(
                              order.created_at
                            ).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Shipping */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                          Shipping Address
                        </p>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />

                          <p className="text-sm leading-relaxed text-slate-600">
                            {order.shipping_address ||
                              'Registered Address'}
                          </p>
                        </div>
                      </div>

                      {/* =================================================
                          STATUS ACTIONS
                      ================================================== */}
                      {nextOptions.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-100">

                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                            Update Status
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {nextOptions.map((next) => {
                              const ActionIcon =
                                STATUS_ICONS[next];

                              const isUpdating =
                                updatingId === order.id;

                              return (
                                <button
                                  key={next}
                                  onClick={() =>
                                    handleStatusChange(
                                      order.id,
                                      next
                                    )
                                  }
                                  disabled={isUpdating}
                                  className={`inline-flex items-center gap-1.5
                                    px-3 py-1.5 rounded-lg text-xs font-semibold capitalize
                                    transition-all duration-200 disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    ${ACTION_STYLES[next]}
                                  `}
                                >
                                  {isUpdating ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    ActionIcon && (
                                      <ActionIcon className="w-3.5 h-3.5" />
                                    )
                                  )}

                                  {isUpdating
                                    ? 'Updating...'
                                    : `Mark as ${next}`}
                                </button>
                              );
                            })}

                          </div>
                        </div>
                      )}
                    </div>

                    {/* =================================================
                        RIGHT — PRODUCTS + TOTAL
                    ================================================== */}
                    <div className="lg:col-span-3 p-4 sm:p-5">

                      {/* Products Header */}
                      <div className="flex items-center justify-between mb-3">

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Order Items
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {order.items?.length || 0}{' '}
                            {order.items?.length === 1
                              ? 'product'
                              : 'products'}
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">

                        <div className="max-h-48 overflow-y-auto scrollbar-thin">
                          <OrderItems items={order.items} />
                        </div>

                      </div>

                      {/* Total */}
                      <div className="mt-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Total Amount
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Final order value
                          </p>
                        </div>

                        <p className="text-lg font-bold text-slate-900 whitespace-nowrap">
                          ₹
                          {Number(
                            order.total_amount
                          ).toLocaleString('en-IN')}
                        </p>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}