import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { fetchOrder } from '../services/orders';
import { retryPayment, verifyPayment } from '../services/payments';
import {
  CheckCircle,
  Package,
  MapPin,
  Clock,
  Truck,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

const TRACKING_STEPS = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'paid', label: 'Payment Confirmed', icon: CheckCircle },
  { id: 'shipped', label: 'Out For Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const justPaid = location.state?.justPaid;

  // Retrying payment stuffs
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder(id).then((res) => setOrder(res.data));
  }, [id]);

  // Retry payment handle function
  const handleRetryPayment = async () => {
    setRetrying(true);
    setError("");

    try {
      const res = await retryPayment(order.id);

      const {
        order_id,
        razorpay_order_id,
        razorpay_key_id,
        amount,
        currency,
      } = res.data;

      const options = {
        key: razorpay_key_id,
        amount,
        currency,
        order_id: razorpay_order_id,
        name: "RuralKart Direct",
        description: `Order #${order_id} Payment`,
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.data.success) {
              window.location.reload();
            }
          } catch (err) {
            setError(
              err.response?.data?.detail ||
              "Payment verification failed."
            );
          }
        },
        modal: {
          ondismiss: () => {
            setRetrying(false);
          },
        },
        theme: {
          color: "#0ea5e9",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        setRetrying(false);
        setError("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to retry payment."
      );
    } finally {
      setRetrying(false);
    }
  };


  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 max-w-3xl mx-auto space-y-4">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse" />
        <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  // Calculate tracking step index
  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    if (status === 'pending') return 0;
    if (status === 'paid') return 1;
    if (status === 'shipped') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-3 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>

        {/* Just Paid Confirmation Alert */}
        {justPaid && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center gap-3 shadow-sm">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Payment Confirmed via Razorpay!</p>
              <p className="text-xs text-emerald-700 font-normal mt-0.5">
                Thank you for supporting rural Sellers. Your order has been placed and is being dispatched.
              </p>
            </div>
          </div>
        )}

        {/* Order Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                Verified Order
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                Order #{order.id}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Payment + Products + Amount */}
            <div className="flex items-center justify-between sm:justify-end gap-4">

              {/* Product Images */}
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {order.items?.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="w-20 h-20 rounded-xl bg-slate-100 border-2 border-white overflow-hidden shadow-sm"
                      title={item.product_name}
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

                  {/* Remaining products */}
                  {order.items?.length > 3 && (
                    <div className="w-11 h-11 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Pay retry */}
              {order.status === 'pending' && (
                <button
                  onClick={handleRetryPayment}
                  disabled={retrying}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 
                   text-white text-sm transition font-bold disabled:opacity-50"
                >
                  {retrying ? 'Opening Payment...' : 'Retry Payment'}
                </button>
              )}

              {/* Total Amount */}
              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-400 block font-medium">
                  Total Amount
                </span>

                <span className="text-2xl font-black text-slate-900">
                  ₹{Number(order.total_amount).toLocaleString('en-IN')}
                </span>
              </div>

            </div>

          </div>


          {/* Visual Order Tracking Timeline */}
          {order.status !== 'cancelled' ? (
            <div className="pt-8 pb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Order Status Timeline</p>

              <div className="relative flex items-center justify-between">
                {/* Connecting Progress Line */}
                <div className="absolute left-0 right-0 top-1/3 -translate-y-1/2 h-1 bg-slate-100 z-0" />
                <div
                  className="absolute left-0 top-1/3 -translate-y-1/2 h-1 bg-linear-to-r from-sky-500 to-emerald-500 transition-all duration-500 z-0"
                  style={{
                    width: `${Math.max(0, (currentStepIdx / (TRACKING_STEPS.length - 1)) * 100)}%`,
                  }}
                />

                {/* Steps Nodes */}
                {TRACKING_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center group">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all 
                          ${isCompleted
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                            : 'bg-white border-2 border-slate-200 text-slate-400'
                          } ${isCurrent ? 'ring-4 ring-sky-100 scale-110' : ''}`}
                      >
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-bold text-center max-w-80px 
                          ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
              This order was cancelled.
            </div>
          )}

        </div>

        {/* Shipping Address & Purchased Items Grid */}
        <div className="grid md:grid-cols-12 gap-6">

          {/* Shipping Address Card */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm">Shipping Destination</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl">
              {order.shipping_address || 'Address registered with order'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Razorpay Payment Protected
            </div>
          </div>

          {/* Purchased Items Card */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">
              Purchased Craft Items ({order.items?.length || 0})
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{item.product_name}</span>
                    <span className="text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-black text-slate-900 text-sm">
                    ₹{Number(item.price_at_purchase * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-black text-slate-900">
              <span>Grand Total</span>
              <span>₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

      </div>
    </div >
  );
}