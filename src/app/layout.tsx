import type { Metadata } from "next";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://doctor-tracker-public.dusky-koala-6177.chatgpt.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Doctor Tracker — Healthcare, clearly connected", template: "%s | Doctor Tracker" },
  description: "A calmer, clearer way for healthcare teams to understand patients and coordinate care.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", title: "Doctor Tracker", description: "Healthcare, clearly connected.", siteName: "Doctor Tracker", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Doctor Tracker — Healthcare, clearly connected" }] },
  twitter: { card: "summary_large_image", title: "Doctor Tracker", description: "Healthcare, clearly connected.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const portalUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL || "/dashboard";
  const organizationSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Doctor Tracker", applicationCategory: "HealthApplication", description: "A clear, connected workspace for healthcare teams.", url: siteUrl };
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <AppFrame portalUrl={portalUrl}>{children}</AppFrame>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
