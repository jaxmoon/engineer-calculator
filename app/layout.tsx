import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Engineer Calculator',
  description: 'Advanced calculator for engineers with history, statistics, and unit conversion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
