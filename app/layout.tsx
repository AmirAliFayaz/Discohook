import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Discohook - Discord Webhook Sender",
  description: "Send customized Discord webhook messages with rich embeds and attachments"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <div className="min-h-screen bg-[#0A0A12] text-white relative overflow-hidden">
            {/* Noise texture overlay */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-noise"></div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'