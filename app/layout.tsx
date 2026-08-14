import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Poro Bot — League of Legends Patch Notes for Discord',
  description:
    'A self-hosted Discord bot that turns League of Legends patch notes into structured summaries, and looks up champion counters on demand.',
  // Icons come from app/icon.png and app/apple-icon.png via Next's file
  // convention, so the /poroweb basePath is applied for us. Declaring them
  // here instead would emit root-relative URLs that 404 on GitHub Pages.
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
