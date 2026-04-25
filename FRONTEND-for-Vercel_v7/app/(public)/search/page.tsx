'use client';
export const dynamic = 'force-dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import WhatsAppButton from '../../../components/common/WhatsAppButton';
import GlobalSearch from '../../../components/search/GlobalSearch';
import Link from 'next/link';
import { BookOpen, Layers, ShoppingBag, Search } from 'lucide-react';
import { searchAPI } from '../../../lib/api';
import { motion } from 'framer-motion';

function SearchResults() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    searchAPI.search(q, 20).then((r: any) => setResults(r?.data?.data)).finally(() => setLoading(false));
  }, [q]);

  const total = results ? (results.blogs?.length||0) + (results.services?.length||0) + (results.products?.length||0) : 0;

  return (
    <main className="min-h-screen" style={{ background: '#FFFDF7' }}>
      <section className="bg-dark-gradient py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-white font-display text-2xl font-bold mb-4 text-center">
            {q ? `Results for "${q}"` : 'Search Vastu Arya'}
          </h1>
          <GlobalSearch variant="hero" placeholder="Search services, blogs, products…" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-10">
        {loading && <div className="grid gap-4">{[...Array(6)].map((_,i)=><div key={i} className="h-16 skeleton rounded-xl"/>)}</div>}

        {!loading && q && results && total === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto text-gray-200 mb-4"/>
            <h2 className="text-xl font-bold text-gray-500 mb-2">No results for "{q}"</h2>
            <p className="text-gray-400 text-sm mb-6">Try different keywords</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['vastu','numerology','gemstone','rudraksha','yantra'].map(t=>(
                <Link key={t} href={`/search?q=${t}`} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-all capitalize">{t}</Link>
              ))}
            </div>
          </div>
        )}

        {!loading && results && total > 0 && (
          <div className="space-y-8">
            {results.services?.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4"><Layers size={18} className="text-primary"/>Services</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.services.map((s: any, i: number)=>(
                    <motion.div key={s._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                      <Link href={`/services/${s.slug}`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-orange-100 hover:border-primary/30 hover:shadow-md transition-all">
                        <span className="text-2xl">{s.icon}</span>
                        <div><p className="font-semibold text-gray-800 text-sm truncate">{s.title?.en}</p><p className="text-primary text-xs font-bold">₹{s.offerPrice}</p></div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {results.blogs?.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4"><BookOpen size={18} className="text-primary"/>Blog Articles</h2>
                <div className="grid gap-3">
                  {results.blogs.map((b: any, i: number)=>(
                    <motion.div key={b._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                      <Link href={`/blog/${b.slug}`} className="flex gap-4 p-4 bg-white rounded-2xl border border-orange-100 hover:border-primary/30 hover:shadow-md transition-all">
                        {b.coverImage && <img src={b.coverImage} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0"/>}
                        <div><p className="font-semibold text-gray-800 text-sm mb-1">{b.title?.en}</p><p className="text-xs text-gray-400 capitalize">{b.category}</p></div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {results.products?.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4"><ShoppingBag size={18} className="text-primary"/>Products</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {results.products.map((p: any, i: number)=>(
                    <motion.div key={p._id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                      <Link href={`/vastu-store/product/${p.slug}`} className="block bg-white rounded-2xl border border-orange-100 hover:shadow-md transition-all overflow-hidden">
                        <div className="aspect-square bg-orange-50">{p.images?.[0]?<img src={p.images[0]} alt="" className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-3xl">🕉️</div>}</div>
                        <div className="p-3"><p className="text-xs font-medium text-gray-800 line-clamp-2">{p.name?.en}</p><p className="text-primary font-bold text-sm mt-1">₹{p.offerPrice}</p></div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (<><Navbar /><Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-4xl animate-spin">🕉️</div></div>}><SearchResults /></Suspense><Footer /><WhatsAppButton /></>);
}
