import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "List",
  description: "A list of things",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div 
          style={{ 
            width: "100%", 
            position: "relative",
            height: "20vh", 
            backgroundImage: "url('/img/bg-h.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "repeat"
        }}
        />
        <div className="absolute container">
          {children}
        </div>
      </body>
    </html>
  );
}
