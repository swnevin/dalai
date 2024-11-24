import './globals.css'
import { Montserrat, Poppins } from 'next/font/google'
import Image from 'next/image'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Dalai Demo Platform',
  description: 'Administrer og del chatbot-demoer',
  icons: {
    icon: '/logos/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
      </head>
      <body className="bg-white min-h-screen">
        <header className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-6 py-8 flex items-center justify-between">
            <div className="h-16 relative">
              <Image
                src="/logos/logo.png"
                alt="Dalai Logo"
                width={240}
                height={64}
                priority
                className="object-contain"
              />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  )
}
