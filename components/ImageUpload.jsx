'use client';
import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUpload({ value, onChange, bucket = 'featured-images' }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState('');
  const inputRef = useRef(null);

  async function upload(file) {
    if (!file) return;
    setErr(''); setBusy(true); setProgress(20);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.5, maxWidthOrHeight: 1800, useWebWorker: true,
      });
      setProgress(50);

      const supabase = getBrowserSupabase();
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const safeExt = /^(jpg|jpeg|png|webp|gif|avif)$/.test(ext) ? ext : 'jpg';
      const path = `articles/${Date.now()}_${Math.random().toString(36).slice(2,8)}.${safeExt}`;

      const { error: upErr } = await supabase.storage.from(bucket).upload(path, compressed, {
        cacheControl: '3600', upsert: false, contentType: compressed.type || `image/${safeExt}`,
      });
      if (upErr) throw new Error(upErr.message);
      setProgress(85);

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange?.(data.publicUrl);
      setProgress(100);
    } catch (e) {
      setErr(e.message || 'Upload gagal');
    } finally {
      setBusy(false);
      setTimeout(() => setProgress(0), 800);
    }
  }

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept="image/*" hidden
        onChange={(e) => upload(e.target.files?.[0])} />

      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-[#E5E4E0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="featured" className="w-full h-40 object-cover" />
          <button type="button" onClick={() => onChange?.('')} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-[#6B6B68] hover:text-red-500 border border-[#E5E4E0]">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="w-full h-40 rounded-lg border border-dashed border-[#E5E4E0] hover:border-[#6D5BA0]/50 hover:bg-[#6D5BA0]/5 transition flex flex-col items-center justify-center gap-2 text-[#8F8E8A] hover:text-[#6D5BA0]">
          {busy ? <Loader2 className="w-6 h-6 animate-spin text-[#6D5BA0]" /> : <ImageIcon className="w-6 h-6" />}
          <span className="text-xs font-mono">{busy ? 'MENGUNGGAH…' : '+ UPLOAD GAMBAR'}</span>
          <span className="text-[10px] text-[#B0AFAA]">JPG / PNG / WebP · maks 8MB</span>
        </button>
      )}

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#141413] border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200 disabled:opacity-50">
          <Upload className="w-3.5 h-3.5" /> Pilih file
        </button>
        {value && <span className="text-[10px] text-[#8F8E8A] font-mono truncate">{value}</span>}
      </div>

      {busy && (
        <div className="w-full h-1 bg-[#E5E4E0] rounded-full overflow-hidden">
          <div className="h-full bg-[#6D5BA0] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {err && <p className="text-xs text-red-500">{err}</p>}
    </div>
  );
}
