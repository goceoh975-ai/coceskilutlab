import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, Plus } from 'lucide-react';
import { uploadImageTo } from '@/lib/storage';

interface MultiImageDropZoneProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export default function MultiImageDropZone({
  label,
  value,
  onChange,
  max = 4,
}: MultiImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const urls = value.filter(Boolean);
  const side = label.toLowerCase().includes('before') ? 'before' : 'after';

  const handleFiles = async (files: FileList) => {
    const remaining = max - urls.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        toUpload.map((file) => uploadImageTo(file, side as 'before' | 'after'))
      );
      onChange([...urls, ...uploaded]);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload image(s). Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const slots = Math.max(max, urls.length);

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-xl border-2 border-dashed transition-all p-2 ${
          dragging ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {Array.from({ length: slots }).map((_, i) => {
            const url = urls[i];
            if (url) {
              return (
                <div key={i} className="relative group aspect-square">
                  <img src={url} alt={`${label} ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeAt(i); }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            }
            if (i === urls.length && !uploading) {
              return (
                <button
                  key={i}
                  onClick={() => inputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 flex flex-col items-center justify-center text-neutral-600 hover:text-amber-500 transition-colors"
                >
                  <Plus size={18} />
                </button>
              );
            }
            return (
              <div key={i} className="aspect-square rounded-lg bg-neutral-800/50 flex items-center justify-center">
                {uploading && <Loader2 size={16} className="text-amber-500 animate-spin" />}
              </div>
            );
          })}
        </div>

        {urls.length === 0 && !uploading && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <UploadCloud size={24} className="text-neutral-600 mb-1.5" />
            <p className="text-xs text-neutral-500">Drag &amp; drop or click + to upload</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">Up to {max} images</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
