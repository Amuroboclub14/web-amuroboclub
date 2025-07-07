import "./globals.css";

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
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}
