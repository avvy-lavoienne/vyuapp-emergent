'use client';
import { ArrowRight, Sparkles, Activity, TerminalSquare } from 'lucide-react';

export default function Hero() {
  // Static node positions for the SVG network. CSS animation handles pulsing.
  const nodes = [
    { x: 80, y: 60 }, { x: 220, y: 110 }, { x: 360, y: 70 },
    { x: 520, y: 140 }, { x: 660, y: 90 }, { x: 140, y: 220 },
    { x: 300, y: 260 }, { x: 460, y: 230 }, { x: 600, y: 280 },
    { x: 200, y: 360 }, { x: 380, y: 380 }, { x: 540, y: 340 },
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[1,5],[2,6],[3,7],[5,6],[6,7],[7,8],[5,9],[6,10],[7,11],[9,10],[10,11]];

  return (
    <section className="relative min-h-[100svh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* grid background */}
      <div className="absolute inset-0 vyu-grid-bg" />
      {/* glow orbs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-emerald-500/20 blur-[120px] animate-vyu-glow-orb"
      />
      <div
        aria-hidden
        className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-sky-500/15 blur-[120px] animate-vyu-glow-orb"
        style={{ animationDelay: "2s" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-teal-500/15 blur-[120px] animate-vyu-glow-orb"
        style={{ animationDelay: "4s" }}
      />
      {/* scanline */}
      <div className="vyu-scanline" aria-hidden />

      {/* animated SVG node network (right side, desktop) */}
      <svg
        className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[720px] h-[440px] opacity-60"
        viewBox="0 0 720 440"
        fill="none"
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#34d399"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        {nodes.map((n, i) => (
          <g
            key={i}
            style={{
              animation: `vyu-pulse 2.6s ease-in-out infinite`,
              animationDelay: `${(i * 0.18).toFixed(2)}s`,
              transformOrigin: `${n.x}px ${n.y}px`,
            }}
          >
            <circle cx={n.x} cy={n.y} r="3" fill="#34d399" />
            <circle cx={n.x} cy={n.y} r="8" fill="#34d399" fillOpacity="0.15" />
          </g>
        ))}
      </svg>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 w-full grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 animate-vyu-reveal">
          <p className="vyu-overline">// VYUAPP — GARUT, JAWA BARAT</p>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-zinc-50">
            Rekayasa web bespoke
            <br className="hidden sm:block" /> untuk operator yang
            <br className="hidden sm:block" />
            <span className="text-gradient-emerald">menolak template.</span>
          </h1>
          <p className="mt-7 text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
            VyuApp adalah studio kecil yang membangun produk digital presisi
            tinggi — dari platform pelaporan kinerja Sellica hingga sistem
            market intelligence premium Avalon. Kami menjual hasil, bukan jam.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <a href="#kapabilitas" className="vyu-btn-primary">
              Lihat kapabilitas <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#kontak" className="vyu-btn-secondary">
              Diskusikan proyek
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-vyu-pulse" />{" "}
              2 produk aktif di produksi
            </div>
            <div className="flex items-center gap-2 font-[var(--font-mono)]">
              // SISTEM ONLINE 99.97%
            </div>
            <div className="flex items-center gap-2 font-[var(--font-mono)]">
              // MENERIMA KOLABORASI
            </div>
          </div>
        </div>

        {/* Floating mini-terminal card */}
        <div className="lg:col-span-5 relative">
          <div className="vyu-card p-6 animate-vyu-float relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TerminalSquare className="w-4 h-4 text-emerald-400" />
                <span className="font-[var(--font-mono)] text-xs text-zinc-400">
                  vyu@studio:~$
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="font-[var(--font-mono)] text-xs leading-relaxed space-y-1.5">
              <p className="text-zinc-500">$ vyu status --all</p>
              <p className="text-emerald-400">✓ sellica.io — operational</p>
              <p className="text-emerald-400">✓ avalon.design — operational</p>
              <p className="text-zinc-500">$ vyu metrics --24h</p>
              <p className="text-zinc-300">
                {" "}
                uptime: <span className="text-emerald-400">99.97%</span>
              </p>
              <p className="text-zinc-300">
                {" "}
                p95 latency: <span className="text-emerald-400">87ms</span>
              </p>
              <p className="text-zinc-300">
                {" "}
                requests: <span className="text-emerald-400">2.4M</span>
              </p>
              <p className="text-zinc-500 pt-2">
                ${" "}
                <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-vyu-pulse align-middle" />
              </p>
            </div>
          </div>
          <div
            className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-emerald-500/20 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-sky-500/20 blur-3xl"
            aria-hidden
          />
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
        <span className="font-[var(--font-mono)] text-[10px] tracking-widest">
          // SCROLL
        </span>
        <span className="w-px h-8 bg-gradient-to-b from-emerald-400 to-transparent" />
      </div>
    </section>
  );
}
