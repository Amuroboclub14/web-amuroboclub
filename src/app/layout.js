import { Inter, Raleway, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";


const inter = Inter({ 
  subsets: ["latin"] ,
  variable: '--font-inter',
  display: 'swap',
});

const mont = Montserrat({ 
  subsets: ["latin"] ,
  variable: '--font-mont',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-roboto',
  display: 'swap',

});

const raleway = Raleway({ subsets: ["latin"] });

export const metadata = {
  title: "AMURoboclub",
  description: "Robotics club of Aligarh Muslim University",
};

export default function RootLayout({ children }) {
  return (
    <html  className={` ${inter.variable} ${raleway.varaible} ${roboto.variable} ${mont.variable} `} lang="en">
      <body>
        <div className={` h-screen w-full`}>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}