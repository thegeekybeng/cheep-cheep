import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SG Cheep - Best Travel Deals in Singapore',
  description: 'Compare hotel prices across Booking.com, Agoda, Trip.com & Google Travel. Always cheaper than Priceline, guaranteed!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  )
}
