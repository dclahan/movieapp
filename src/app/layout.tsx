import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Movie Club",
  description: "the movie club site",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function TopNav() {
  return (
    <nav className="w-full justify-between h-12 border-b border-gray-300 flex items-center px-4 text-xl">
      <div className="text-lg font-bold">
        <a href="/">Movie Club</a>
      </div>
      <div className="text-lg font-bold">
        <a href="/list/create">Create a List</a>
      </div>
    </nav>
  );
}

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="flex flex-col min-h-screen gap-4 dark">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
