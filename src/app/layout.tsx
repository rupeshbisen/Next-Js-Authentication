import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import GlobalState from '@/context'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Notification from '@/components/Notification'

const lora = Lora({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'User Authentication App',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lora.className}>
        <GlobalState>
          <div className='min-h-screen'>
            <Navbar />
            <main className='flex flex-col mt-[76px] md:mt-[92px]'>{children}</main>
            <Notification />
          </div>
        </GlobalState>
      </body>
    </html>
  )
}
