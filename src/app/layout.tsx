import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SiteFooter } from "@/components/SiteFooter"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Fast-menu",
  description: "Ementa da semana da cantina escolar",
  icons: {
    icon: "/images/logos/fast-menu_logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans antialiased`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
