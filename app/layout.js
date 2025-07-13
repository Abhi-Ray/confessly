import { Inter } from 'next/font/google';
import "./globals.css";
import Script from 'next/script';
import { generateStructuredData } from './structured-data';

// Initialize Inter font with latin subset
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0d0d0d',
};

// Get the base URL for the current environment
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://confessly.in';
};

export const metadata = {
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Confessly',
  },
  formatDetection: {
    telephone: false,
  },
  title: 'Confessly — Say What You Never Could',
  description: 'Confessly is an anonymous space to share confessions, thoughts, and secrets. No judgment, just real stories. Be heard, be honest, be free.',
  keywords: 'confession app, anonymous confessions, emotional support, secrets, Gen Z social platform, say anything, no filter, Indian social app, mental health, anonymous sharing, safe space, online community',
  authors: [{ name: 'Confessly Team' }],
  creator: 'Confessly Team',
  publisher: 'Confessly',
  category: 'Social Platform',
  classification: 'Social Media',
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    url: getBaseUrl(),
    title: 'Confessly — Say What You Never Could',
    description: 'An anonymous platform to express your deepest confessions. Say anything. No filters. No names. Just truth.',
    images: [
      { 
        url: '/seo-logo.png',
        width: 1200,
        height: 630,
        alt: 'Confessly Logo'
      }
    ],
    siteName: 'Confessly',
    locale: 'en_US',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Confessly — Say What You Never Could',
    description: 'Anonymous platform for honest confessions. No names, no filters. Just truth.',
    images: ['/seo-logo.png'],
    site: '@ConfesslyApp',
    creator: '@ConfesslyApp',
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon-32x32.png',
  },
  manifest: '/manifest.json',
  
  // Additional SEO
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
    google: 'eyI2V1gljarCONI9FXuCjBOddqymMA3bSZ9Ymbsyg1I',
    yandex: 'your-yandex-verification-code', // Get from Yandex Webmaster
    yahoo: 'your-yahoo-verification-code', // Get from Bing Webmaster Tools
  },
  other: {
    'msapplication-TileColor': '#0d0d0d',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NV6PXLJC');
          `}
        </Script>
        
        {/* Essential meta tags */}
        <meta charSet="UTF-8" />
        <meta name="language" content="English" />
        <link rel="canonical" href={getBaseUrl()} />
        
        {/* Favicon links for better mobile support */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData()),
          }}
        />
        
        {/* Additional SEO links */}
        <link rel="search" type="application/opensearchdescription+xml" title="Confessly" href="/opensearch.xml" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
        <link rel="author" href="/humans.txt" />
        
        {/* PWA Mobile App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Confessly" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Enhanced for various browsers */}
        <meta name="msapplication-TileColor" content="#0d0d0d" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="application-name" content="Confessly" />
        
        {/* Prevent zoom and enhance mobile experience */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className="overscroll-none touch-manipulation">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-NV6PXLJC"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <div id="app-container" className="min-h-screen">
          {children}
        </div>
        
        {/* Service Worker Registration */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('ServiceWorker registration successful');
                    })
                    .catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
              
              // Add install prompt handling
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                // Show your custom install button here
                // showInstallButton();
              });
              
              // Handle app installation
              window.addEventListener('appinstalled', (evt) => {
                console.log('App was installed successfully');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}