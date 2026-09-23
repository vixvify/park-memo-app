import type { Metadata } from "next";
import "@fontsource/prompt/thai-400.css";
import "@fontsource/prompt/thai-500.css";
import "@fontsource/prompt/thai-600.css";
import "@fontsource/prompt/thai-700.css";
import "@fontsource/prompt/latin-400.css";
import "@fontsource/prompt/latin-500.css";
import "@fontsource/prompt/latin-600.css";
import "@fontsource/prompt/latin-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindMyCar — จำจุดจอดรถ",
  description: "บันทึกจุดจอดและนำทางกลับไปหารถของคุณ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
