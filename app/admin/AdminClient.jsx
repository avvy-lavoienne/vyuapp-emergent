'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  LogOut, FileText, Plus, Edit3, Trash2, Eye, Save, Send,
  LayoutDashboard, Folder, ChevronRight, Bold, Italic, Heading2, Heading3,
  List, ListOrdered, Link as LinkIcon, Quote, X, Search,
  CheckCircle2, AlertTriangle, Loader2, ImageIcon as ImageLucide,
} from 'lucide-react';
import { getBrowserSupabase } from '@/lib/supabase/browser';
import ImageUpload from '@/components/ImageUpload';
import { logoutAction } from './login/actions';

function slugify(s) {
  return (s || '').toString().toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80);
}

/* ============ RICH EDITOR ============ */
function RichEditor({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || ''; }, []);
  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    if (ref.current) onChange(ref.current.innerHTML);
    ref.current?.focus();
  };
  const tools = [
    { cmd: 'bold', icon: Bold, label: 'Bold' },
    { cmd: 'italic', icon: Italic, label: 'Italic' },
    { cmd: 'formatBlock', val: 'h2', icon: Heading2, label: 'H2' },
    { cmd: 'formatBlock', val: 'h3', icon: Heading3, label: 'H3' },
    { cmd: 'insertUnorderedList', icon: List, label: 'UL' },
    { cmd: 'insertOrderedList', icon: ListOrdered, label: 'OL' },
    { cmd: 'formatBlock', val: 'blockquote', icon: Quote, label: 'Quote' },
  ];
  return (
    <div className="rounded-2xl border border-[#d2d2d7] bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#d2d2d7] bg-[#F8F7F4]">
        {tools.map((t, i) => (
          <button key={i} type="button" title={t.label} onClick={() => exec(t.cmd, t.val)} className="p-2 rounded hover:bg-[#2997ff]/10 text-[#6e6e73] hover:text-[#2997ff] transition">
            <t.icon className="w-4 h-4" />
          </button>
        ))}
        <span className="w-px h-5 bg-[#d2d2d7] mx-1" />
        <button type="button" onClick={() => { const u = prompt('URL link:'); if (u) exec('createLink', u); }} className="p-2 rounded hover:bg-[#2997ff]/10 text-[#6e6e73] hover:text-[#2997ff]" title="Link"><LinkIcon className="w-4 h-4" /></button>
        <button type="button" onClick={() => exec('formatBlock', 'p')} className="p-2 rounded hover:bg-[#2997ff]/10 text-[#6e6e73] hover:text-[#2997ff]" title="Paragraph"><X className="w-4 h-4" /></button>
      </div>
      <div ref={ref} contentEditable suppressContentEditableWarning
        data-placeholder="Mulai tulis konten artikel di sini… gunakan toolbar di atas untuk format."
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="min-h-[360px] outline-none vyu-prose px-6 py-6 max-h-[600px] overflow-y-auto" />
    </div>
  );
}

/* ============ ARTICLE EDITOR ============ */
function ArticleEditor({ article, onClose, onSaved }) {
  const isNew = !article?.id;
  const [form, setForm] = useState({
    id: article?.id || null,
    title: article?.title || '', slug: article?.slug || '',
    excerpt: article?.excerpt || '', content: article?.content || '',
    category: article?.category || 'Engineering', tags: article?.tags || [],
    cover: article?.cover || '', status: article?.status || 'draft',
  });
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => { if (isNew && !form.slug && form.title) set('slug', slugify(form.title)); }, [form.title]);

  const save = async (status) => {
    if (!form.title.trim()) { setToast({ type: 'err', msg: 'Judul wajib diisi.' }); return; }
    setBusy(true);
    const supabase = getBrowserSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const slug = form.slug || slugify(form.title);
    const payload = {
      title: form.title, slug, excerpt: form.excerpt, content: form.content,
      category: form.category, tags: form.tags, cover: form.cover, status,
      author_id: user?.id || null,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };
    let res;
    if (form.id) res = await supabase.from('articles').update(payload).eq('id', form.id).select().single();
    else res = await supabase.from('articles').insert(payload).select().single();
    setBusy(false);
    if (res.error) { setToast({ type: 'err', msg: res.error.message }); return; }
    setToast({ type: 'ok', msg: status === 'published' ? 'Artikel dipublikasikan.' : 'Draft tersimpan.' });
    setTimeout(() => onSaved(res.data), 700);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const inputCls = 'w-full bg-white border border-[#d2d2d7] rounded-lg px-4 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onClose} className="text-xs text-[#6e6e73] hover:text-[#2997ff] mb-2 inline-flex items-center gap-1.5 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Kembali ke daftar
          </button>
          <h1 className="text-2xl font-sans font-semibold text-[#1d1d1f]">{isNew ? 'Artikel Baru' : 'Edit Artikel'}</h1>
          <p className="text-xs text-[#6e6e73] font-mono mt-1">status: <span className={form.status === 'published' ? 'text-[#2997ff]' : 'text-amber-500'}>{form.status}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && form.status === 'published' && (
            <a href={`/insights/${form.slug}`} target="_blank" rel="noreferrer" className="vyu-btn-secondary text-sm"><Eye className="w-4 h-4" /> Preview Publik</a>
          )}
          <button onClick={() => setShowPreview(v => !v)} className="vyu-btn-secondary text-sm"><Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Show'} Preview</button>
          <button disabled={busy} onClick={() => save('draft')} className="vyu-btn-secondary text-sm">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Draft</button>
          <button disabled={busy} onClick={() => save('published')} className="vyu-btn-primary text-sm">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publish</button>
        </div>
      </div>

      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${toast.type === 'ok' ? 'bg-[#2997ff]/10 border border-[#2997ff]/30 text-[#2997ff]' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {toast.msg}
        </div>
      )}

      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <div className="space-y-5">
          <div className="vyu-card p-5 space-y-4">
            <div>
              <label className="block vyu-overline mb-2">// Judul</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className={inputCls} placeholder="Judul artikel" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block vyu-overline mb-2">// Slug</label>
                <input value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))} className={inputCls} placeholder="slug-otomatis" />
              </div>
              <div>
                <label className="block vyu-overline mb-2">// Kategori</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                  {['Engineering', 'Engineering Philosophy', 'Produk', 'Design Systems', 'Strategi', 'Tutorial'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} className={`${inputCls} min-h-[80px] resize-y`} placeholder="Ringkasan singkat artikel." />
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Featured Image</label>
              <ImageUpload value={form.cover} onChange={(v) => set('cover', v)} />
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map(t => (
                  <span key={t} className="vyu-chip flex items-center gap-1.5">
                    #{t} <button onClick={() => set('tags', form.tags.filter(x => x !== t))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} className={inputCls} placeholder="ketik tag lalu Enter" />
                <button onClick={addTag} className="vyu-btn-secondary text-sm whitespace-nowrap">+ Tag</button>
              </div>
            </div>
          </div>
          <div>
            <label className="block vyu-overline mb-2">// Konten</label>
            <RichEditor value={form.content} onChange={(html) => set('content', html)} />
          </div>
        </div>

        {showPreview && (
          <div className="space-y-5">
            <p className="vyu-overline">// LIVE PREVIEW</p>
            <div className="vyu-card overflow-hidden">
              {form.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.cover} alt={form.title || 'Article cover image'} className="w-full h-44 object-cover opacity-90" />
              )}
              <div className="p-6">
                <p className="vyu-overline">// {form.category}</p>
                <h2 className="mt-3 text-2xl font-sans font-semibold text-[#1d1d1f] leading-tight">{form.title || 'Judul artikel akan muncul di sini'}</h2>
                {form.excerpt && <p className="mt-3 text-[#6e6e73] text-sm">{form.excerpt}</p>}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {form.tags.map(t => <span key={t} className="text-[10px] font-mono text-[#6e6e73] uppercase">#{t}</span>)}
                </div>
                <div className="mt-6 vyu-prose !text-sm" dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-[#737370] italic">Konten akan muncul di sini…</p>' }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ PORTFOLIO EDITOR ============ */
function ArrayEditor({ label, value, onChange, placeholder }) {
  const [v, setV] = useState('');
  const add = () => { const t = v.trim(); if (t) { onChange([...value, t]); setV(''); } };
  return (
    <div>
      <label className="block vyu-overline mb-2">// {label}</label>
      <div className="space-y-1.5 mb-2">
        {value.map((it, i) => (
          <div key={i} className="flex items-center gap-2 vyu-chip w-full justify-between">
            <span className="text-[#4A4A48] text-xs flex-1 truncate">{it}</span>
            <button onClick={() => onChange(value.filter((_,j) => j !== i))} className="hover:text-red-500 flex-shrink-0"><X className="w-3 h-3" /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          className="w-full bg-white border border-[#d2d2d7] rounded-lg px-3 py-2 text-xs text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] outline-none transition-all" placeholder={placeholder} />
        <button type="button" onClick={add} className="vyu-btn-secondary text-xs whitespace-nowrap">+</button>
      </div>
    </div>
  );
}

function PortfolioEditor({ item, onClose, onSaved }) {
  const isNew = !item?.id;
  const [form, setForm] = useState({
    id: item?.id || null,
    name: item?.name || '', slug: item?.slug || '',
    tagline: item?.tagline || '', description: item?.description || '',
    long_description: item?.long_description || '',
    features: item?.features || [], value_props: item?.value_props || [], stack: item?.stack || [],
    category: item?.category || 'Produk Lain', cover: item?.cover || '',
    href: item?.href || '/portfolio', cta_label: item?.cta_label || 'Pelajari lebih lanjut',
    position: item?.position ?? 99, status: item?.status || 'published',
  });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  useEffect(() => { if (isNew && !form.slug && form.name) set('slug', slugify(form.name)); }, [form.name]);

  const save = async (status) => {
    if (!form.name.trim()) { setToast({ type: 'err', msg: 'Nama wajib diisi.' }); return; }
    setBusy(true);
    const supabase = getBrowserSupabase();
    const payload = {
      name: form.name, slug: form.slug || slugify(form.name), tagline: form.tagline,
      description: form.description, long_description: form.long_description,
      features: form.features, value_props: form.value_props, stack: form.stack,
      category: form.category, cover: form.cover, href: form.href, cta_label: form.cta_label,
      position: Number(form.position) || 99, status,
    };
    let res;
    if (form.id) res = await supabase.from('portfolio_items').update(payload).eq('id', form.id).select().single();
    else res = await supabase.from('portfolio_items').insert(payload).select().single();
    setBusy(false);
    if (res.error) { setToast({ type: 'err', msg: res.error.message }); return; }
    setToast({ type: 'ok', msg: status === 'published' ? 'Item dipublikasikan.' : 'Disimpan sebagai draft.' });
    setTimeout(() => onSaved(res.data), 600);
  };

  const inputCls = 'w-full bg-white border border-[#d2d2d7] rounded-lg px-4 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] focus:ring-[3px] focus:ring-[#2997ff]/10 outline-none transition-all';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button onClick={onClose} className="text-xs text-[#6e6e73] hover:text-[#2997ff] mb-2 inline-flex items-center gap-1.5 transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Kembali ke daftar
          </button>
          <h1 className="text-2xl font-sans font-semibold text-[#1d1d1f]">{isNew ? 'Portfolio Baru' : 'Edit Portfolio'}</h1>
          <p className="text-xs text-[#6e6e73] font-mono mt-1">status: <span className={form.status === 'published' ? 'text-[#2997ff]' : 'text-amber-500'}>{form.status}</span></p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={busy} onClick={() => save('draft')} className="vyu-btn-secondary text-sm">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Draft</button>
          <button disabled={busy} onClick={() => save('published')} className="vyu-btn-primary text-sm">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publish</button>
        </div>
      </div>

      {toast && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${toast.type === 'ok' ? 'bg-[#2997ff]/10 border border-[#2997ff]/30 text-[#2997ff]' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {toast.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {toast.msg}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="vyu-card p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block vyu-overline mb-2">// Nama Produk</label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Sellica" />
              </div>
              <div>
                <label className="block vyu-overline mb-2">// Slug</label>
                <input value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))} className={inputCls} placeholder="sellica" />
              </div>
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Tagline</label>
              <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className={inputCls} placeholder="Sistem Evaluasi Kinerja & Aktivitas" />
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Deskripsi Singkat</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={`${inputCls} min-h-[80px] resize-y`} placeholder="1-2 kalimat ringkas." />
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Deskripsi Panjang (untuk /portfolio)</label>
              <textarea value={form.long_description} onChange={(e) => set('long_description', e.target.value)} className={`${inputCls} min-h-[140px] resize-y`} placeholder="Penjelasan mendalam." />
            </div>
            <div>
              <label className="block vyu-overline mb-2">// Cover Image</label>
              <ImageUpload value={form.cover} onChange={(v) => set('cover', v)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block vyu-overline mb-2">// Kategori</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
                  {['Produk Utama', 'Data Pipeline', 'Auth Platform', 'Brand Engineering', 'Design System', 'AI Integration', 'Coming Soon'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block vyu-overline mb-2">// Posisi (urutan)</label>
                <input type="number" value={form.position} onChange={(e) => set('position', e.target.value)} className={inputCls} placeholder="1, 2, 3…" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block vyu-overline mb-2">// CTA Label</label>
                <input value={form.cta_label} onChange={(e) => set('cta_label', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block vyu-overline mb-2">// CTA Link</label>
                <input value={form.href} onChange={(e) => set('href', e.target.value)} className={inputCls} placeholder="/portfolio atau https://…" />
              </div>
            </div>
          </div>

          <div className="vyu-card p-5 space-y-5">
            <ArrayEditor label="Features (highlights pendek)" value={form.features} onChange={(v) => set('features', v)} placeholder="Fitur singkat lalu Enter" />
            <ArrayEditor label="Value Propositions" value={form.value_props} onChange={(v) => set('value_props', v)} placeholder="Value proposition lalu Enter" />
            <ArrayEditor label="Tech Stack" value={form.stack} onChange={(v) => set('stack', v)} placeholder="Next.js, PostgreSQL, …" />
          </div>
        </div>

        <div className="space-y-5">
          <p className="vyu-overline">// LIVE PREVIEW</p>
          <div className="vyu-card overflow-hidden">
            {form.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.cover} alt={form.name || 'Product cover image'} className="w-full h-40 object-cover opacity-90" />
            )}
            <div className="p-6">
              <p className="vyu-overline">// {form.category}</p>
              <h2 className="mt-3 text-2xl font-sans font-semibold text-[#1d1d1f] leading-tight">{form.name || 'Nama produk'}</h2>
              {form.tagline && <p className="mt-2 text-[#2997ff] text-xs font-mono uppercase tracking-widest">{form.tagline}</p>}
              {form.description && <p className="mt-3 text-[#6e6e73] text-sm leading-relaxed">{form.description}</p>}
              {form.features.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {form.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-xs text-[#4A4A48]"><CheckCircle2 className="w-3 h-3 text-[#2997ff] mt-0.5" /> {f}</li>)}
                </ul>
              )}
              {form.stack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {form.stack.map(s => <span key={s} className="vyu-chip text-[10px]">{s}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ DASHBOARD (default export) ============ */
export default function AdminClient({ user }) {
  const [tab, setTab] = useState('articles');
  const [view, setView] = useState({ mode: 'list', item: null });
  const [articles, setArticles] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const supabase = getBrowserSupabase();
    const [{ data: a }, { data: p }] = await Promise.all([
      supabase.from('articles').select('*').order('updated_at', { ascending: false }),
      supabase.from('portfolio_items').select('*').order('position', { ascending: true }),
    ]);
    setArticles(a || []); setPortfolio(p || []);
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    portfolio: portfolio.length,
  };

  const filteredArticles = articles.filter(a => !query || a.title.toLowerCase().includes(query.toLowerCase()) || (a.category || '').toLowerCase().includes(query.toLowerCase()));
  const filteredPortfolio = portfolio.filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()));

  const deleteArticle = async (id) => {
    if (!confirm('Hapus artikel ini?')) return;
    const supabase = getBrowserSupabase();
    await supabase.from('articles').delete().eq('id', id);
    refresh();
  };
  const deletePortfolio = async (id) => {
    if (!confirm('Hapus item portfolio ini?')) return;
    const supabase = getBrowserSupabase();
    await supabase.from('portfolio_items').delete().eq('id', id);
    refresh();
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    await logoutAction();
  };

  return (
    <div className="min-h-screen flex bg-[#f5f5f7]">
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#d2d2d7] bg-white sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-3 px-6 h-16 border-b border-[#d2d2d7]">
          <span className="w-9 h-9 rounded-lg bg-white border border-[#d2d2d7] flex items-center justify-center overflow-hidden p-1">
            <img src="/images/vyu-removebg.png" alt="VyuApp" className="w-full h-full object-contain" />
          </span>
          <span className="font-sans font-bold text-lg tracking-tight text-[#1d1d1f]">
            Vyu<span className="text-[#2997ff]">App</span>
          </span>
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => { setTab('articles'); setView({ mode: 'list' }); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${tab === 'articles' && view.mode === 'list' ? 'bg-[#2997ff]/10 text-[#2997ff] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F8F7F4]'}`}>
            <FileText className="w-4 h-4" /> Articles
          </button>
          <button onClick={() => { setTab('articles'); setView({ mode: 'edit', item: null }); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${view.mode === 'edit' && tab === 'articles' && !view.item ? 'bg-[#2997ff]/10 text-[#2997ff] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F8F7F4]'}`}>
            <Plus className="w-4 h-4" /> New Article
          </button>
          <div className="h-px bg-[#d2d2d7] my-2" />
          <button onClick={() => { setTab('portfolio'); setView({ mode: 'list' }); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${tab === 'portfolio' && view.mode === 'list' ? 'bg-[#2997ff]/10 text-[#2997ff] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F8F7F4]'}`}>
            <Folder className="w-4 h-4" /> Portfolio
          </button>
          <button onClick={() => { setTab('portfolio'); setView({ mode: 'edit', item: null }); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${view.mode === 'edit' && tab === 'portfolio' && !view.item ? 'bg-[#2997ff]/10 text-[#2997ff] font-medium' : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F8F7F4]'}`}>
            <Plus className="w-4 h-4" /> New Portfolio Item
          </button>
          <div className="h-px bg-[#d2d2d7] my-2" />
          <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#F8F7F4]">
            <LayoutDashboard className="w-4 h-4" /> Lihat Situs
          </Link>
        </nav>
        <div className="p-4 border-t border-[#d2d2d7]">
          <p className="text-xs text-[#6e6e73] mb-2 font-mono truncate">{user?.email}</p>
          <button onClick={handleLogout} disabled={loggingOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6e6e73] hover:text-red-500 hover:bg-red-50 transition">
            {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden border-b border-[#d2d2d7] bg-white sticky top-0 z-10">
          <div className="h-16 px-6 flex items-center justify-between">
            <Link href="/" className="font-sans font-bold text-lg tracking-tight text-[#1d1d1f]">Vyu<span className="text-[#2997ff]">App</span> Admin</Link>
            <button onClick={handleLogout} disabled={loggingOut} className="text-xs text-[#6e6e73] hover:text-red-500 flex items-center gap-1.5 transition">{loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Logout</button>
          </div>
          <div className="px-6 pb-3 flex gap-2 overflow-x-auto">
            <button onClick={() => { setTab('articles'); setView({ mode: 'list' }); }} className={`text-xs px-3 py-1.5 rounded-full border transition ${tab === 'articles' ? 'bg-[#2997ff] text-white border-[#2997ff]' : 'border-[#d2d2d7] text-[#6e6e73]'}`}>Articles</button>
            <button onClick={() => { setTab('portfolio'); setView({ mode: 'list' }); }} className={`text-xs px-3 py-1.5 rounded-full border transition ${tab === 'portfolio' ? 'bg-[#2997ff] text-white border-[#2997ff]' : 'border-[#d2d2d7] text-[#6e6e73]'}`}>Portfolio</button>
            <button onClick={() => setView({ mode: 'edit', item: null })} className="text-xs px-3 py-1.5 rounded-full bg-[#2997ff]/10 text-[#2997ff] border border-[#2997ff]/30">+ New</button>
          </div>
        </div>

        <div className="p-6 md:p-10">
          {view.mode === 'edit' && tab === 'articles' && (
            <ArticleEditor article={view.item} onClose={() => { setView({ mode: 'list' }); refresh(); }} onSaved={() => { setView({ mode: 'list' }); refresh(); }} />
          )}
          {view.mode === 'edit' && tab === 'portfolio' && (
            <PortfolioEditor item={view.item} onClose={() => { setView({ mode: 'list' }); refresh(); }} onSaved={() => { setView({ mode: 'list' }); refresh(); }} />
          )}

          {view.mode === 'list' && tab === 'articles' && (
            <>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <p className="vyu-overline">// DASHBOARD</p>
                  <h1 className="mt-2 text-3xl font-sans font-semibold text-[#1d1d1f]">Manajemen Artikel</h1>
                  <p className="mt-1 text-sm text-[#6e6e73]">Kelola konten editorial publik VyuApp Insights.</p>
                </div>
                <button onClick={() => setView({ mode: 'edit', item: null })} className="vyu-btn-primary"><Plus className="w-4 h-4" /> Artikel Baru</button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Total Artikel', value: stats.total, accent: 'text-[#1d1d1f]' },
                  { label: 'Published', value: stats.published, accent: 'text-[#2997ff]' },
                  { label: 'Drafts', value: stats.drafts, accent: 'text-amber-500' },
                ].map(s => (
                  <div key={s.label} className="vyu-card p-6">
                    <p className="vyu-overline">// {s.label}</p>
                    <p className={`mt-3 text-4xl font-sans font-semibold ${s.accent}`}>{loading ? '–' : s.value}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6 relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul atau kategori…"
                  className="w-full bg-white border border-[#d2d2d7] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] outline-none transition-all" />
              </div>

              <div className="vyu-card overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-[#F8F7F4] border-b border-[#d2d2d7]">
                    <tr className="text-left">
                      <th className="px-5 py-3 vyu-overline">// Judul</th>
                      <th className="px-5 py-3 vyu-overline hidden md:table-cell">// Kategori</th>
                      <th className="px-5 py-3 vyu-overline">// Status</th>
                      <th className="px-5 py-3 vyu-overline hidden lg:table-cell">// Update</th>
                      <th className="px-5 py-3 vyu-overline text-right">// Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="px-5 py-12 text-center text-[#6e6e73]"><Loader2 className="w-5 h-5 animate-spin inline" /></td></tr>
                    ) : filteredArticles.length === 0 ? (
                      <tr><td colSpan={5} className="px-5 py-12 text-center text-[#6e6e73]">Belum ada artikel. Klik &quot;Artikel Baru&quot;.</td></tr>
                    ) : filteredArticles.map(a => (
                      <tr key={a.id} className="border-t border-[#d2d2d7] hover:bg-[#F8F7F4]">
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#1d1d1f] line-clamp-1">{a.title}</p>
                          <p className="text-xs text-[#6e6e73] mt-1 line-clamp-1 font-mono">/{a.slug}</p>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell text-[#4A4A48]">{a.category}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase border ${a.status === 'published' ? 'bg-[#2997ff]/10 border-[#2997ff]/30 text-[#2997ff]' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>{a.status}</span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell text-[#6e6e73] text-xs font-mono">{new Date(a.updated_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex gap-1">
                            {a.status === 'published' && (
                              <a href={`/insights/${a.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-[#2997ff]/10 text-[#6e6e73] hover:text-[#2997ff]" aria-label="Preview artikel"><Eye className="w-4 h-4" /></a>
                            )}
                            <button onClick={() => setView({ mode: 'edit', item: a })} className="p-2 rounded hover:bg-[#2997ff]/10 text-[#6e6e73] hover:text-[#2997ff]" aria-label="Edit artikel"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => deleteArticle(a.id)} className="p-2 rounded hover:bg-red-50 text-[#6e6e73] hover:text-red-500" aria-label="Hapus artikel"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {view.mode === 'list' && tab === 'portfolio' && (
            <>
              <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <p className="vyu-overline">// PORTFOLIO CMS</p>
                  <h1 className="mt-2 text-3xl font-sans font-semibold text-[#1d1d1f]">Manajemen Portfolio</h1>
                  <p className="mt-1 text-sm text-[#6e6e73]">Kelola produk dan proyek yang muncul di halaman /portfolio publik.</p>
                </div>
                <button onClick={() => setView({ mode: 'edit', item: null })} className="vyu-btn-primary"><Plus className="w-4 h-4" /> Portfolio Baru</button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="vyu-card p-6"><p className="vyu-overline">// Total Items</p><p className="mt-3 text-4xl font-sans font-semibold text-[#1d1d1f]">{loading ? '–' : stats.portfolio}</p></div>
                <div className="vyu-card p-6"><p className="vyu-overline">// Published</p><p className="mt-3 text-4xl font-sans font-semibold text-[#2997ff]">{loading ? '–' : portfolio.filter(p => p.status === 'published').length}</p></div>
                <div className="vyu-card p-6"><p className="vyu-overline">// Drafts</p><p className="mt-3 text-4xl font-sans font-semibold text-amber-500">{loading ? '–' : portfolio.filter(p => p.status === 'draft').length}</p></div>
              </div>

              <div className="mb-6 relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e6e73]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama produk…"
                  className="w-full bg-white border border-[#d2d2d7] rounded-lg pl-9 pr-4 py-2.5 text-sm text-[#1d1d1f] placeholder:text-[#737370] focus:border-[#2997ff] outline-none transition-all" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                  <div className="col-span-full text-center py-12 text-[#6e6e73]"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
                ) : filteredPortfolio.length === 0 ? (
                  <div className="col-span-full vyu-card p-12 text-center text-[#6e6e73]">Belum ada portfolio. Klik &quot;Portfolio Baru&quot;.</div>
                ) : filteredPortfolio.map(p => (
                  <div key={p.id} className="vyu-card overflow-hidden flex flex-col">
                    {p.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover} alt={p.name} className="w-full h-32 object-cover opacity-90" />
                    ) : (
                      <div className="w-full h-32 bg-[#F4F3EE] flex items-center justify-center text-[#737370]"><ImageLucide className="w-8 h-8" /></div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="vyu-overline text-[10px]">// {p.category}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${p.status === 'published' ? 'bg-[#2997ff]/10 text-[#2997ff] border border-[#2997ff]/30' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>{p.status}</span>
                      </div>
                      <h3 className="text-base font-sans font-semibold text-[#1d1d1f]">{p.name}</h3>
                      <p className="text-xs text-[#6e6e73] mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-[#6e6e73]">
                        <span className="font-mono">pos: {p.position}</span>
                        <div className="flex gap-1">
                          <button onClick={() => setView({ mode: 'edit', item: p })} className="p-1.5 rounded hover:bg-[#2997ff]/10 text-[#6e6e73] hover:text-[#2997ff]" aria-label="Edit portfolio"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => deletePortfolio(p.id)} className="p-1.5 rounded hover:bg-red-50 text-[#6e6e73] hover:text-red-500" aria-label="Hapus portfolio"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
