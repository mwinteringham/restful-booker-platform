import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Restful-booker-platform demo',
  description: 'A platform for testing restful web services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" id="root">
      <head>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
        
        <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css" rel="stylesheet" />
        
        {/* Bootstrap CSS */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7" crossOrigin="anonymous" />
        
        {/* Font Awesome */}
        <link 
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Script src="/dom-action-logger.js" strategy="beforeInteractive" />
        <div id="root-container">
        {children}
        </div>
        
        {/* Popper.js */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" 
          integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" 
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Bootstrap JS */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq" 
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

      </body>
    </html>
  )
}
