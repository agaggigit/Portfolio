import type { Metadata } from "next";
import { syne, inter } from "./fonts";
import "./globals.css";


export const metadata: Metadata = {
  title: "Aga's portfolio",
  description: "Personal portfolio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
