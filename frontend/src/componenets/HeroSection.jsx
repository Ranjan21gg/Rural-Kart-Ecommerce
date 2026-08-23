import {ShoppingBag,ChevronRight,} from 'lucide-react';
import { BgGlow } from './background/BgGlow';
import HeroContent from './home/HeroContent';
import HeroFeatureCard from './home/HeroFeatureCard';

export default function HeroSection({
  categories = [],
  activeCategory = '',
  onCategorySelect,
}) {

  const activeCategoryData = categories.find(
    (category) => category.slug === activeCategory
  );

  return (
    <div className="relative overflow-hidden bg-linear-to-b from-sky-500/10 via-sky-100/30 to-slate-50 border-b border-sky-100/80 pt-4 pb-5 sm:pt-4 sm:pb-2">
      {/* Glowing Ambient Background Orbs */}
      <BgGlow />

      {/* CATEGORY QUICK FILTER — MARKETPLACE STYLE */}

      <div className="border-b border-sky-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3 h-14 overflow-x-auto scrollbar-hide">

            {/* Category Label */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 pr-4 border-r border-slate-200">

              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-sky-600" />
              </div>

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Categories
              </span>

            </div>

            {/* All */}
            <button
              onClick={() => onCategorySelect?.('')}
              className={`
          shrink-0 px-4 py-2 rounded-full text-xs font-bold
          transition-all duration-200
          ${activeCategory === ''
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200'
                }`}
            >
              All
            </button>

            {/* Categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategorySelect?.(cat.slug)}
                className={`
            shrink-0 px-4 py-2 rounded-full text-xs font-bold
            whitespace-nowrap
            transition-all duration-200
            ${activeCategory === cat.slug
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-50 text-slate-600 border border-slate-400/40 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200'
                  }
          `}
              >
                {cat.name}
              </button>
            ))}

            {/* Scroll hint */}
            <div className="hidden md:flex ml-auto shrink-0 items-center gap-1 text-slate-400">
              <span className="text-[10px] font-semibold">
                Explore
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>

          </div>

        </div>
      </div>


      {/* HERO CONTENT */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid lg:grid-cols-12 md:grid-cols-2 gap-8 lg:gap-12 items-center py-4 md:py-3">

          {/* LEFT — SMALLER HERO CONTENT */}
          <HeroContent category={activeCategoryData} />

          {/* RIGHT — SMALLER FEATURE CARD */}
          <HeroFeatureCard category={activeCategoryData} />

        </div>

      </div>

    </div>
  );
}
