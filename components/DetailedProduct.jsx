import { ArrowRight } from 'lucide-react';

export default function DetailedProduct({ item }) {
  return (
    <div className="p-8 md:p-12 rounded-2xl border border-[#E5E4E0] bg-white">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs text-[#6D5BA0] uppercase tracking-[0.12em] font-medium">
            {(item.category || 'Produk').toUpperCase()}
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-sans font-semibold text-[#141413] tracking-[-0.025em]">
            {item.name}
          </h1>
          <p className="mt-3 text-xs text-[#6D5BA0] font-medium uppercase tracking-[0.12em]">{item.tagline}</p>
          <p className="mt-6 text-[#4A4A48] text-base leading-relaxed">{item.long_description || item.description}</p>
          {(item.stack || []).length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {(item.stack || []).map(s => (
                <span key={s} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-[#6B6B68] bg-[#F4F3EE] border border-[#E5E4E0]">
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/#kontak"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D5BA0] text-white text-sm font-semibold hover:bg-[#574886] transition-all duration-200 hover:-translate-y-0.5"
            >
              Request Collaboration <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/portfolio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent text-[#141413] font-semibold text-sm border border-[#D1D0C9] hover:border-[#B0AFAA] hover:bg-black/[0.02] transition-all duration-200 hover:-translate-y-0.5"
            >
              Lihat semua proyek
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="h-full rounded-2xl border border-[#E5E4E0] p-7 bg-[#F8F7F4]">
            <p className="font-mono text-xs text-[#8F8E8A] uppercase tracking-[0.15em] font-medium mb-4">
              Value Proposition
            </p>
            <ul className="space-y-3">
              {(item.value_props || item.features || []).map(v => (
                <li key={v} className="flex items-start gap-2 text-sm text-[#4A4A48] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D5BA0] mt-2 flex-shrink-0" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
