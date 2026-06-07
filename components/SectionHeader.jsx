export default function SectionHeader({ overline, title, gradientWord, description, align = 'left' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      <p className="vyu-overline">// {overline}</p>
      <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-zinc-50 leading-tight">
        {title} {gradientWord && <span className="text-gradient-emerald">{gradientWord}</span>}
      </h2>
      {description && <p className="mt-5 text-zinc-400 text-base md:text-lg leading-relaxed">{description}</p>}
    </div>
  );
}
