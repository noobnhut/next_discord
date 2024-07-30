import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
const font = Open_Sans({ subsets: ["latin"] });
import { viVN } from "@clerk/localizations";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "404Connect",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={viVN}>
      <html lang="en">
        <body
          className={cn(font.className, "bg-white dark:bg-[#313338]")}
          suppressHydrationWarning={true}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
