import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/types';
import { fetchProducts } from '@/lib/storage';
import LutCard from '@/components/LutCard';
import BeforeAfter from '@/components/BeforeAfter';
import LicensePage from '@/pages/LicensePage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import ContactPage from '@/pages/ContactPage';
import ThankYouPage from '@/pages/ThankYouPage';
import AdminPage from '@/pages/AdminPage';
import { Film, Download, Zap, ArrowRight, Package, Sparkles, Loader2 } from 'lucide-react';

function useRoute(): string {
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return route;
}

export default function App() {
  const route = useRoute();

  if (route === '/admin') return <Shell><AdminPage /></Shell>;
  if (route === '/license') return <Shell><LicensePage /></Shell>;
  if (route === '/refund-policy') return <Shell><RefundPolicyPage /></Shell>;
  if (route === '/privacy-policy') return <Shell><PrivacyPolicyPage /></Shell>;
  if (route === '/contact') return <Shell><ContactPage /></Shell>;
  if (route === '/thank-you') return <Shell><ThankYouPage /></Shell>;

  return <Shell><Storefront /></Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)] pointer-events-none" />

      <Nav />
      <main className="relative flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-xl bg-neutral-950/70 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Film size={20} className="text-neutral-900" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            COCESKI <span className="text-amber-500">LUTLab</span>
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-6 text-sm text-neutral-400">
          <a href="/#presets" className="hover:text-white transition-colors">Presets</a>
          <a href="/#how" className="hover:text-white transition-colors">How it works</a>
          <a href="/#bundle" className="hover:text-white transition-colors">Bundle</a>
          <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        <a
          href="/#bundle"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-neutral-900 font-medium text-sm hover:bg-amber-400 transition-colors"
        >
          <Package size={16} /> Get the Bundle
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Film size={18} className="text-neutral-900" />
              </div>
              <span className="font-bold tracking-tight">COCESKI <span className="text-amber-500">LUTLab</span></span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Professional cinematic color presets for filmmakers and editors.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Store</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="/#presets" className="hover:text-white transition-colors">All Presets</a></li>
              <li><a href="/#bundle" className="hover:text-white transition-colors">Complete Pack Bundle</a></li>
              <li><a href="/#how" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="/license" className="hover:text-white transition-colors">License Agreement</a></li>
              <li><a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="mailto:support@lutlab.com" className="hover:text-white transition-colors">support@lutlab.com</a></li>
              <li className="text-neutral-600">Response within 48h</li>
              <li><a href="/thank-you" className="hover:text-white transition-colors">Thank You Page</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} COCESKI LUTLab. All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            Powered by Lemon Squeezy
          </p>
        </div>
      </div>
    </footer>
  );
}

function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
      setLoading(false);
    })();
  }, []);

  const individualProducts = useMemo(() => products.filter((p) => !p.is_bundle), [products]);
  const bundleProduct = useMemo(() => products.find((p) => p.is_bundle), [products]);

  const categories = useMemo(() => {
    const set = new Set(individualProducts.map((p) => p.category));
    return ['All', ...Array.from(set).sort()];
  }, [individualProducts]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return individualProducts;
    return individualProducts.filter((p) => p.category === activeCategory);
  }, [individualProducts, activeCategory]);

  const featuredProduct = useMemo(() => individualProducts[0], [individualProducts]);

  return (
    <>
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6">
              <Zap size={14} /> Pro presets + complete pack
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Cinematic color,<br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                one click away.
              </span>
            </h1>
            <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-lg">
              Professional LUT color presets for Adobe Premiere Pro and DaVinci Resolve.
              Drag the slider to see the before &amp; after, then buy and download instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#presets"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-neutral-900 font-semibold text-sm hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20"
              >
                Browse Presets <ArrowRight size={16} />
              </a>
              <a
                href="#bundle"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                <Package size={16} /> View Bundle
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-amber-500" /> Instant download
              </div>
              <div className="flex items-center gap-2">
                <Film size={16} className="text-amber-500" /> .CUBE / .XMP / .3DL
              </div>
            </div>
          </div>

          {featuredProduct && (
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                <BeforeAfter
                  beforeImages={featuredProduct.before_urls?.length ? featuredProduct.before_urls : featuredProduct.before_url ? [featuredProduct.before_url] : []}
                  afterImages={featuredProduct.after_urls?.length ? featuredProduct.after_urls : featuredProduct.after_url || featuredProduct.before_url ? [featuredProduct.after_url || featuredProduct.before_url!] : []}
                  afterFilter={featuredProduct.after_filter || undefined}
                  className="w-full aspect-[4/3]"
                />
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-sm font-semibold text-white">{featuredProduct.name}</span>
                <span className="text-sm text-amber-500 font-bold">${featuredProduct.price.toFixed(0)}</span>
              </div>
              <p className="text-xs text-neutral-500 px-1 mt-1">Drag the slider to compare</p>
            </div>
          )}
        </div>
      </section>

      {/* Features strip */}
      <section id="how" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { icon: Download, title: 'Instant Download', desc: 'Get your .CUBE, .XMP, and .3DL files immediately after purchase — no waiting.' },
            { icon: Film, title: 'Works Everywhere', desc: 'Compatible with Premiere Pro, DaVinci Resolve, Final Cut Pro, Photoshop, and Lightroom.' },
            { icon: Zap, title: 'One-Click Apply', desc: 'Drop the LUT onto your footage and the cinematic grade is applied instantly.' },
          ].map((f, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <f.icon size={22} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bundle section */}
      {bundleProduct && (
        <section id="bundle" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/20 p-6 sm:p-10">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
                  <Sparkles size={14} /> Best Value
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{bundleProduct.name}</h2>
                <p className="text-neutral-400 leading-relaxed mb-6">{bundleProduct.description}</p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-white">${bundleProduct.price}</span>
                  <span className="text-xl text-neutral-500 line-through">$30</span>
                  <span className="text-sm font-semibold text-green-400">Save ${30 - bundleProduct.price}</span>
                </div>

                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-xs text-neutral-300 leading-relaxed font-medium mb-1">
                    <span className="text-amber-500">Includes:</span> .CUBE, .XMP, .3DL for all presets
                  </p>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Compatible with Premiere Pro, DaVinci Resolve, Final Cut Pro, Photoshop, Lightroom
                  </p>
                </div>

                {bundleProduct.lemon_link && bundleProduct.lemon_link !== '#' ? (
                  <a
                    href={bundleProduct.lemon_link}
                    className="lemonsqueezy-button inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 text-neutral-900 font-bold text-sm hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Package size={18} /> Buy Complete Pack — ${bundleProduct.price}
                  </a>
                ) : (
                  <div>
                    <div className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white/5 text-neutral-500 border border-white/10 font-bold text-sm mb-2">
                      <Package size={18} /> Buy Complete Pack — ${bundleProduct.price}
                    </div>
                    <p className="text-[11px] text-amber-500/70">
                      Checkout link pending — connect Lemon Squeezy to enable
                    </p>
                  </div>
                )}
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <BeforeAfter
                  beforeImages={bundleProduct.before_urls?.length ? bundleProduct.before_urls : bundleProduct.before_url ? [bundleProduct.before_url] : []}
                  afterImages={bundleProduct.after_urls?.length ? bundleProduct.after_urls : bundleProduct.after_url || bundleProduct.before_url ? [bundleProduct.after_url || bundleProduct.before_url!] : []}
                  afterFilter={bundleProduct.after_filter || undefined}
                  className="w-full aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Presets grid */}
      <section id="presets" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">All Presets</h2>
            <p className="mt-2 text-neutral-400">Drag any image to preview the grade.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-neutral-900'
                    : 'bg-white/5 text-neutral-400 border border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={32} className="text-neutral-600 animate-spin mb-3" />
            <p className="text-sm text-neutral-600">Loading presets...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-neutral-600">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No products yet. Add products from the admin panel.</p>
            <a href="/admin" className="inline-block mt-3 text-sm text-amber-500 hover:underline">Go to Admin</a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <LutCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ */}
      <section id="faq" className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'What format are the LUTs?', a: 'All presets are delivered as .CUBE, .XMP, and .3DL files — compatible with Premiere Pro, DaVinci Resolve, Final Cut Pro, Photoshop, and Lightroom.' },
            { q: 'How do I apply a LUT?', a: 'In Premiere Pro, use the Lumetri Color panel and browse for the .CUBE file. In DaVinci Resolve, drag the LUT into the node or use the LUT browser. It takes just a few seconds.' },
            { q: 'How do I receive my files?', a: 'After purchase, you will be redirected to a thank-you page and receive an email with your download link. The link is valid for 48 hours.' },
            { q: 'Can I use these on any footage?', a: 'Yes. The LUTs work best on footage shot in a flat or log profile, but they also look great on standard footage. You may want to adjust exposure beforehand for optimal results.' },
            { q: 'What is the license?', a: 'Each purchase includes a personal and commercial license for 1 user. You can use the presets in unlimited projects, but you cannot resell or share the files. See our License Agreement for details.' },
            { q: 'Are refunds available?', a: 'Due to the digital nature of the product, all sales are final after download. If a file is corrupted, contact support@lutlab.com within 14 days for a replacement.' },
          ].map((faq, i) => (
            <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-xl p-5">
              <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
