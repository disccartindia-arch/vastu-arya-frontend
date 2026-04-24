import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0500] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl mb-4">🕉️</div>
        <h1 style={{fontFamily:'Playfair Display,serif'}} className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-300 text-xl mb-8">Page not found</p>
        <Link href="/" className="bg-[#FF6B00] text-white px-8 py-4 rounded-2xl font-bold">Go Home</Link>
      </div>
    </div>
  );
}
