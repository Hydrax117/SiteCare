import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SiteCare — Website Monitoring for Agencies',
    template: '%s | SiteCare',
  },
  description:
    'Monitor your client websites from one place. Track uptime, SSL certificates, and get instant alerts.',
  metadataBase: new URL(process.env['NEXTAUTH_URL'] ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
