import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PASA V60 Brewing Game",
  description:
    "Practice your V60 technique and message PASA Coffee on WhatsApp for barista training, gadgets, and machine rental.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "PASA V60 Brewing Game",
    description:
      "Practice your V60 technique and message PASA Coffee on WhatsApp for barista training, gadgets, and machine rental.",
    url: "https://your-domain.com",
    siteName: "PASA Coffee",
    images: [
      { url: "/logo.png", width: 1200, height: 630, alt: "PASA Coffee" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PASA V60 Brewing Game",
    description:
      "Practice your V60 technique and message PASA Coffee on WhatsApp for barista training, gadgets, and machine rental.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased fancy-bg"
        suppressHydrationWarning
      >
        {/* Top banner */}
        <header className="w-full border-b border-white/5 bg-[var(--panel)]/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-lg bg-[var(--panel-2)] ring-1 ring-white/10 lift">
              <div
                className="absolute inset-0 steam pointer-events-none"
                aria-hidden
              />
              <img
                src="/logo.png"
                alt="PASA Coffee"
                className="relative z-10 h-full w-full object-cover mix-blend-screen"
              />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-semibold tracking-wide">
                PASA Coffee
              </div>
              <div className="text-xs text-[var(--muted)]">
                V60 Brewing Game
              </div>
            </div>
            <div className="ms-auto hidden items-center gap-2 sm:flex">
              <span className="badge">Coffee • Training • Gadgets</span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 pb-28 pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
