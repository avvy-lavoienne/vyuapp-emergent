/**
 * AuroraBackground — background gradient lembut ala "aurora" untuk landing page.
 *
 * - Server component: MURNI CSS, zero JavaScript, zero WebGL.
 * - Layer: base gradient + 3 blob warna lembut (blur besar) + 1 band aurora.
 * - Animasi lambat (25–45s) → elegan, minimalis, tidak mengganggu konten.
 * - z-index: -1 + pointer-events: none → selalu di belakang konten,
 *   hanya terlihat di area transparan (hero).
 * - prefers-reduced-motion → animasi dimatikan (tampil statis).
 */
export default function AuroraBackground() {
  return (
    <div aria-hidden="true" className="aurora-bg">
      <div className="aurora-base" />
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="aurora-band" />
      <style>{`
        .aurora-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }

        /* Base gradient — sangat halus, teks tetap terbaca */
        .aurora-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #f5f5f7 0%, #e9f1fb 50%, #f5f5f7 100%);
        }
        .dark .aurora-base {
          background: linear-gradient(180deg, #000000 0%, #0a0f1f 55%, #000000 100%);
        }

        /* Blob — lingkaran gradient besar dengan blur */
        .aurora-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          will-change: transform;
        }

        .aurora-blob-1 {
          width: 60vmax;
          height: 60vmax;
          top: -22vmax;
          left: -18vmax;
          opacity: 0.5;
          background: radial-gradient(circle at 30% 30%, #2997ff 0%, transparent 70%);
          animation: aurora-drift-1 28s ease-in-out infinite alternate;
        }
        .dark .aurora-blob-1 {
          opacity: 0.3;
          background: radial-gradient(circle at 30% 30%, #5ba3ff 0%, transparent 70%);
        }

        .aurora-blob-2 {
          width: 52vmax;
          height: 52vmax;
          top: 8vmax;
          right: -20vmax;
          opacity: 0.4;
          background: radial-gradient(circle at 60% 40%, #5ba3ff 0%, transparent 70%);
          animation: aurora-drift-2 34s ease-in-out infinite alternate;
        }
        .dark .aurora-blob-2 {
          opacity: 0.25;
          background: radial-gradient(circle at 60% 40%, #7db8ff 0%, transparent 70%);
        }

        .aurora-blob-3 {
          width: 55vmax;
          height: 55vmax;
          bottom: -26vmax;
          left: 18vmax;
          opacity: 0.35;
          background: radial-gradient(circle at 50% 50%, #0066cc 0%, transparent 70%);
          animation: aurora-drift-3 40s ease-in-out infinite alternate;
        }
        .dark .aurora-blob-3 {
          opacity: 0.2;
          background: radial-gradient(circle at 50% 50%, #2997ff 0%, transparent 70%);
        }

        /* Band aurora — garis gradient halus yang meluncur perlahan */
        .aurora-band {
          position: absolute;
          inset: -25%;
          opacity: 0.5;
          filter: blur(70px);
          background: repeating-linear-gradient(
            100deg,
            rgba(41, 151, 255, 0) 0%,
            rgba(41, 151, 255, 0.12) 7%,
            rgba(41, 151, 255, 0) 12%,
            rgba(41, 151, 255, 0) 16%,
            rgba(91, 163, 255, 0.10) 22%,
            rgba(41, 151, 255, 0) 28%
          );
          background-size: 300% 100%;
          animation: aurora-slide 48s linear infinite;
        }
        .dark .aurora-band {
          opacity: 0.35;
          background: repeating-linear-gradient(
            100deg,
            rgba(91, 163, 255, 0) 0%,
            rgba(91, 163, 255, 0.14) 7%,
            rgba(91, 163, 255, 0) 12%,
            rgba(91, 163, 255, 0) 16%,
            rgba(125, 184, 255, 0.12) 22%,
            rgba(91, 163, 255, 0) 28%
          );
          background-size: 300% 100%;
        }

        @keyframes aurora-drift-1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(9vmax, 5vmax) scale(1.18); }
        }
        @keyframes aurora-drift-2 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-8vmax, 6vmax) scale(1.12); }
        }
        @keyframes aurora-drift-3 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(7vmax, -6vmax) scale(1.15); }
        }
        @keyframes aurora-slide {
          from { background-position: 0% 50%; }
          to   { background-position: 300% 50%; }
        }

        /* Aksesibilitas: matikan gerakan */
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob,
          .aurora-band {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}