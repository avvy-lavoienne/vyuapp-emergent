'use client';
import useCountUp from '@/hooks/useCountUp';

/**
 * StatCard — Single stat with count-up animation.
 */
function StatCard({ target, suffix = '', prefix = '', decimals = 0, label, duration = 1200 }) {
  const { ref, displayValue } = useCountUp({ target, duration, decimals });

  return (
    <div
      ref={ref}
      className="text-center p-6 md:p-8 rounded-2xl border border-[#d2d2d7] dark:border-[#333336] bg-white dark:bg-[#1d1d1f] apple-card-hover hover:border-[#D1D0C9] dark:hover:border-[#3A3A3D]"
    >
      <p className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7]">
        {prefix}{displayValue}{suffix}
      </p>
      <p className="mt-3 text-sm text-[#6e6e73] dark:text-[#86868b] font-medium">
        {label}
      </p>
    </div>
  );
}

/**
 * StatsSection — Stats counter animation section with count-up from zero.
 *
 * Each stat uses IntersectionObserver to trigger when scrolled into view,
 * then counts from 0 to target over 1.2s with easeOutQuart easing.
 */
export default function StatsSection({ className = '' }) {
  const stats = [
    { target: 17, label: 'AI Agents Aktif', suffix: '' },
    { target: 100, label: 'Proyek Selesai', suffix: '+' },
    { target: 4, label: 'Tahun Pengalaman', suffix: '+' },
    { target: 99, label: 'Uptime', suffix: '%' },
  ];

  return (
    <section className={`py-24 md:py-32 bg-[#f5f5f7] dark:bg-[#1d1d1f] ${className}`} id="stats">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals || 0}
              duration={1200}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
