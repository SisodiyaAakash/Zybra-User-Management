"use client";

import "./globals.css";
import Header from "./comp/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function RootLayout({ children }) {
  // Create a QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex items-start">
            <div className="w-full flex flex-col min-h-screen">
              <Header />
              {children}
            </div>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
