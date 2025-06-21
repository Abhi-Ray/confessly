import React from 'react'
import Explore from '@/components/explore/page'
import Navigation from '@/components/common/nav'
import Script from 'next/script'

export const metadata = {
  title: 'Explore Confessions — Confessly Anonymous Confessions Platform',
  description: 'Discover and explore anonymous confessions on Confessly. Browse through real stories, secrets, and confessions shared by our community. A safe space for honest thoughts and emotional support.',
  keywords: 'explore confessions, anonymous confessions, secrets sharing, emotional support, mental health, anonymous platform, safe space, honest confessions, no judgment, browse confessions',
  alternates: {
    canonical: 'https://confessly.mooo.com/explore',
  },
  openGraph: {
    type: 'website',
    url: 'https://confessly.mooo.com/explore',
    title: 'Explore Confessions — Confessly Anonymous Confessions Platform',
    description: 'Discover and explore anonymous confessions on Confessly. Browse through real stories, secrets, and confessions shared by our community. A safe space for honest thoughts and emotional support.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Confessly - Explore Anonymous Confessions',
      }
    ],
    siteName: 'Confessly',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Confessions — Confessly Anonymous Confessions Platform',
    description: 'Discover and explore anonymous confessions on Confessly. Browse through real stories, secrets, and confessions shared by our community. A safe space for honest thoughts and emotional support.',
    images: ['/logo.png'],
    site: '@ConfesslyApp',
    creator: '@ConfesslyApp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    bing: 'your-bing-verification',
  },
  category: 'social',
  classification: 'social platform',
  referrer: 'origin-when-cross-origin',
  other: {
    'msapplication-TileColor': '#0d0d0d',
    'msapplication-config': '/browserconfig.xml',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Confessly',
    'language': 'en',
  }
}

const ExplorePage = () => {
  return (
    <>
      <Script
        id="explore-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Explore Confessions — Confessly Anonymous Confessions Platform",
            "description": "Discover and explore anonymous confessions on Confessly. Browse through real stories, secrets, and confessions shared by our community.",
            "url": "https://confessly.mooo.com/explore",
            "publisher": {
              "@type": "Organization",
              "name": "Confessly",
              "logo": {
                "@type": "ImageObject",
                "url": "https://confessly.mooo.com/logo.png"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": {
                "@type": "ListItem",
                "position": 1,
                "name": "Explore Confessions",
                "description": "Browse through anonymous confessions and stories"
              }
            }
          })
        }}
      />
      <Explore/>
      <Navigation/>
    </>
  )
}

export default ExplorePage
