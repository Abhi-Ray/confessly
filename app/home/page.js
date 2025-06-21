import React from 'react'
import Home from '@/components/home/page'
export const metadata = {
  title: 'Confessly — Anonymous Confessions & Secrets Platform',
  description: 'Share your deepest confessions anonymously on Confessly. A safe space for honest thoughts, secrets, and confessions. No judgment, just real stories.',
  keywords: 'anonymous confessions, secrets sharing, emotional support, mental health, anonymous platform, safe space, honest confessions, no judgment',
  alternates: {
    canonical: 'https://confessly.mooo.com/home',
  },
  openGraph: {
    type: 'website',
    url: 'https://confessly.mooo.com/home',
    title: 'Confessly — Anonymous Confessions & Secrets Platform',
    description: 'Share your deepest confessions anonymously on Confessly. A safe space for honest thoughts, secrets, and confessions. No judgment, just real stories.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Confessly - Anonymous Confessions Platform',
      }
    ],
    siteName: 'Confessly',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confessly — Anonymous Confessions & Secrets Platform',
    description: 'Share your deepest confessions anonymously on Confessly. A safe space for honest thoughts, secrets, and confessions. No judgment, just real stories.',
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
  }
}

const HomePage = () => {
  return (
    <>
    <Home/>
    </>
  )
}

export default HomePage
