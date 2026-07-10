import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Inter, Syne } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const syne = Syne({ subsets: ['latin'], variable: '--font-display', weight: ['700', '800'] })

const siteUrl = 'https://agora-mentor-extension-website.vercel.app'

export const metadata: Metadata = {
  title: 'Agora Mentor — Voice AI Code Review for VS Code',
  description: 'Talk to your code. Select any snippet in VS Code, pick a focus — explain, debug, refactor — then speak. Agora Mentor connects you to an AI voice agent in seconds.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Agora Mentor — Voice AI Code Review for VS Code',
    description: 'Talk to your code. Select any snippet in VS Code, pick a focus — explain, debug, refactor — then speak. AI voice + text mentor in your editor.',
    url: siteUrl,
    siteName: 'Agora Mentor',
    type: 'website',
    images: [{ url: '/agora-logo-rgb-blue.svg', width: 1000, height: 343, alt: 'Agora Mentor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agora Mentor — Voice AI Code Review for VS Code',
    description: 'Select code in VS Code, speak your question, get an AI voice answer. Built on Agora RTC.',
    images: ['/agora-logo-rgb-blue.svg'],
  },
  icons: {
    icon: [{ url: '/agora-logo-mark.svg', type: 'image/svg+xml' }],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#050505' }],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}>
      <body className="antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
