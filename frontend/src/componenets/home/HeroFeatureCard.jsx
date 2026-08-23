import {
  ShieldCheck,
  Truck,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";

export default function HeroFeatureCard({ category }) {
  return (
    <div className="lg:col-span-5 w-full">

      <div className="relative max-w-none mx-auto lg:ml-auto lg:mr-0">

        <div className="relative z-10 rounded-2xl bg-white p-3.5 border border-sky-100 shadow-xl shadow-sky-500/10">

          {/* Header */}
          <div className="flex items-center justify-between mb-3 px-1">

            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Featured {`${category?.name}` || 'Artisan'}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />

              <span className="text-[10px] font-bold text-amber-700">
                {category?.hero_rating || "4.9"}
              </span>
            </div>

          </div>

          {/* Image */}
          <div className="aspect-4/3 h-55 w-full rounded-xl overflow-hidden relative group bg-sky-100">

            {category?.image ? (
              <img
                src={category.image}
                alt={category.hero_product_name || category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <img src = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80" 
              className="w-full h-full flex items-center justify-center text-slate-400"/>
            )}

            {/* Gradient */}

            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />

            {/* Image Content */}

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">

              <span className="text-[9px] font-bold uppercase tracking-wider text-sky-300">
                {category?.hero_location || "Across India"}
              </span>

              <h3 className="mt-1 text-base font-bold">
                {category?.hero_product_name || "Featured Product"}
              </h3>

              <p className="mt-0.5 text-[10px] text-slate-200">
                {category?.hero_artisan_name || "Rural Artisan Collective"}
              </p>

            </div>

          </div>

          {/* Guarantees */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-slate-200 pt-3">

            <div className="rounded-lg bg-blue-200/40 py-2 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600 mx-auto" />

              <span className="mt-1 block text-[9px] font-bold text-slate-600">
                Verified
              </span>
            </div>

            <div className="rounded-lg bg-blue-200/40 py-2 text-center">
              <Truck className="w-3.5 h-3.5 text-emerald-600 mx-auto" />

              <span className="mt-1 block text-[9px] font-bold text-slate-600">
                Safe Transit
              </span>
            </div>

            <div className="rounded-lg bg-blue-200/40 py-2 text-center">
              <Award className="w-3.5 h-3.5 text-amber-600 mx-auto" />

              <span className="mt-1 block text-[9px] font-bold text-slate-600">
                Authentic
              </span>
            </div>

          </div>

        </div>

        {/* Floating Badge */}
        {/* <div className="absolute -right-3 -top-3 z-20 hidden sm:flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 shadow-lg">

          <TrendingUp className="w-4 h-4 text-sky-400" />

          <div>
            <span className="block text-[8px] text-slate-400">
              Growing Community
            </span>

            <span className="block text-[10px] font-bold text-white">
              12,400+ Families
            </span>
          </div>

        </div> */}

      </div>

    </div>
  );
}