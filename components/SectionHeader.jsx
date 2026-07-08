export default function SectionHeader({ overline, title, description, align = 'left', highlight }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';

  const renderTitle = () => {
    if (!highlight) return title;
    const parts = title.split(highlight);
    if (parts.length < 2) return title;
    return parts.map((part, i) =>
      i < parts.length - 1 ? (
        <span key={i}>
          {part}
          <span className="relative text-[#2997ff]">
            {highlight}
            <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2997ff]/60 to-[#2997ff]/10 rounded-full" />
          </span>
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {overline && (
        <p className="font-mono text-xs text-[#6e6e73] dark:text-[#8A8A8A] uppercase tracking-[0.15em] font-medium">
          {overline}
        </p>
      )}
      <h2 className={`mt-4 text-3xl md:text-4xl lg:text-5xl font-sans font-semibold leading-tight tracking-[-0.025em] text-[#1d1d1f] dark:text-[#f5f5f7]`}>
        {renderTitle()}
      </h2>
      {description && (
        <p className={`mt-5 text-[#4A4A48] dark:text-[#86868b] text-base md:text-lg leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
