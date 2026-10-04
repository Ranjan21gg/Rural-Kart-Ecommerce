import { useState, useEffect } from 'react';
import { fetchAllPayments } from '../../services/admin';
import OrderItems from '../../componenets/admin/OrderItems'
import {
  CreditCard,
  Search,
  // DollarSign,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  User,
} from 'lucide-react';
import PageHeader from '../../componenets/PageHeader';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllPayments(search ? { search } : {})
      .then((res) => setPayments(res.data.results ?? res.data));
  }, [search]);

  // Metric stats
  const totalRevenue = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const paidCount = payments.filter((p) => p.status === 'captured').length;
  const pendingCount = payments.filter((p) => p.status === 'created').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-4 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title Bar */}
        <PageHeader
          className={'mb-6'}
          bg={'bg-yellow-700/70'}
          icon={<CreditCard size={21} />}
          title={'Payment Transactions Ledger'}
          description={'Monitor Razorpay gateway payouts and payment status updates'}
        />

        {/* Financial Metrics Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-sky-300 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-800">Total Confirmed Revenue</span>
              <span className="text-2xl font-black text-emerald-700 block">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-green-300 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-sky-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-800">Successful Payouts</span>
              <span className="text-2xl font-black text-slate-900 block">{paidCount}</span>
            </div>
          </div>

          <div className="bg-amber-200 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Pending Confirmations</span>
              <span className="text-2xl font-black text-amber-700 block">{pendingCount}</span>
            </div>
          </div>
        </div>
       

        {/* Payments Cards*/}
        <div className="mt-5">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Payment Transactions
                </h2>

                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[10px] font-bold text-slate-800">
                  {payments.length}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                Customer payments and purchased products
              </p>
            </div>

            {/* Search */}
            <div className="w-full sm:w-80 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2.5 focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />

              <input
                type="text"
                placeholder="Search customer..."
                onKeyDown={(e) => e.key === 'Enter' && setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

          </div>


          {/* Payment Cards */}
          {payments.length === 0 ? (

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-16 text-center">

              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-slate-400" />
              </div>

              <p className="text-sm font-bold text-slate-800">
                No payment transactions found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Payment transactions will appear here once customers complete payments.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {payments.map((p) => (

                <div
                  key={p.id}
                  className="bg-sky-100 rounded-2xl border-2 border-slate-200 shadow-sm 
                  hover:shadow-lg hover:border-blue-200 transition-all duration-200 overflow-hidden flex flex-col"
                >

                  {/* =====================================================
              PAYMENT HEADER
          ====================================================== */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/70">

                    <div className="flex items-start justify-between gap-3">

                      {/* Payment / Order */}
                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-sky-600" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            Order
                          </p>

                          <h3 className="text-base font-extrabold text-slate-900">
                            #{p.order_id}
                          </h3>

                        </div>

                      </div>


                      {/* Payment Status */}
                      {p.status === 'captured' ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Captured
                        </span>

                      ) : p.status === 'created' ? (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Created
                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold capitalize shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {p.status}
                        </span>

                      )}

                    </div>


                    {/* Date + Payment ID */}
                    <div className="flex items-center justify-between gap-3 mt-4">

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                        <span>
                          {new Date(p.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400">
                        Payment #{p.id}
                      </span>

                    </div>

                  </div>


                  {/* =====================================================
              PAYMENT CONTENT
          ====================================================== */}
                  <div className="p-4 flex-1">


                    {/* CUSTOMER */}
                    <div className="mb-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Customer
                      </p>

                      <div className="flex items-center gap-2.5">

                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-sky-600" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-slate-800 truncate">
                            {p.customer_username}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Customer account
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* RAZORPAY DETAILS */}
                    <div className="mb-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Razorpay Details
                      </p>

                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">

                        <div className="flex items-start justify-between gap-3">

                          <span className="text-[10px] font-semibold text-slate-600 shrink-0">
                            Order ID
                          </span>

                          <span className="text-[10px] font-mono font-medium text-slate-600 text-right break-all">
                            {p.razorpay_order_id || '—'}
                          </span>

                        </div>

                        <div className="border-t border-slate-200" />

                        <div className="flex items-start justify-between gap-3">

                          <span className="text-[10px] font-semibold text-slate-600 shrink-0">
                            Payment ID
                          </span>

                          <span className="text-[10px] font-mono font-medium text-slate-600 text-right break-all">
                            {p.razorpay_payment_id || '—'}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* PRODUCTS */}
                    <div>

                      <div className="flex items-center justify-between mb-2">

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            Purchased Products
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {p.items?.length || 0}{' '}
                            {p.items?.length === 1 ? 'product' : 'products'}
                          </p>

                        </div>

                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-500" />
                        </div>

                      </div>


                      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">

                        <div className="max-h-40 overflow-y-auto scrollbar-thin">
                          <OrderItems items={p.items} />
                        </div>

                      </div>

                    </div>

                  </div>


                  {/* =====================================================
              AMOUNT + DATE
          ====================================================== */}
                  <div className="px-4 pb-4">

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between gap-3">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          Payment Amount
                        </p>

                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(p.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                      </div>

                      <p className="text-xl font-extrabold text-slate-900 whitespace-nowrap">
                        ₹{Number(p.amount).toLocaleString('en-IN')}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>


  );
}