import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'VyuApp — Bespoke Web Engineering & Market Intelligence';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#09090b',
          color: '#fafafa',
          position: 'relative',
          fontFamily: 'sans-serif',
          padding: '72px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: -160,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(52,211,153,0.45), rgba(52,211,153,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -160,
            width: 540,
            height: 540,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(56,189,248,0.30), rgba(56,189,248,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 180,
            right: 60,
            width: 320,
            height: 320,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(45,212,191,0.25), rgba(45,212,191,0) 70%)',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: 'rgba(52,211,153,0.12)',
              border: '1px solid rgba(52,211,153,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: '#34d399', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 800, letterSpacing: -0.5, color: '#fafafa' }}>
            <span>Vyu</span>
            <span style={{ color: '#34d399' }}>App</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 80,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            color: '#fafafa',
            maxWidth: 1056,
          }}
        >
          Bespoke Web Engineering{'\n'}& Market Intelligence
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontSize: 26,
            color: '#a1a1aa',
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Studio rekayasa web premium dari Garut — membangun produk digital presisi tinggi.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 64,
            left: 72,
            right: 72,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: 18,
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex' }}>vyuapp.com</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 9999,
                background: '#34d399',
                marginRight: 12,
                display: 'flex',
              }}
            />
            <span>BESPOKE WEB ENGINEERING</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
