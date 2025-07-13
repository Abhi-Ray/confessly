export const generateStructuredData = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://confessly.in';
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Confessly",
        "description": "Anonymous platform for honest confessions. No names, no filters. Just truth.",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Confessly",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 300,
          "height": 300
        },
        "sameAs": [
          "https://twitter.com/ConfesslyApp"
        ]
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        "name": "Confessly",
        "description": "Anonymous confession platform",
        "url": baseUrl,
        "applicationCategory": "SocialNetworkingApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Organization",
          "name": "Confessly Team"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": baseUrl
          }
        ]
      }
    ]
  };
}; 