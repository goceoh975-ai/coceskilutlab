import { useRef, useState, useCallback } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface DropZoneProps {
  label: string;
  value: string | null;
  onChange?: (dataUrl: string) => void;
  onFile?: (file: File) => void;
}

export default function DropZone({ label, value, onChange, onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;

      if (onFile) {
        setUploading(true);
        try {
          await onFile(file);
        } catch (err) {
          console.error('Upload failed:', err);
        } finally {
          setUploading(false);
        }
      } else if (onChange) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') onChange(result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange, onFile]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all ${
          uploading
            ? 'border-amber-500/50 bg-amber-500/5 cursor-wait'
            : dragging
            ? 'border-amber-500 bg-amber-500/5'
            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
        }`}
      >
        {value ? (
          <div className="relative">
            <img src={value} alt={label} className="w-full h-40 object-cover rounded-xl" />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                <Loader2 size={24} className="text-amber-500 animate-spin" />
              </div>
            )}
            {!uploading && onChange && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            {uploading ? (
              <>
                <Loader2 size={28} className="text-amber-500 animate-spin mb-2" />
                <p className="text-sm text-neutral-400">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud size={28} className="text-neutral-600 mb-2" />
                <p className="text-sm text-neutral-400">Drag &amp; drop or click to upload</p>
                <p className="text-xs text-neutral-600 mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
