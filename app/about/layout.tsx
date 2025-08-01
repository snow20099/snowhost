// app/layout.tsx

export const metadata = {
  title: 'SnowHost',
  description: 'Reliable hosting platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
