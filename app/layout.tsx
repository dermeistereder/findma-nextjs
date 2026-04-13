import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'findma. — Find ma. Aus Österreich.',
    template: '%s — findma.at',
  },
  description: 'Das österreichische Unternehmensverzeichnis mit Herkunftskennzeichnung. Kuratiert. Transparent. Österreichisch.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://findma.at'),
  openGraph: {
    siteName: 'findma.',
    locale: 'de_AT',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'findma.',
  url: 'https://findma.at',
  description: 'Das österreichische Unternehmensverzeichnis mit Herkunftskennzeichnung.',
  inLanguage: 'de-AT',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://findma.at/verzeichnis?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen flex flex-col bg-[#F7F7F5]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
