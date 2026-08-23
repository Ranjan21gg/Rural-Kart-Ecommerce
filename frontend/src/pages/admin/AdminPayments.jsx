import { useState, useEffect } from 'react';
import { fetchAllPayments } from '../../services/admin';
import OrderItems from '../../componenets/admin/OrderItems'
import {
  CreditCard,
  Search,
  // DollarSign,
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
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Total Confirmed Revenue</span>
              <span className="text-2xl font-black text-emerald-700 block">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Successful Payouts</span>
              <span className="text-2xl font-black text-slate-900 block">{paidCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Pending Confirmations</span>
              <span className="text-2xl font-black text-amber-700 block">{pendingCount}</span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title + Count */}
              <div className="flex items-start justify-between gap-3 lg:block">

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Payment Transactions
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Customer payments and purchased products
                  </p>
                </div>

                {/* Count */}
                <span className="shrink-0 text-xs font-medium text-slate-400 sm:mt-0.5
                         lg:hidden">
                  {payments.length} transactions
                </span>

              </div>

              {/* Search */}
              <div className="w-full sm:w-full lg:w-md bg-white p-3 rounded-2xl
                  border border-slate-300/80 shadow-sm
                  flex items-center gap-3 lg:order-2">
                <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by customer username..."
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setSearch(e.target.value)
                  }
                  className="w-full min-w-0 bg-transparent text-sm text-slate-800
                   placeholder-slate-400 focus:outline-none" />
              </div>

              {/* Desktop Count */}
              <span className="hidden lg:block text-xs font-medium text-slate-400 shrink-0 lg:order-3">
                {payments.length} transactions
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="sticky top-8 z-30 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="max-h-80 overflow-x-auto">

              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Products
                    </th>

                    <th className="px-5 pl-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 pl-6 py-3.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {payments.map((p) => (

                    <tr
                      key={p.id}
                      className="group hover:bg-slate-50/70 transition-colors"
                    >

                      {/* Order */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            #{p.order_id}
                          </p>

                          <p className="text-[12px] font-medium text-slate-800 mt-0.5">
                            Payment - #{p.id}
                          </p>
                          <span className="font-mono text-xs text-slate-600">
                            Order id - {p.razorpay_order_id || '—'}
                            <br />
                            Payment id - {p.razorpay_payment_id || '—'}
                          </span>
                        </div>
                      </td>


                      {/* Customer */}
                      <td className="px-2 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">

                          <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                            <User className="w-4 h-4 text-sky-600" />
                          </div>

                          <span className="text-sm font-medium text-slate-700">
                            {p.customer_username}
                          </span>

                        </div>
                      </td>


                      {/* Products */}
                      <td className="pr-5 py-4 min-w-2 max-w-70">
                        <div className="max-h-28 overflow-y-auto pr-1">
                          <OrderItems items={p.items} />
                        </div>
                      </td>


                      {/* Amount */}
                      <td className="px-5 pl-8 py-4 whitespace-nowrap">
                        <p className="text-sm font-bold text-slate-900">
                          ₹{Number(p.amount).toLocaleString('en-IN')}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Order total
                        </p>
                      </td>


                      {/* Payment Status */}
                      <td className="px-5 py-4 whitespace-nowrap">

                        {p.status === 'captured' ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Captured
                          </span>

                        ) : p.status === 'created' ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Created
                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold capitalize">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {p.status}
                          </span>

                        )}

                      </td>


                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-md text-slate-600">
                          {new Date(p.created_at).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>

                        <p className="text-[14px] text-slate-400 mt-0.5">
                          {new Date(p.created_at).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </td>

                    </tr>

                  ))}

                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}