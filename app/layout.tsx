// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Manrope, Geist } from "next/font/google";
import { ApiClientProvider } from "../src/providers/ApiClientProvider";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthStride Clinic",
  description: "HealthStride Clinic Portal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, manrope.variable, "font-sans", geist.variable)}
    >
      <head>
        {/* Material Symbols webfont — required for .material-symbols-outlined icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ApiClientProvider>{children}</ApiClientProvider>
      </body>
    </html>
  );
}
