import { useRef, useState, useCallback, useEffect } from 'react';

interface BeforeAfterProps {
  beforeImages: string[];
  afterImages: string[];
  afterFilter?: string;
  className?: string;
}

function ImageGrid({ images, filter }: { images: string[]; filter?: string }) {
  const safe = images.filter(Boolean).slice(0, 4);
  if (safe.length === 0) return null;
  const grid = `${safe.length === 1 ? 'grid-cols-1 grid-rows-1' : 'grid-cols-2 grid-rows-2'} gap-1`;
  return (
    <div className={`absolute inset-0 grid ${grid}`}>
      {safe.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={`grid-${i}`}
          className="w-full h-full object-cover"
          style={filter ? { filter } : undefined}
          draggable={false}
        />
      ))}
    </div>
  );
}

export default function BeforeAfter({
  beforeImages,
  afterImages,
  afterFilter,
  className = '',
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setPosition(pct);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => updatePosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, updatePosition]);

  const before = beforeImages.filter(Boolean).slice(0, 4);
  const after = afterImages.filter(Boolean).slice(0, 4);
  if (before.length === 0 && after.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-ew-resize select-none group ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={(e) => {
        setIsDragging(true);
        updatePosition(e.touches[0].clientX);
      }}
    >
      {/* After layer (full width, bottom — revealed on the right side) */}
      <ImageGrid images={after} filter={afterFilter} />

      {/* Before layer (top, clipped to show only the left portion) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <ImageGrid images={before} />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 z-10 text-xs font-semibold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded pointer-events-none">
        Before
      </span>
      <span className="absolute top-3 right-3 z-10 text-xs font-semibold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded pointer-events-none">
        After
      </span>

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neutral-800">
            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
