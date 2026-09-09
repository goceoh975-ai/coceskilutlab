import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImageTo,
  uploadZip,
} from '@/lib/storage';
import {
  Lock,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  LogOut,
  Package,
  Upload,
  Loader2,
} from 'lucide-react';
import MultiImageDropZone from '@/components/MultiImageDropZone';

const ADMIN_PASSWORD = 'coceski2026';
const SESSION_KEY = 'coceski_admin_session';

const CATEGORIES = [
  'Cinematic',
  'Warm',
  'Night',
  'Vintage',
  'Noir',
  'Nature',
  'Portrait',
  'Bundle',
];

interface FormState {
  name: string;
  description: string;
  price: number;
  category: string;
  before_urls: string[];
  after_urls: string[];
  after_filter: string;
  lemon_link: string;
  is_bundle: boolean;
  zip_url: string;
  zip_filename: string;
}

const emptyForm = (): FormState => ({
  name: '',
  description: '',
  price: 5,
  category: 'Cinematic',
  before_urls: [],
  after_urls: [],
  after_filter: '',
  lemon_link: '',
  is_bundle: false,
  zip_url: '',
  zip_filename: '',
});

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true);
  }, []);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem(SESSION_KEY, '1');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPasswordInput('');
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 sm:py-32">
        <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
            <Lock size={26} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Enter your password to manage products
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
            className="space-y-4"
          >
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-500 text-neutral-900 font-semibold text-sm hover:bg-amber-400 transition-colors"
            >
              Enter Admin
            </button>
          </form>
          <a href="/" className="block text-center text-sm text-neutral-500 hover:text-white mt-4 transition-colors">
            Back to store
          </a>
        </div>
      </div>
    );
  }

  return <ProductManager onLogout={handleLogout} />;
}

function ProductManager({ onLogout }: { onLogout: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      before_urls: p.before_urls?.length ? p.before_urls : p.before_url ? [p.before_url] : [],
      after_urls: p.after_urls?.length ? p.after_urls : p.after_url ? [p.after_url] : [],
      after_filter: p.after_filter || '',
      lemon_link: p.lemon_link || '',
      is_bundle: p.is_bundle,
      zip_url: p.zip_url || '',
      zip_filename: '',
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || form.before_urls.length === 0) return;
    setSaving(true);

    try {
      const beforeUrls = form.before_urls;
      const afterUrls = form.after_urls.length > 0 ? form.after_urls : beforeUrls;
      const payload = {
        name: form.name,
        description: form.description,
        price: form.price,
        category: form.category,
        before_url: beforeUrls[0],
        after_url: afterUrls[0],
        before_urls: beforeUrls,
        after_urls: afterUrls,
        after_filter: form.after_filter || null,
        lemon_link: form.lemon_link || null,
        is_bundle: form.is_bundle,
        zip_url: form.zip_url || null,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      await load();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm());
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Failed to save product. Check console for details.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!confirm(`Delete "${p?.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((x) => x.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete product.');
    }
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Handle zip drop: upload to Supabase storage, set URL + filename in form
  const handleZipUpload = async (file: File) => {
    try {
      const url = await uploadZip(file);
      set('zip_url', url);
      set('zip_filename', file.name);
    } catch (err) {
      console.error('Zip upload failed:', err);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={24} className="text-amber-500" /> Product Manager
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} in database`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-neutral-900 font-semibold text-sm hover:bg-amber-400 transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 font-medium text-sm hover:bg-white/10 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full mb-6 px-4 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
      />

      {/* Product list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 size={28} className="mx-auto text-neutral-600 animate-spin mb-3" />
            <p className="text-sm text-neutral-600">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-neutral-600">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No products yet. Click "Add Product" to create one.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 bg-neutral-900/60 border border-white/8 rounded-xl p-3"
            >
              <div className="flex gap-1.5 shrink-0">
                <img src={p.before_url || ''} alt="before" className="w-16 h-16 rounded-lg object-cover bg-neutral-800" />
                <img
                  src={p.after_url || p.before_url || ''}
                  alt="after"
                  className="w-16 h-16 rounded-lg object-cover bg-neutral-800"
                  style={p.after_filter ? { filter: p.after_filter } : undefined}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white text-sm truncate">{p.name}</h3>
                  {p.is_bundle && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 uppercase">Bundle</span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {p.category} &middot; ${p.price.toFixed(0)} &middot; {p.lemon_link && p.lemon_link !== '#' ? 'Checkout linked' : 'No checkout link'}
                </p>
                {p.zip_url && (
                  <p className="text-xs text-green-500/70 mt-0.5 flex items-center gap-1">
                    <Upload size={11} /> .zip uploaded
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => !saving && setShowForm(false)}
        >
          <div
            className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="text-lg font-bold">
                {editingId ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <MultiImageDropZone
                  label="Before Images (original)"
                  value={form.before_urls}
                  onChange={(urls) => set('before_urls', urls)}
                />
                <MultiImageDropZone
                  label="After Images (graded)"
                  value={form.after_urls}
                  onChange={(urls) => set('after_urls', urls)}
                />
              </div>
              <p className="text-xs text-neutral-600 -mt-2">
                Upload up to 4 images per side. They appear in a 2x2 grid in the before/after slider.
              </p>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Cinematic Teal & Orange"
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={3}
                  placeholder="Describe the look and feel of this preset..."
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Price (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(e) => set('price', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* After filter (optional CSS filter) */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  After Image CSS Filter <span className="text-neutral-600">(optional, for preview only)</span>
                </label>
                <input
                  type="text"
                  value={form.after_filter}
                  onChange={(e) => set('after_filter', e.target.value)}
                  placeholder="e.g. contrast(1.2) saturate(1.4) hue-rotate(-8deg)"
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
                <p className="text-xs text-neutral-600 mt-1">
                  Applies a CSS filter to the after image for the before/after slider preview.
                </p>
              </div>

              {/* Checkout URL */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Lemon Squeezy Checkout Link
                </label>
                <input
                  type="url"
                  value={form.lemon_link}
                  onChange={(e) => set('lemon_link', e.target.value)}
                  placeholder="https://coceski.lemonsqueezy.com/buy/..."
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-white placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              {/* ZIP upload */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  LUT .zip File
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-800 border border-white/10 text-neutral-300 text-sm font-medium hover:bg-neutral-700 cursor-pointer transition-colors">
                    <Upload size={16} /> Upload .zip
                    <input
                      type="file"
                      accept=".zip,.cube,.xmp,.3dl,.look"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleZipUpload(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {form.zip_filename && (
                    <span className="text-sm text-green-400 flex items-center gap-1.5">
                      <Upload size={14} /> {form.zip_filename}
                      <button
                        onClick={() => { set('zip_url', ''); set('zip_filename', ''); }}
                        className="ml-1 text-neutral-600 hover:text-red-400 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}
                  {form.zip_url && !form.zip_filename && (
                    <span className="text-sm text-green-400 flex items-center gap-1.5">
                      <Upload size={14} /> .zip already uploaded
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 mt-2">
                  The .zip is uploaded to Supabase storage. You can also upload the file directly
                  to Lemon Squeezy when creating the product there.
                </p>
              </div>

              {/* Bundle checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_bundle}
                  onChange={(e) => set('is_bundle', e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <span className="text-sm text-neutral-300">Mark as bundle product (shows original $30 price)</span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-white/10">
              <button
                onClick={() => setShowForm(false)}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 font-medium text-sm hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || form.before_urls.length === 0 || saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-neutral-900 font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
