import "./globals.css";
import { Suspense } from "react";
import ClientWrapper from "./custom/components/ClientWrapper";
import { LoaderOne } from "@/components/ui/loader";

export const metadata = {
  title: "Todo App",
  description: "Next Peak Software Engineering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Wrap everything in Suspense to handle useSearchParams bailouts */}
        <Suspense fallback={<LoaderOne />}>
          <ClientWrapper>{children}</ClientWrapper>
        </Suspense>
      </body>
    </html>
  );
}