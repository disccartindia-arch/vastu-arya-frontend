'use client';
/**
 * components/account/AvatarUpload.tsx
 * Client-only avatar upload + auto-center-crop to a square + preview.
 * Persisted in localStorage under `vastu_avatar_<userId>` until the
 * backend gains an /auth/avatar endpoint — at that point we swap the
 * `save()` implementation only; the UI is unchanged.
 *
 * Works on iPhone, Android, Desktop, Tablet — pure <input type="file"
 * accept="image/*" capture="user"> + Canvas. No cropper library.
 */
import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const KEY = (uid: string) => `vastu_avatar_${uid}`;
const MAX_DATAURL_BYTES = 250_000; // ~250 KB post-compression — safe for localStorage

async function cropSquareToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.width, img.height);
      const sx = (img.width  - side) / 2;
      const sy = (img.height - side) / 2;
      const OUT = 256;
      const c = document.createElement('canvas');
      c.width = c.height = OUT;
      const ctx = c.getContext('2d');
      if (!ctx) return reject(new Error('canvas_unavailable'));
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, side, side, 0, 0, OUT, OUT);
      // Progressive JPEG compression until under budget.
      let q = 0.9;
      let out = c.toDataURL('image/jpeg', q);
      while (out.length > MAX_DATAURL_BYTES && q > 0.4) {
        q -= 0.1;
        out = c.toDataURL('image/jpeg', q);
      }
      resolve(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image_load_failed')); };
    img.src = url;
  });
}

export default function AvatarUpload({ userId, name }: { userId: string; name: string }) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try { setAvatar(localStorage.getItem(KEY(userId))); } catch { /* SSR/quota */ }
  }, [userId]);

  const initials = (name || 'U').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    setBusy(true);
    try {
      const dataUrl = await cropSquareToDataUrl(file);
      localStorage.setItem(KEY(userId), dataUrl);
      setAvatar(dataUrl);
      toast.success('Profile photo updated');
    } catch { toast.error('Could not process this image'); }
    finally { setBusy(false); }
  };

  const removeAvatar = () => {
    localStorage.removeItem(KEY(userId));
    setAvatar(null);
    toast.success('Profile photo removed');
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div
          data-testid="avatar-preview"
          className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold border-2 border-orange-100"
          style={{ background: avatar ? undefined : 'linear-gradient(135deg,#D4A017,#FF6B00)' }}
        >
          {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : initials}
        </div>
        <button
          type="button"
          data-testid="avatar-upload-btn"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-transform disabled:opacity-60"
          title="Change photo"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-600">Profile Photo</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Auto-cropped square · saved on this device</p>
        {avatar && (
          <button type="button" onClick={removeAvatar}
            className="mt-1 inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700">
            <Trash2 size={10} /> Remove photo
          </button>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" data-testid="avatar-file-input" />
    </div>
  );
}
