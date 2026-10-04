import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories } from '../../services/products';
import { createProduct, updateProduct, deleteProduct } from '../../services/admin';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  Tag,
  X,
  Search,
  LayoutDashboardIcon,
} from 'lucide-react';
// import OrderItems from '../../componenets/admin/OrderItems';
import PageHeader from '../../componenets/PageHeader';

// empty form
const emptyForm = { name: '', price: '', stock_quantity: '', category_id: '', description: '', image: null, is_active: true, };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Load Products fetch
  const loadProducts = () => {
    fetchProducts().then((res) => setProducts(res.data.results ?? res.data));
  };

  // Page open and Product and Category Fetched
  useEffect(() => {
    loadProducts();
    fetchCategories().then((res) => setCategories(res.data.results ?? res.data));
  }, []);


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      const file = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));

      setImagePreview(
        file ? URL.createObjectURL(file) : null
      );
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        await createProduct(form);
      }
      setForm(emptyForm);
      setExistingImage(null);
      setEditingId(null);
      setShowModal(false);
      loadProducts();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Failed to save product.');
    }
  };

  const handleEdit = (product) => {
    console.log("This is the selected Product id :", product)
    setEditingId(product.slug);
    setExistingImage(product.image || null);
    setForm({
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity ?? '',
      category_id: product.category?.id ?? '',
      description: product.description || '',
      image: null,
      is_active: product.is_active ?? true,
    });
    console.log(setForm)
    setError('');
    setShowModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setExistingImage(null);
    setError('');
    setForm(emptyForm);
    setShowModal(false);
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await deleteProduct(slug);
    loadProducts();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = products.filter((p) => p.stock_quantity <= 5).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-4 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title & Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">

          {/* Title */}
          <PageHeader
            icon={<LayoutDashboardIcon />}
            bg={'bg-yellow-700/70'}
            title={'Product Inventory'}
            description={'Manage catalog, add listings, and adjust rural inventory stocks'} />

          <button
            onClick={() => {
              setEditingId(null);
              setExistingImage(null);
              setImagePreview(null);
              setError('');
              setForm(emptyForm);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Product
          </button>
        </div>

        {/* Executive Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-sky-300 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-600">Total Products</span>
              <span className="text-2xl font-black text-slate-900 block">{products.length}</span>
            </div>
          </div>

          <div className="bg-amber-200 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-600">Low Stock Items</span>
              <span className="text-2xl font-black text-amber-700 block">{lowStockCount}</span>
            </div>
          </div>

          <div className="bg-green-200 p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-600">Active Categories</span>
              <span className="text-2xl font-black text-slate-900 block">{categories.length}</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 w-full sm:w-xl bg-white p-3 rounded-2xl
         border border-sky-200/80 shadow-sm 
         flex items-center gap-3
         focus-within:ring-1 focus-within:ring-sky-200">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Product Table Container */}

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-sky-100 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-2xl hover:border-sky-200 transition-all duration-200 overflow-hidden">

              {/* Product Image */}
              <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                    <div className="text-center">
                      <Package className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                      No image
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {p.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50/95 text-emerald-700 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100/95 text-slate-500 text-[10px] font-bold shadow-sm backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Product Content */}
              <div className="p-4">

                {/* Product Name + ID */}
                <div className="mb-3">
                  <h3 className="font-bold text-slate-900 text-base leading-5 line-clamp-2">
                    {p.name}
                  </h3>

                  <p className="text-[11px] text-slate-600 mt-1">
                    Product #{p.id}
                  </p>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <span className="inline-flex items-center bg-sky-50 text-sky-700 font-semibold px-2.5 py-1 rounded-lg text-[10px]">
                    <Tag className="w-3 h-3 mr-1" />
                    {p.category?.name || 'Uncategorized'}
                  </span>
                </div>

                {/* Price + Stock */}
                <div className="grid grid-cols-2 gap-2 mb-4">

                  {/* Price */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-600">
                      Price
                    </p>

                    <p className="text-base font-black text-slate-900 mt-0.5">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-600">
                      Stock
                    </p>

                    {p.stock_quantity === 0 ? (
                      <p className="text-xs font-bold text-rose-600 mt-1">
                        Out of stock
                      </p>
                    ) : p.stock_quantity <= 5 ? (
                      <p className="text-xs font-bold text-amber-700 mt-1">
                        Low ({p.stock_quantity})
                      </p>
                    ) : (
                      <p className="text-xs font-bold text-emerald-700 mt-1">
                        {p.stock_quantity} available
                      </p>
                    )}
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">

                  <button
                    onClick={() => handleEdit(p)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-sky-700 text-xs font-bold cursor-pointer transition"
                    title="Edit Product"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Product
                  </button>

                  <button
                    onClick={() => handleDelete(p.slug)}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <Package className="w-10 h-10 mx-auto text-slate-300 mb-3" />

              <p className="text-sm font-bold text-slate-600">
                No products found
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Try changing your search or add a new product.
              </p>
            </div>
          )}
        </div>


        {/* Modal Overlay Dialog for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] shadow-2xl border border-sky-100 overflow-hidden flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3 border-b border-slate-100 shrink-0">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 truncate pr-3">
                  {editingId ? 'Edit Product Item' : 'Add New Rural Product'}
                </h3>

                <button type="button" onClick={handleCancelEdit} className="p-2 text-slate-400 cursor-pointer hover:text-slate-600 rounded-full hover:bg-slate-100 transition shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Area */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* LEFT — Product Details */}
                  <div className="space-y-2.5">
                    {/* Product Title */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Product Title *
                      </label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Hand-Carved Terracotta Pot" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                    </div>

                    {/* Category + Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Category *
                        </label>

                        <select name="category_id" value={form.category_id} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Price (₹) *
                        </label>
                        <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="499" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                      </div>

                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input name="stock_quantity" type="number" min="0" value={form.stock_quantity} onChange={handleChange} required placeholder="25" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Description
                      </label>
                      <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Enter craft description..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm resize-none focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100" />
                    </div>

                    {/* Product Status */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Product Status
                      </label>

                      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {form.is_active ? 'Active Product' : 'Inactive Product'}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {form.is_active ? 'Visible to customers.' : 'Hidden from customers.'}
                          </p>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="sr-only peer" />
                          <div className="w-10 h-5 bg-slate-300 rounded-full peer peer-checked:bg-sky-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                        </label>

                      </div>
                    </div>

                  </div>


                  {/* RIGHT — Image + Actions */}
                  <div className="flex flex-col min-h-full">
                    {/* Product Image */}
                    <div className="flex flex-col flex-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Product Image
                      </label>

                      <input name="image" type="file" accept="image/*"
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 
                      rounded-xl px-3 py-2 text-sm file:mr-3 file:rounded-lg 
                      file:border-0 file:bg-sky-500 file:px-3 file:py-1.5 
                      file:text-xs file:font-bold file:text-white 
                      cursor-pointer hover:file:bg-sky-600"
                      />

                      {/* Desktop Image Area */}
                      <div className="hidden lg:flex h-65 mt-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 overflow-hidden items-center justify-center">
                        {form.image && imagePreview ? (
                          <img src={imagePreview} alt="Product preview" className="w-full h-full object-cover" />
                        ) : existingImage ? (
                          <img src={existingImage} alt="Current product" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-6">
                            <Package className="w-10 h-10 text-slate-300 mb-2" />
                            <p className="text-sm font-semibold text-slate-400">No image selected</p>
                            <p className="text-xs text-slate-400 mt-1">Upload a product image</p>
                          </div>
                        )}
                      </div>

                      {/* Mobile Image Preview */}
                      <div className="lg:hidden">
                        {form.image && imagePreview ? (
                          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                            <img src={imagePreview} alt="Product preview" className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0" />

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-600">
                                New image selected
                              </p>

                              <p className="text-[11px] text-slate-400 mt-1 truncate">
                                {form.image.name}
                              </p>
                            </div>
                          </div>
                        ) : existingImage ? (
                          <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                            <img src={existingImage} alt="Current product" className="w-20 h-20 object-cover rounded-lg border border-slate-200 shrink-0" />

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-600">
                                Current image
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Select a new image to replace it.
                              </p>
                            </div>

                          </div>
                        ) : (
                          <div className="mt-3 h-20 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                            <p className="text-xs text-slate-400">
                              No image selected
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="mt-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
                        {error}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 lg:mt-4">
                      <button type="submit" className="flex-1 py-2 bg-sky-500 cursor-pointer hover:bg-sky-600 text-white font-bold text-sm rounded-xl transition shadow-md shadow-sky-500/20">
                        {editingId ? 'Update Item' : 'Create Listing'}
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="px-5 py-2 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl cursor-pointer hover:bg-slate-50 transition">
                        Cancel
                      </button>
                    </div>

                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}