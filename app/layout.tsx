import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Olharr Studio — Moodboard & Storyboard com IA",
  description: "Crie moodboards e storyboards cinematográficos para seus eventos com inteligência artificial.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
