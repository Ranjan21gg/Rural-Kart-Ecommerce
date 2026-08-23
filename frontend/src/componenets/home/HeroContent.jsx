import { ShieldCheck, Truck, Award } from "lucide-react";

export default function HeroContent({ category }) {
  return (
    <div className="lg:col-span-7 text-center lg:text-left">

      <div className="inline-flex items-center gap-2 mb-4">

        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
          {category?.name || "India's Rural Marketplace"}
        </span>

      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">

        {category?.hero_title || "Handcrafted Treasures,"}

        <br />

        <span className="bg-linear-to-r from-sky-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
          {category?.hero_highlight || "Direct to Your Doorstep."}
        </span>

      </h1>

      <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base text-slate-600 leading-relaxed">
        {category?.hero_description ||
          "Discover authentic handmade crafts, traditional handlooms, pottery, organic products and village-made goods directly from rural creators across India."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center lg:justify-start gap-3">

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          Verified Sellers
        </div>

        <div className="w-px h-4 bg-slate-200" />

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Truck className="w-4 h-4 text-emerald-600" />
          Secure Delivery
        </div>

        <div className="w-px h-4 bg-slate-200" />

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Award className="w-4 h-4 text-amber-600" />
          Authentic Crafts
        </div>

      </div>

    </div>
  );
}