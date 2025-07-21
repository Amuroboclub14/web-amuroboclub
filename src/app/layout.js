import "./globals.css";
import Script from "next/script";
import { GoogleAnalytics } from "./components/GoogleAnalytics"; // path as per your structure

export const metadata = {
  title: "AMURoboclub",
  description: "Robotics club of Aligarh Muslim University",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={` h-screen w-full`}>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_G_ANALYTICS_ID}`}
          />
          <Script strategy="lazyOnload" id="gtag-init">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_G_ANALYTICS_ID}', {
              page_path: window.location.pathname,
            });
          `}
          </Script>
          <GoogleAnalytics />
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
