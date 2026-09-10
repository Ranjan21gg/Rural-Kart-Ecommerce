import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/products';
import ProductCard from '../componenets/ProductCard';
import HeroSection from '../componenets/HeroSection';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import {
  SlidersHorizontal,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';

const SORT_MAP = {
  'price-low': 'price',
  'price-high': '-price',
  featured: '-created_at',
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category__slug') || '';
  const sortBy = searchParams.get('sort') || 'featured';

  useEffect(() => {
    fetchCategories().then((res) => setCategories(res.data.results ??res.data));
  }, []);

  // Whenever a filter changes, start over from page 1
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  }, [search, categorySlug, sortBy]);

  useEffect(() => {
    setLoading(true);
    const params = { page, ordering: SORT_MAP[sortBy] };
    if (search) params.search = search;
    if (categorySlug) params.category__slug = categorySlug;

    fetchProducts(params)
      .then((res) => {
        let items = res.data.results ?? res.data;
        setProducts((prev) => (page === 1 ? items : [...prev, ...items]));
        setHasMore(!!res.data.next);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  }, [search, categorySlug, sortBy, page]);

  const loadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore, loading);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Hero Section Banner */}
      <HeroSection
        categories={categories}
        activeCategory={categorySlug}
        onCategorySelect={(slug) => updateParam('category__slug', slug)}
        onSearch={(query) => updateParam('search', query)}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {categorySlug
                  ? categories.find((c) => c.slug === categorySlug)?.name || 'Category Products'
                  : 'Marketplace Collection'}
              </h2>
              {search && (
                <span className="text-xs font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                  Search: "{search}"
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Authentic handmade crafts directly from verified rural creators & Seller across India
            </p>
          </div>

          {/* Sort & Quick Filter dropdowns */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured Products</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {(search || categorySlug) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Product Grid / Loading State / Empty State */}
        {initialLoading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-sm animate-pulse space-y-3"
              >
                <div className="aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-8 bg-slate-100 rounded-xl pt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="py-20 text-center bg-white rounded-3xl border border-sky-100 shadow-sm max-w-2xl mx-auto px-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">No Rural Crafts Found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              We couldn't find any products matching your current search or category filter. Try clearing filters or typing a different craft keyword.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-sky-500/20 transition"
            >
              Explore All Crafts
            </button>
          </div>
        ) : (
          <>
            {/* Product Count indicator */}
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <p>
                Showing <span className="font-bold text-slate-800">{products.length}</span> authentic products
              </p>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div ref={sentinelRef} className="h-4" />

            {loading && !initialLoading && (
              <p className="text-center text-slate-500 text-sm py-6">Loading more...</p>
            )}
            {!hasMore && products.length > 0 && (
              <p className="text-center text-slate-400 text-sm py-6">You've reached the end.</p>
            )}

          </>
        )}

      </div>
    </div>
  );
}