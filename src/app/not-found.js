// app/not-found.js
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function NotFound() {
  return (
    <main className='min-h-screen bg-mainlight flex flex-col '>
    <Navbar />
    <div className="flex flex-col items-center justify-center  h-[87vh]">
      <h1 className="text-4xl md:text-6xl font-bold text-[#0b2059]">404 - Page Not Found</h1>
      <p className="text-lg text-[#0b2059]/90 mt-4">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className=' border-2 mt-10 border-green-600 hover:bg-green-600 hover:text-white transition-all px-5 py-4 rounded-full font-bold text-[1.1rem]'>Go back to Home
      </Link>
    </div>
    </main>
  );
}
