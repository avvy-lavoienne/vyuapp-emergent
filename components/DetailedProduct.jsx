import { Hexagon, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DetailedProduct({ item }) {
  return (
    <div className="vyu-card p-8 md:p-12">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="vyu-icon-container"><Hexagon className="w-5 h-5" /></span>
            <p className="vyu-overline">// PRODUK · {(item.category || 'Produk').toUpperCase()}</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-zinc-50 tracking-tight">{item.name}</h1>
          <p className="mt-3 text-emerald-400 font-[var(--font-mono)] text-xs uppercase tracking-widest">{item.tagline}</p>
          <p className="mt-6 text-zinc-400 text-base leading-relaxed">{item.long_description || item.description}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {(item.stack || []).map(s => <span key={s} className="vyu-chip">{s}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/#kontak" className="vyu-btn-primary">Request Collaboration <ArrowRight className="w-4 h-4" /></a>
            <a href="/portfolio" className="vyu-btn-secondary">Lihat semua proyek</a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="h-full rounded-2xl border border-emerald-400/30 p-7 bg-zinc-950/40">
            <p className="vyu-overline mb-4">// VALUE PROPOSITION</p>
            <ul className="space-y-3">
              {(item.value_props || item.features || []).map(v => (
                <li key={v} className="flex items-start gap-2 text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
