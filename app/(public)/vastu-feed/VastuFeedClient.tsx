'use client';
import { useEffect, useState, useCallback } from 'react';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import WhatsAppButton from '../../../components/common/WhatsAppButton';
import { postsAPI } from '../../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, ChevronDown,
  Send, X, Hash, MapPin, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Constants ─────────────────────────────────────────────── */
const CATEGORIES = [
  { value: 'All',          label: '📋 All' },
  { value: 'vastu-tip',   label: '💡 Vastu Tips' },
  { value: 'transformation', label: '✨ Transformations' },
  { value: 'visit',       label: '📍 Site Visits' },
  { value: 'remedy',      label: '🌿 Remedies' },
  { value: 'daily-wisdom', label: '🌟 Daily Wisdom' },
];

const SESSION_KEY = 'va_feed_session';
function getSession() {
  if (typeof window === 'undefined') return '';
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) { s = Math.random().toString(36).slice(2); sessionStorage.setItem(SESSION_KEY, s); }
  return s;
}

/* ─── Comment Box ───────────────────────────────────────────── */
function CommentBox({ postId, onAdded }: { postId: string; onAdded: () => void }) {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name.trim() || !text.trim()) { toast.error('Enter your name and comment'); return; }
    setSubmitting(true);
    try {
      await postsAPI.addComment(postId, { name: name.trim(), text: text.trim() });
      setName(''); setText('');
      toast.success('Comment posted!');
      onAdded();
    } catch { toast.error('Failed to post comment'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="p-3 border-t border-gray-100 space-y-2 bg-gray-50">
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="Your name"
        className="w-full text-xs px-3 py-2 border border-orange-200 rounded-xl focus:outline-none focus:border-primary bg-white"
      />
      <div className="flex gap-2">
        <input
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Write a comment…"
          className="flex-1 text-xs px-3 py-2 border border-orange-200 rounded-xl focus:outline-none focus:border-primary bg-white"
        />
        <button
          onClick={submit} disabled={submitting}
          className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

/* ─── Post Card ─────────────────────────────────────────────── */
function PostCard({ post, sessionId }: { post: any; sessionId: string }) {
  const [liked, setLiked]               = useState(false);
  const [likeCount, setLikeCount]       = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [showBox, setShowBox]           = useState(false);
  const [comments, setComments]         = useState<any[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [activeMedia, setActiveMedia]   = useState(0);
  const [expanded, setExpanded]         = useState(false);

  // Persist like state per session
  useEffect(() => {
    const liked_ids: string[] = JSON.parse(localStorage.getItem('va_liked') || '[]');
    setLiked(liked_ids.includes(post._id));
  }, [post._id]);

  const handleLike = async () => {
    try {
      const r = await postsAPI.like(post._id, sessionId);
      setLiked(r.data.liked);
      setLikeCount(r.data.likes);
      const ids: string[] = JSON.parse(localStorage.getItem('va_liked') || '[]');
      localStorage.setItem('va_liked', JSON.stringify(
        r.data.liked ? [...ids, post._id] : ids.filter((id: string) => id !== post._id)
      ));
    } catch { toast.error('Try again'); }
  };

  const loadComments = async () => {
    if (commentsLoaded) return;
    try {
      const r = await postsAPI.getComments(post._id);
      setComments(r.data.data || []);
      setCommentsLoaded(true);
    } catch {}
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) loadComments();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/vastu-feed#${post._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Vastu tip by Dr. PPS Tomar', text: post.caption?.slice(0, 100), url }); } catch {}
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Link copied!')).catch(() => {});
    }
  };

  const caption: string = post.caption || '';
  const isLong = caption.length > 200;
  const displayCaption = isLong && !expanded ? `${caption.slice(0, 200)}…` : caption;

  const typeLabel: Record<string, string> = {
    'vastu-tip': '💡 Tip', transformation: '✨ Transformation',
    remedy: '🌿 Remedy', visit: '📍 Visit', text: '📝 Post',
  };

  return (
    <motion.article
      id={post._id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="bg-white rounded-3xl shadow-sm border border-orange-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Dr. PPS Tomar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{post.author || 'Dr. PPS Tomar'}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            {post.location && (
              <span className="flex items-center gap-0.5">
                <MapPin size={10} />{post.location}
              </span>
            )}
            <span>{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        {post.isFeatured && (
          <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            <Star size={10} fill="currentColor" /> Featured
          </span>
        )}
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          post.type === 'transformation' ? 'bg-green-100 text-green-700'
          : post.type === 'remedy' ? 'bg-purple-100 text-purple-700'
          : 'bg-orange-100 text-orange-700'
        }`}>
          {typeLabel[post.type] || '📸 Post'}
        </span>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="relative bg-orange-50">
          {post.media[activeMedia]?.type === 'video' ? (
            <div className="aspect-video">
              <video
                src={post.media[activeMedia].url}
                controls
                preload="none"
                poster={post.media[activeMedia].thumbnail}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square sm:aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.media[activeMedia]?.url}
                alt={caption}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {/* Media dots */}
          {post.media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.media.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveMedia(i)}
                  className={`w-2 h-2 rounded-full transition-all ${activeMedia === i ? 'bg-white scale-110' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Caption */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-gray-800 text-sm leading-relaxed">
          {displayCaption}
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-primary text-xs ml-1 font-medium">
              {expanded ? 'less' : 'more'}
            </button>
          )}
        </p>
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.hashtags.map((h: string) => (
              <span key={h} className="text-xs text-primary flex items-center gap-0.5">
                <Hash size={9} />{h}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm font-medium transition-all active:scale-110 ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
        <button
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-primary transition-all"
        >
          <MessageCircle size={18} />
          <span>{post.commentCount || 0}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-primary transition-all"
        >
          <Share2 size={18} />
          <span className="hidden sm:inline text-xs">Share</span>
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            {/* Comment list */}
            <div className="px-4 py-3 space-y-3 max-h-56 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-gray-400 text-xs text-center py-2">No comments yet — be the first!</p>
              )}
              {comments.map((c: any) => (
                <div key={c._id} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-gray-700">{c.name} </span>
                    <span className="text-xs text-gray-600">{c.text}</span>
                    {c.replies?.map((r: any) => (
                      <div key={r._id} className="ml-4 mt-1 flex gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {r.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-gray-600">{r.name} </span>
                        <span className="text-xs text-gray-500">{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Toggle comment box */}
            {!showBox ? (
              <button
                onClick={() => setShowBox(true)}
                className="w-full py-2.5 text-xs text-primary font-medium border-t border-gray-100 hover:bg-orange-50 transition-colors"
              >
                + Write a comment
              </button>
            ) : (
              <CommentBox
                postId={post._id}
                onAdded={() => { setCommentsLoaded(false); loadComments(); setShowBox(false); }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function VastuFeedPage() {
  const [posts, setPosts]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory]   = useState('All');
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => { setSessionId(getSession()); }, []);

  const fetchPosts = useCallback(async (cat: string, pg: number, append = false) => {
    if (pg === 1) setLoading(true); else setLoadingMore(true);
    try {
      const params: Record<string, any> = { page: pg, limit: 9 };
      if (cat !== 'All') params.category = cat;
      const r = await postsAPI.getAll(params);
      const data: any[] = r?.data?.data || [];
      setPosts(prev => append ? [...prev, ...data] : data);
      setHasMore(data.length === 9);
    } catch {
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchPosts(category, 1, false);
  }, [category, fetchPosts]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(category, next, true);
  };

  return (
    <>
      <Navbar />
      <main style={{ background: 'linear-gradient(135deg,#FFFDF7 0%,#FFF8EE 100%)', minHeight: '100vh' }}>
        {/* Hero */}
        <section
          className="py-14 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0D0500 0%,#1A0A00 100%)' }}
        >
          <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
          <div className="relative max-w-xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 border"
              style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'rgba(212,160,23,0.3)', color: '#D4A017' }}
            >
              🌿 Live Vastu Feed
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-white mb-3"
            >
              Vastu Remedies & Transformations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-sm"
            >
              Daily Vastu tips, real transformations and sacred wisdom by Dr. PPS Tomar
            </motion.p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-7">
            {CATEGORIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === c.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden">
                  <div className="p-4 flex gap-3">
                    <div className="w-10 h-10 skeleton rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 skeleton rounded w-1/3" />
                      <div className="h-2 skeleton rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-56 skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 skeleton rounded" />
                    <div className="h-3 skeleton rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌿</div>
              <p className="text-gray-500 font-medium mb-1">No posts in this category yet.</p>
              <p className="text-gray-400 text-sm">Check back soon for daily Vastu wisdom!</p>
            </div>
          )}

          {/* Posts */}
          {!loading && posts.length > 0 && (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post._id} post={post} sessionId={sessionId} />
              ))}

              {/* Load more */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-3.5 rounded-2xl border border-orange-200 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loadingMore
                    ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Loading…</>
                    : <><ChevronDown size={16} /> Load More Posts</>
                  }
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
