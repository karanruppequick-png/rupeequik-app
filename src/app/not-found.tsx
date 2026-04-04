import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md w-full bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
           <h1 className="text-8xl font-black text-[#1C295E] mb-4">404</h1>
           <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
           <p className="text-slate-500 mb-8">
              Oops! The page you are looking for doesn't exist or has been moved.
           </p>
           <Link 
             href="/" 
             className="w-full inline-block bg-[#4A69FF] hover:bg-[#3B55D9] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
           >
             Return Home
           </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
