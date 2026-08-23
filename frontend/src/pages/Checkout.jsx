import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkout, buyNow, fetchPaymentStatus } from '../services/orders';
import { verifyPayment } from '../services/payments';
import { fetchMe } from '../services/auth';
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Truck,
} from 'lucide-react';
import PageHeader from '../componenets/PageHeader';

// const POLL_INTERVAL_MS = 2000;
// const POLL_TIMEOUT_MS = 60000;

export default function Checkout() {
  const [addressMode, setAddressMode] = useState('saved');
  const [address, setAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState('');
  const [stage, setStage] = useState('form'); // form | processing | polling | failed
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    fetchMe()
      .then((res) => {
        const saved = res.data.shipping_address || '';

        setSavedAddress(saved);
        setAddress(saved);
      })
      .catch((err) => {
        console.error('Failed to load saved address:', err);
      });
  }, []);

  // const pollPaymentStatus = (orderId) => {
  //   setStage('polling');
  //   const startedAt = Date.now();

  //   const interval = setInterval(async () => {
  //     if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
  //       clearInterval(interval);
  //       setStage('failed');
  //       setError("We haven't confirmed your payment yet. Check your Orders page in a few minutes.");
  //       return;
  //     }

  //     try {
  //       const res = await fetchPaymentStatus(orderId);
  //       // console.log("PAYMENT STATUS:", res.data);
  //       if (res.data.order_status === 'paid') {
  //         clearInterval(interval);
  //         navigate(`/orders/${orderId}`, { state: { justPaid: true } });
  //       } else if (res.data.order_status === 'cancelled') {
  //         clearInterval(interval);
  //         setStage('failed');
  //         setError('Payment was not completed. Your order was cancelled.');
  //       }
  //     } catch {
  //       // network hiccup fallback
  //     }
  //   }, POLL_INTERVAL_MS);
  // };

  // buy now data from current id
  const location = useLocation();
  const buyNowData = location.state?.buyNow
    ? {
      productId: location.state.productId,
      quantity: location.state.quantity,
    }
    : null;


  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setStage('processing');

    try {
      // const res = await checkout(address);
      const res = buyNowData
        ? await buyNow(
          buyNowData.productId,
          buyNowData.quantity,
          address
        )
        : await checkout(address);

      const { order_id, razorpay_order_id, razorpay_key_id, amount, currency } = res.data;

      const options = {
        key: razorpay_key_id,
        amount,
        currency,
        order_id: razorpay_order_id,
        name: 'RuralKart Direct',
        description: `Order #${order_id} Payment`,
        prefill: { name: user?.username },

        handler: async (response) => {
          try {
            setStage('processing');

            console.log('Razorpay Response:', response);

            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log('Payment Verified:', result.data);

            if (result.data.success) {
              navigate(`/orders/${result.data.order_id}`, {
                state: { justPaid: true },
              });
            }
          } catch (err) {
            console.error('Payment verification failed:', err.response?.data || err);

            setStage('failed');
            setError(
              err.response?.data?.detail ||
              'Payment verification failed. Please check your Orders page.'
            );
          }
        },

        modal: {
          ondismiss: () => {
            setStage('form');
            setError('Payment popup closed. Your order is saved as pending — retry from your Orders tab anytime.');
          },
        },
        theme: { color: '#0ea5e9' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setStage('failed');
        setError('Payment failed. Please check card details or try again.');
      });
      rzp.open();
    } catch (err) {
      setStage('form');
      setError(err.response?.data?.detail || 'Checkout failed. Please review address details.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-4 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0">

        {/* Title Bar */}
        <div className="flex items-center gap-3 mb-4">
          <PageHeader icon={<Lock />}
            bg={'bg-sky-500'}
            title={'Secure Checkout'}
            description={'Provide shipping address to launch Razorpay Payment Gateway'}
          />
        </div>

        {stage === 'verifying' ? (
          /* Polling Spinner Screen */
          <div className="py-20 text-center bg-white rounded-3xl border border-sky-100 shadow-xl max-w-lg mx-auto px-8 space-y-4">
            <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center relative">
              <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Confirming Your Payment...</h2>
            <p className="text-sm text-slate-500">
              We are communicating with Razorpay servers to confirm your transaction. Please do not close or refresh this page.
            </p>
            <div className="p-3 bg-sky-50 text-sky-800 rounded-xl text-xs font-semibold">
              Verification takes a few seconds...
            </div>
          </div>
        ) : (
          /* Checkout Form & Summary Grid */
          <div className="grid md:grid-cols-12 gap-8 items-start">

            {/* Left: Shipping Address Input */}
            <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">

              <div className="flex items-center gap-2 pb-0 border-b border-slate-100">
                <MapPin className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  1. Delivery Address
                </h3>
              </div>


              {/* Address fill form...... */}
              <form onSubmit={handleCheckout} className="space-y-5">
                {/* Address Mode */}
                <div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Saved Address */}
                    <button
                      type="button"
                      onClick={() => {
                        setAddressMode('saved');
                        setAddress(savedAddress);
                      }}
                      className={`text-left p-4 rounded-2xl border transition ${addressMode === 'saved'
                        ? 'border-sky-400 bg-sky-50 ring-2 ring-sky-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin
                          className={`w-4 h-4 ${addressMode === 'saved'
                            ? 'text-sky-600'
                            : 'text-slate-400'
                            }`}
                        />

                        <span className="text-sm font-bold text-slate-900">
                          Use Saved Address
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {savedAddress || 'No saved address available'}
                      </p>
                    </button>

                    {/* New Address */}
                    <button
                      type="button"
                      onClick={() => {
                        setAddressMode('manual');
                        setAddress('');
                      }}
                      className={`text-left p-4 rounded-2xl border transition ${addressMode === 'manual'
                        ? 'border-sky-400 bg-sky-50 ring-2 ring-sky-100'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-slate-400" />

                        <span className="text-sm font-bold text-slate-900">
                          Enter New Address
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">
                        Add a different delivery address
                      </p>
                    </button>

                  </div>
                </div>

                {/* Manual Address */}
                {addressMode === 'manual' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Complete Shipping Address *
                    </label>

                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      rows={4}
                      placeholder="House / Flat No., Street Name, Landmark, City, State, PIN Code"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 transition placeholder:text-slate-400"
                    />
                  </div>
                )}

                {/* Saved address preview */}
                {addressMode === 'saved' && savedAddress && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />

                      <div>
                        <p className="text-xs font-bold text-slate-700 mb-1">
                          Delivering to
                        </p>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {savedAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    {error}
                  </div>
                )}

                {/* Payment */}
                <button
                  type="submit"
                  disabled={stage === 'processing' || !address.trim()}
                  className="w-full py-4 rounded-2xl bg-linear-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-sm shadow-xl shadow-sky-500/25 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {stage === 'processing' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Launching Razorpay...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay Now via Razorpay
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Right: Security & Summary */}
            <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">

              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold">2. Payment Protection</h3>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Razorpay Gateway Integration</span>
                    Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets.
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-3">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Direct Artisan Fulfillment</span>
                    Insured tracking link sent via SMS and Email upon payment confirmation.
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}