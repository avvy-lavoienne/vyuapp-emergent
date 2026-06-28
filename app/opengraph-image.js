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
          background: '#FAFAF8',
          color: '#141413',
          position: 'relative',
          fontFamily: 'sans-serif',
          padding: '72px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(193,95,60,0.20), rgba(193,95,60,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -180,
            left: -120,
            width: 440,
            height: 440,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(193,95,60,0.10), rgba(193,95,60,0) 70%)',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: '#6D5BA0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: '#FFFFFF', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, letterSpacing: -0.5, color: '#141413' }}>
            <span>Vyu</span>
            <span style={{ color: '#6D5BA0' }}>App</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 80,
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            color: '#141413',
            maxWidth: 1000,
          }}
        >
          Bespoke Web Engineering{'\n'}& Market Intelligence
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 24,
            color: '#4A4A48',
            lineHeight: 1.4,
            maxWidth: 800,
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
            fontSize: 16,
            color: '#B0AFAA',
          }}
        >
          <div style={{ display: 'flex' }}>vyuapp.my.id</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: '#6D5BA0',
                marginRight: 10,
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
