import "./globals.css";
import Header from "./comp/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex items-start">
          <div className="w-full md:pl-52 lg:pl-64 flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}