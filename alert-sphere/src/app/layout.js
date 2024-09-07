import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";


const poppins = Poppins({
  weight:["400","500","600","700","800"],
  subsets: ["latin"]
})

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Alert Sphere",
  description: "App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
