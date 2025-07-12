import React from 'react'
import Post from '@/components/post/page'
import Navigation from '@/components/common/nav'
import Script from 'next/script'

export const metadata = {
  title: 'Share Your Confession — Confessly Anonymous Confessions Platform',
  description: 'Share your anonymous confession on Confessly. A safe and secure platform to express your thoughts, secrets, and confessions without revealing your identity. Join our supportive community today.',
  keywords: 'share confession, anonymous confession, post confession, secret sharing, emotional support, mental health, anonymous platform, safe space, honest confessions, no judgment',
  alternates: {
    canonical: 'https://confessly.in/post',
  },
  openGraph: {
    type: 'website',
    url: 'https://confessly.in/post',
    title: 'Share Your Confession — Confessly Anonymous Confessions Platform',
    description: 'Share your anonymous confession on Confessly. A safe and secure platform to express your thoughts, secrets, and confessions without revealing your identity. Join our supportive community today.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Confessly - Share Your Anonymous Confession',
      }
    ],
    siteName: 'Confessly',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Share Your Confession — Confessly Anonymous Confessions Platform',
    description: 'Share your anonymous confession on Confessly. A safe and secure platform to express your thoughts, secrets, and confessions without revealing your identity. Join our supportive community today.',
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

const PostPage = () => {
  return (
    <>
      <Script
        id="post-page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Share Your Confession — Confessly Anonymous Confessions Platform",
            "description": "Share your anonymous confession on Confessly. A safe and secure platform to express your thoughts, secrets, and confessions without revealing your identity.",
            "url": "https://confessly.in/post",
            "publisher": {
              "@type": "Organization",
              "name": "Confessly",
              "logo": {
                "@type": "ImageObject",
                "url": "https://confessly.in/logo.png"
              }
            },
            "mainEntity": {
              "@type": "WebApplication",
              "name": "Confessly Confession Form",
              "description": "Anonymous confession submission form",
              "applicationCategory": "SocialApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          })
        }}
      />
      <Post/>
      <Navigation/>
    </>
  )
}

export default PostPage
