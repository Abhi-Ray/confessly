import { Inter } from 'next/font/google';
import "./globals.css";
import Script from 'next/script';

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
  keywords: 'confession app, anonymous confessions, emotional support, secrets, Gen Z social platform, say anything, no filter, Indian social app',
  authors: [{ name: 'Confessly Team' }],
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    url: getBaseUrl(),
    title: 'Confessly — Say What You Never Could',
    description: 'An anonymous platform to express your deepest confessions. Say anything. No filters. No names. Just truth.',
    images: [{ url: '/logo.png' }],
    siteName: 'Confessly',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Confessly — Say What You Never Could',
    description: 'Anonymous platform for honest confessions. No names, no filters. Just truth.',
    images: ['/logo.png'],
    site: '@ConfesslyApp',
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  other: {
    'content-language': 'en',
    'content-security-policy': {
      'http-equiv': 'Content-Security-Policy',
      'content': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="language" content="English" />
        <link rel="canonical" href={getBaseUrl()} />
        
        {/* Mobile App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Confessly" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        
        {/* PWA Related */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d0d0d" />
        <meta name="application-name" content="Confessly" />
        <meta name="apple-mobile-web-app-status-bar" content="#0d0d0d" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Full Screen Mode */}
        <meta name="display-mode" content="fullscreen" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
        <meta name="x5-fullscreen" content="true" />
        <meta name="x5-page-mode" content="app" />
      </head>
      <body className="overscroll-none">
        {children}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                      // Force fullscreen mode
                      if (window.matchMedia('(display-mode: browser)').matches) {
                        if (document.documentElement.requestFullscreen) {
                          document.documentElement.requestFullscreen();
                        } else if (document.documentElement.webkitRequestFullscreen) {
                          document.documentElement.webkitRequestFullscreen();
                        } else if (document.documentElement.msRequestFullscreen) {
                          document.documentElement.msRequestFullscreen();
                        }
                      }
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
