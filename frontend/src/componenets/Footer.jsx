import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Send,
  Heart,
  Award,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Direct Artisan Support</h4>
              <p className="text-xs text-slate-400">100% fair pay for rural creators</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Authenticity</h4>
              <p className="text-xs text-slate-400">Handcrafted certified goods</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Express Delivery</h4>
              <p className="text-xs text-slate-400">Insured Pan-India shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Dedicated Support</h4>
              <p className="text-xs text-slate-400">Razorpay protected checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
        
        {/* Brand Summary */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              RuralKart
            </span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Empowering village artisans, self-help groups, and rural craftsmen by bringing authentic, sustainable, and handmade Indian heritage directly to your doorstep.
          </p>
          <div className="pt-2">
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Newsletter Subscription</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email..."
                className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 flex-1"
              />
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl px-4 py-2 text-sm font-semibold transition flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Join
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-sky-400 transition">All Products</Link>
            </li>
            <li>
              <Link to="/?category__slug=handicrafts" className="hover:text-sky-400 transition">Handcrafted Pottery</Link>
            </li>
            <li>
              <Link to="/?category__slug=textiles" className="hover:text-sky-400 transition">Handloom Textiles</Link>
            </li>
            <li>
              <Link to="/?category__slug=organic" className="hover:text-sky-400 transition">Organic Farming</Link>
            </li>
            <li>
              <Link to="/?category__slug=decor" className="hover:text-sky-400 transition">Home & Living</Link>
            </li>
          </ul>
        </div>

        {/* Customer Account */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/cart" className="hover:text-sky-400 transition">Shopping Cart</Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-sky-400 transition">Track Orders</Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-sky-400 transition">Account Sign in</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-sky-400 transition">Create Account</Link>
            </li>
          </ul>
        </div>

        {/* Seller & Platform Info */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Craftsmanship</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Are you a local artisan or rural cooperative looking to list products on RuralKart?
          </p>
          <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-800/40 text-xs text-sky-300">
            <span className="font-semibold block text-sky-200 mb-0.5">Zero Commission Initiative</span>
            Direct payment setup via Razorpay payouts.
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} RuralKart E-Commerce Platform. Built for Indian Artisans.</p>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>using 2026 Web Standards</span>
        </div>
      </div>
    </footer>
  );
}
