const baseUrl = () => process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export function OrganizationJsonLd() {
  const url = baseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
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
      url,
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function WebSiteJsonLd() {
  const url = baseUrl();
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VyuApp',
    url,
    description: 'Studio rekayasa web bespoke & market intelligence.',
    inLanguage: 'id',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/insights?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
    ...(image ? { image } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    author: {
      '@type': 'Person',
      name: authorName || 'VyuApp Studio',
    },
    publisher: {
      '@type': 'Organization',
      name: 'VyuApp',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl()}/favicon/android-chrome-512x512.png`,
      },
    },
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
