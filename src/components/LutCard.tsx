import type { Product } from '@/types';
import BeforeAfter from './BeforeAfter';

interface LutCardProps {
  product: Product;
}

export default function LutCard({ product }: LutCardProps) {
  const checkoutUrl = product.lemon_link && product.lemon_link !== '#' ? product.lemon_link : null;
  const originalPrice = product.is_bundle ? 30 : null;
  const discount = product.is_bundle && originalPrice ? Math.round((1 - product.price / originalPrice) * 100) : null;

  const buttonContent = product.is_bundle ? (
    <>Get Complete Pack — ${product.price.toFixed(0)}</>
  ) : (
    <>Add to Cart — ${product.price.toFixed(0)}</>
  );

  return (
    <div className={`group bg-neutral-900/80 border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-900/10 ${
      product.is_bundle ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-white/8'
    }`}>
      {product.is_bundle && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-900 text-center text-xs font-bold py-1.5 uppercase tracking-wider">
          Save {discount}% — Best Value
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden">
        <BeforeAfter
          beforeImages={product.before_urls?.length ? product.before_urls : product.before_url ? [product.before_url] : []}
          afterImages={product.after_urls?.length ? product.after_urls : product.after_url || product.before_url ? [product.after_url || product.before_url!] : []}
          afterFilter={product.after_filter || undefined}
          className="w-full h-full"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white leading-tight">{product.name}</h3>
            <span className="text-xs text-amber-500/80 font-medium tracking-wide uppercase mt-0.5 inline-block">
              {product.category}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xl font-bold text-white">${product.price.toFixed(0)}</span>
            {originalPrice && (
              <span className="block text-sm text-neutral-500 line-through">${originalPrice}</span>
            )}
          </div>
        </div>

        <p className="text-sm text-neutral-400 leading-relaxed mb-3 flex-1">
          {product.description}
        </p>

        {/* File format text */}
        <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
          <p className="text-xs text-neutral-300 leading-relaxed font-medium">
            <span className="text-amber-500">Includes:</span> .CUBE, .XMP, .3DL
          </p>
          <p className="text-xs text-neutral-500 leading-relaxed mt-1">
            Compatible with Premiere Pro, DaVinci Resolve, Final Cut Pro, Photoshop, Lightroom
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10">
            Premiere Pro
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/10">
            DaVinci Resolve
          </span>
          {product.is_bundle && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              All Presets
            </span>
          )}
        </div>

        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            className="lemonsqueezy-button w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 bg-amber-500 text-neutral-900 hover:bg-amber-400 active:scale-[0.98] shadow-lg shadow-amber-500/10"
          >
            {buttonContent}
          </a>
        ) : (
          <div className="w-full">
            <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm bg-white/5 text-neutral-500 border border-white/10 mb-2">
              {buttonContent}
            </div>
            <p className="text-[11px] text-amber-500/70 text-center">
              Checkout link pending — connect Lemon Squeezy to enable
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
