'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock, ArrowRight, BookOpen, Layers, ShoppingBag, Hash } from 'lucide-react';
import { searchAPI } from '../../lib/api';
import Link from 'next/link';

interface SearchResult {
  blogs: any[];
  services: any[];
  products: any[];
  posts: any[];
}

interface Props {
  placeholder?: string;
  variant?: 'hero' | 'navbar' | 'mobile';
  autoFocus?: boolean;
  onClose?: () => void;
}

const SESSION_KEY = 'va_search_session';
const RECENT_KEY = 'va_recent_searches';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}

function getRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}

function saveRecent(query: string) {
  const arr = [query, ...getRecent().filter(q => q !== query)].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(arr));
}

export default function GlobalSearch({ placeholder = 'Search Vastu tips, services, products…', variant = 'navbar', autoFocus = false, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [trending, setTrending] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load trending on mount
  useEffect(() => {
    searchAPI.trending().then((r: any) => setTrending((r?.data?.data || []).map((t: any) => t.query))).catch(() => {});
    setRecent(getRecent());
    if (autoFocus) { setTimeout(() => inputRef.current?.focus(), 100); }
  }, [autoFocus]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  const doSearch = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim() || q.length < 2) { setResults(null); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await searchAPI.search(q, { headers: { 'x-session-id': getSessionId() } });
        setResults(r?.data?.data || null);
      } catch { setResults(null); }
      finally { setLoading(false); }
    }, 280);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    doSearch(val);
    if (!open) setOpen(true);
  };

  const handleFocus = () => { setOpen(true); setRecent(getRecent()); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allResults = flatResults();
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allResults.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && allResults[activeIdx]) navigateTo(allResults[activeIdx]);
      else if (query.trim()) doFullSearch();
    }
    else if (e.key === 'Escape') { setOpen(false); onClose?.(); }
  };

  const flatResults = (): any[] => {
    if (!results) return [];
    return [
      ...results.services.map(s => ({ ...s, _type: 'service', url: `/services/${s.slug}` })),
      ...results.blogs.map(b => ({ ...b, _type: 'blog', url: `/blog/${b.slug}` })),
      ...results.products.map(p => ({ ...p, _type: 'product', url: `/vastu-store/product/${p.slug}` })),
    ];
  };

  const navigateTo = (item: any) => {
    if (query.trim()) saveRecent(query.trim());
    searchAPI.logClick(query, item.slug, item._type).catch(() => {});
    setOpen(false);
    router.push(item.url);
    onClose?.();
  };

  const doFullSearch = () => {
    if (!query.trim()) return;
    saveRecent(query.trim());
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
  };

  const useSuggestion = (q: string) => { setQuery(q); doSearch(q); inputRef.current?.focus(); };

  const hasResults = results && (results.services.length + results.blogs.length + results.products.length + results.posts.length > 0);
  const showDropdown = open && (query.length >= 2 || !query);

  const inputSizeClass = variant === 'hero' ? 'text-base py-4 pl-12 pr-4' : 'text-sm py-2.5 pl-10 pr-4';
  const iconSize = variant === 'hero' ? 20 : 16;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={iconSize}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${inputSizeClass} bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400`}
          style={{ boxShadow: variant === 'hero' ? '0 4px 24px rgba(0,0,0,0.08)' : undefined }}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults(null); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5">
            <X size={14} />
          </button>
        )}
        {loading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[200] overflow-hidden max-h-[480px] overflow-y-auto">

          {/* No query — show trending + recent */}
          {!query && (
            <div className="p-4">
              {recent.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Clock size={11} />Recent</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map(r => (
                      <button key={r} onClick={() => useSuggestion(r)}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-primary hover:text-white rounded-full transition-all text-gray-600">
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {trending.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><TrendingUp size={11} />Trending</p>
                  <div className="flex flex-wrap gap-2">
                    {trending.map(t => (
                      <button key={t} onClick={() => useSuggestion(t)}
                        className="text-xs px-3 py-1.5 bg-orange-50 hover:bg-primary hover:text-white text-primary rounded-full transition-all border border-primary/20">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {recent.length === 0 && trending.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Type to search services, blogs, products…</p>
              )}
            </div>
          )}

          {/* Has query — show results */}
          {query.length >= 2 && (
            <>
              {!hasResults && !loading && (
                <div className="p-6 text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-gray-500 text-sm">No results for <strong>"{query}"</strong></p>
                  <p className="text-gray-400 text-xs mt-1">Try different keywords</p>
                </div>
              )}

              {/* Services */}
              {results?.services && results.services.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                    <Layers size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Services</span>
                  </div>
                  {results.services.map((s, i) => (
                    <button key={s._id} onClick={() => navigateTo({ ...s, _type: 'service', url: `/services/${s.slug}` })}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left ${activeIdx === i ? 'bg-orange-50' : ''}`}>
                      <span className="text-xl flex-shrink-0">{s.icon || '🕉️'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{s.title?.en}</p>
                        <p className="text-xs text-gray-400 capitalize">{s.category}</p>
                      </div>
                      <span className="text-xs font-bold text-primary flex-shrink-0">₹{s.offerPrice}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Blogs */}
              {results?.blogs && results.blogs.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Blog Articles</span>
                  </div>
                  {results.blogs.map((b, i) => (
                    <button key={b._id} onClick={() => navigateTo({ ...b, _type: 'blog', url: `/blog/${b.slug}` })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-100 flex-shrink-0">
                        {b.coverImage ? <img src={b.coverImage} alt="" className="w-full h-full object-cover" /> : <BookOpen size={14} className="m-auto mt-1.5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{b.title?.en}</p>
                        <p className="text-xs text-gray-400 capitalize">{b.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              {results?.products && results.products.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                    <ShoppingBag size={12} className="text-primary" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Products</span>
                  </div>
                  {results.products.map((p, i) => (
                    <button key={p._id} onClick={() => navigateTo({ ...p, _type: 'product', url: `/vastu-store/product/${p.slug}` })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-50 flex-shrink-0">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <span className="text-lg flex items-center justify-center h-full">🕉️</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name?.en}</p>
                        <p className="text-xs text-gray-400 capitalize">{p.category}</p>
                      </div>
                      <span className="text-xs font-bold text-primary flex-shrink-0">₹{p.offerPrice}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* View all */}
              {hasResults && (
                <button onClick={doFullSearch}
                  className="w-full flex items-center justify-center gap-2 p-3 border-t border-gray-100 text-sm font-medium text-primary hover:bg-orange-50 transition-colors">
                  View all results for "{query}" <ArrowRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
