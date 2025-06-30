import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fajar Ramadhandi Hidayat - Portfolio",
  description: "Front-End Developer | Web Building Enthusiast | Data Analytics Explorer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark-mode`}>{children}</body>
    </html>
  )
}
