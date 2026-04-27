'use client';
import { useState, useRef } from 'react';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { uploadAPI } from '../../lib/api';
import toast from 'react-hot-toast';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUploader({ images, onChange, maxImages = 5, label = 'Product Images' }: Props) {
  const [uploading, setUploading] = useState<number | null>(null); // index being uploaded
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileSelect = async (file: File, idx: number) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setUploading(idx);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await uploadAPI.single(fd);
      const updated = [...images];
      updated[idx] = data.data.url;
      onChange(updated);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated.length ? updated : ['']);
  };

  const addSlot = () => {
    if (images.length < maxImages) onChange([...images, '']);
  };

  const handleUrlChange = (idx: number, url: string) => {
    const updated = [...images];
    updated[idx] = url;
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
        {label}
        <span className="ml-1 font-normal normal-case text-gray-400">({images.filter(u => u.trim()).length}/{maxImages} images)</span>
      </label>

      <div className="space-y-2">
        {images.map((url, idx) => (
          <div key={idx} className="flex items-center gap-2">

            {/* Preview thumbnail */}
            <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 border-dashed border-orange-200 bg-orange-50 flex items-center justify-center">
              {uploading === idx ? (
                <Loader2 size={18} className="text-primary animate-spin" />
              ) : url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all" />
                </>
              ) : (
                <ImagePlus size={18} className="text-gray-300" />
              )}
            </div>

            {/* Upload button */}
            <label
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex-shrink-0 border ${
                uploading !== null
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white hover:border-primary'
              }`}
            >
              {uploading === idx ? (
                <><Loader2 size={12} className="animate-spin" />Uploading…</>
              ) : (
                <><Upload size={12} />Upload</>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
                disabled={uploading !== null}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file, idx);
                  e.target.value = '';
                }}
              />
            </label>

            {/* URL input (paste fallback) */}
            <input
              type="text"
              value={url}
              onChange={e => handleUrlChange(idx, e.target.value)}
              placeholder="Or paste image URL…"
              className="flex-1 px-3 py-2.5 border border-orange-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-gray-600 placeholder-gray-300"
            />

            {/* Remove */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add more slot */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={addSlot}
          className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-medium"
        >
          <ImagePlus size={12} /> Add another image
        </button>
      )}

      <p className="mt-1.5 text-xs text-gray-400">
        Click <strong>Upload</strong> to pick from your device • Max 5MB per image • JPG, PNG, WebP supported
      </p>
    </div>
  );
}
