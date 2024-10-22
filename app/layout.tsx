"use client";
import "@uploadthing/react/styles.css";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeToggle/theme-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "quill/dist/quill.core.css";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useRouter();

  useEffect(() => {
    // Check if the user is logged in by verifying if the accessToken exists
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate.push("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.js"></script>

        <link
          href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.snow.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.bubble.css"
          rel="stylesheet"
        />

        <link
          href="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.core.css"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/quill@2/dist/quill.core.js"></script>
      </head>
      <body className={`${inter.className} overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
