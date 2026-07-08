import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/data';

export const runtime = 'nodejs';
export const alt = 'VyuApp Insights';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }) {
  const article = await getArticleBySlug(params.slug);
  const title = article?.title || 'VyuApp Insights';
  const category = article?.category || 'Insights';
  const excerpt = (article?.excerpt || '').slice(0, 180);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#f5f5f7',
          color: '#1d1d1f',
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
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(109,91,160,0.15), rgba(109,91,160,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -160,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(109,91,160,0.08), rgba(109,91,160,0) 70%)',
            display: 'flex',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: '#2997ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: '#FFFFFF', display: 'flex' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, letterSpacing: -0.5, color: '#1d1d1f' }}>
            <span>Vyu</span>
            <span style={{ color: '#2997ff' }}>App</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 52,
            fontSize: 18,
            color: '#2997ff',
            textTransform: 'uppercase',
            letterSpacing: 4,
            fontFamily: 'monospace',
          }}
        >
          {category}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 20,
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            color: '#1d1d1f',
            maxWidth: 1056,
          }}
        >
          {title.length > 110 ? title.slice(0, 107) + '\u2026' : title}
        </div>

        {excerpt && (
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 24,
              color: '#4A4A48',
              lineHeight: 1.4,
              maxWidth: 980,
            }}
          >
            {excerpt}{excerpt.length >= 180 ? '\u2026' : ''}
          </div>
        )}

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
          <div style={{ display: 'flex' }}>vyuapp.my.id/insights</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: '#2997ff',
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
