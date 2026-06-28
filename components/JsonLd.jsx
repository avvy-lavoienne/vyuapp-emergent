const baseUrl = () => process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export function OrganizationJsonLd() {
  const url = baseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'VyuApp',
    url,
    logo: `${url}/favicon/android-chrome-512x512.png`,
    description: 'Studio rekayasa web bespoke dari Garut, Jawa Barat. Membangun produk digital presisi tinggi.',
    foundingDate: '2024',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Garut',
      addressRegion: 'Jawa Barat',
      addressCountry: 'ID',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'vyuapp@proton.me',
      contactType: 'sales',
      availableLanguage: ['Indonesian', 'English'],
    },
    sameAs: [
      'https://github.com/avvy-lavoienne',
      'https://www.linkedin.com/in/frmnfird',
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebSiteJsonLd() {
  const url = baseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: 'VyuApp',
    url,
    publisher: { '@id': `${url}/#organization` },
    description: 'Studio rekayasa web bespoke & market intelligence.',
    inLanguage: 'id',
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function BreadcrumbJsonLd({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ArticleJsonLd({ title, description, url, image, datePublished, dateModified, authorName }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    ...(image ? {
      image: {
        '@type': 'ImageObject',
        url: image,
        width: 1200,
        height: 630,
      },
    } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    author: {
      '@type': 'Person',
      name: authorName || 'VyuApp Studio',
    },
    publisher: { '@id': `${baseUrl()}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function SoftwareAppJsonLd({ name, description, url, applicationCategory, operatingSystem, offers }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: applicationCategory || 'BusinessApplication',
    operatingSystem: operatingSystem || 'Web',
    offers: offers ? {
      '@type': 'Offer',
      ...offers,
    } : undefined,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function LocalBusinessJsonLd() {
  const url = baseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VyuApp Studio',
    url,
    description: 'Studio rekayasa web premium dari Garut, Jawa Barat.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Ratu Intan Dewata, Perumahan Griya Mutiara Rancabango Blok. C40',
      addressLocality: 'Garut',
      addressRegion: 'Jawa Barat',
      addressCountry: 'ID'
    },
    geo: { '@type': 'GeoCoordinates', latitude: -7.22, longitude: 107.90 },
    sameAs: ['https://github.com/avvy-lavoienne', 'https://www.linkedin.com/in/frmnfird']
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
