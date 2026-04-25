'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../../../components/layout/Navbar';
import Footer from '../../../../../components/layout/Footer';
import CartDrawer from '../../../../../components/common/CartDrawer';
import WhatsAppButton from '../../../../../components/common/WhatsAppButton';
import ProductCard from '../../../../../components/store/ProductCard';
import PriceDisplay from '../../../../../components/common/PriceDisplay';
import { useUIStore } from '../../../../../store/uiStore';
import { useCartStore } from '../../../../../store/cartStore';
import { productsAPI } from '../../../../../lib/api';
import { Product } from '../../../../../types';
import { ShoppingCart, CheckCircle, Star, Shield, RefreshCw, Truck, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const STATIC_REVIEWS = [
  { name: 'Priya S.', city: 'Mumbai', rating: 5, text: 'Amazing product! The energy in my home has completely transformed. Highly recommended by my Vastu consultant too.', date: '2 days ago' },
  { name: 'Rahul M.', city: 'Delhi', rating: 5, text: 'Genuine product, beautifully packaged. I could feel the positive vibrations the moment I placed it in my pooja room.', date: '1 week ago' },
  { name: 'Anjali K.', city: 'Bangalore', rating: 4, text: 'Very happy with the quality. The crystal clarity is excellent. Fast delivery and well-wrapped.', date: '2 weeks ago' },
  { name: 'Deepak R.', city: 'Pune', rating: 5, text: 'Bought this on the recommendation of Dr. PPS. Absolutely authentic and the positive change was noticeable within days.', date: '3 weeks ago' },
];

const GUARANTEES = [
  { icon: Shield, label: '100% Original & Certified' },
  { icon: RefreshCw, label: '7-Day Easy Exchange' },
  { icon: Truck, label: 'Free Shipping on ₹500+' },
];

const STATIC_FAQ = [
  { q: 'Is this product energised / activated?', a: 'Yes. All our products are energised using Vedic mantras and rituals before dispatch under the guidance of Dr. PPS.' },
  { q: 'How do I place / use this product at home?', a: 'Detailed placement instructions are included with every order. You can also book a ₹11 consultation with Dr. PPS for personalised guidance.' },
  { q: 'Are these products suitable for gifting?', a: 'Absolutely. We offer premium gift packaging on request. Just leave a note at checkout.' },
  { q: 'What is the return / exchange policy?', a: 'We offer a 7-day exchange policy for damaged or defective items. Contact us on WhatsApp within 7 days of delivery.' },
];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { lang } = useUIStore();
  const addItem = useCartStore(s => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (slug) {
      productsAPI.getBySlug(slug as string).then(r => {
        setProduct(r.data.data);
        setRelated(r.data.related || []);
      }).finally(() => setLoading(false));
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return (<><Navbar /><div className="min-h-screen flex items-center justify-center"><div className="text-5xl animate-spin">🕉️</div></div><Footer /></>);
  if (!product) return (<><Navbar /><div className="min-h-screen flex items-center justify-center text-center"><div><div className="text-5xl mb-3">📦</div><p>Product not found</p><Link href="/vastu-store" className="text-primary hover:underline mt-4 block">Back to Store</Link></div></div><Footer /></>);

  const name = lang === 'hi' && product.name.hi ? product.name.hi : product.name.en;
  const description = lang === 'hi' && product.description.hi ? product.description.hi : product.description.en;
  const discount = product.price > product.offerPrice ? Math.round((1 - product.offerPrice / product.price) * 100) : 0;

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link href="/vastu-store" className="hover:text-primary">Vastu Store</Link>
            <span>›</span>
            <Link href={`/vastu-store/${product.category}`} className="hover:text-primary capitalize">{product.category}</Link>
            <span>›</span>
            <span className="text-gray-600 truncate max-w-[150px]">{name}</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-100 relative">
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">{discount}% OFF</div>
                )}
                {product.isNewLaunch && (
                  <div className="absolute top-4 right-4 z-10 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl">NEW</div>
                )}
                {product.images[activeImg] ? (
                  <img src={product.images[activeImg]} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl bg-orange-50">🕉️</div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImg === i ? 'border-primary shadow-orange' : 'border-transparent hover:border-orange-200'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {/* Guarantee badges */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {GUARANTEES.map((g, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 flex flex-col items-center gap-1.5 border border-orange-50 text-center shadow-sm">
                    <g.icon size={18} className="text-primary" />
                    <p className="text-xs text-gray-600 font-medium leading-tight">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1 capitalize">{product.category}</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-dark leading-snug">{name}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(product.rating || 4.8) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />)}</div>
                  <span className="text-sm font-semibold text-gray-700">{(product.rating || 4.8).toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({product.reviewCount || STATIC_REVIEWS.length} reviews)</span>
                  {product.totalSold > 0 && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">{product.totalSold}+ sold</span>}
                </div>
              </div>

              {/* Price */}
              <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                <PriceDisplay original={product.price} offer={product.offerPrice} size="lg" />
                {discount > 0 && <p className="text-green-600 text-sm font-semibold mt-1">🎉 You save ₹{(product.price - product.offerPrice).toLocaleString('en-IN')} ({discount}% off)</p>}
                <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes. Free shipping on orders above ₹500</p>
              </div>

              {/* Description */}
              <p className="text-text-mid text-sm leading-relaxed">{description}</p>

              {/* Benefits */}
              {product.benefits.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-text-dark text-sm">Key Benefits</p>
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-text-mid text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock badge */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Add to cart */}
              <div className="flex gap-3 pt-1">
                <button onClick={handleAddToCart} disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all shadow-orange disabled:opacity-50 disabled:cursor-not-allowed ${added ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary-dark text-white'}`}>
                  <ShoppingCart size={18} />
                  {added ? '✓ Added to Cart!' : product.stock > 0 ? (lang === 'en' ? 'Add to Cart' : 'कार्ट में जोड़ें') : 'Out of Stock'}
                </button>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm bg-[#25D366] hover:bg-[#128C7E] text-white transition-all">
                  <MessageCircle size={18} /> Ask
                </a>
              </div>

              {product.sku && <p className="text-xs text-gray-300">SKU: {product.sku}</p>}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white rounded-3xl shadow-sm border border-orange-50 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-text-dark">Customer Reviews</h2>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-700">{(product.rating || 4.8).toFixed(1)}</span>
                <span className="text-sm text-gray-400">/ 5</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {STATIC_REVIEWS.map((r, i) => (
                <div key={i} className="bg-cream rounded-2xl p-4 border border-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-yellow-400 flex items-center justify-center text-white font-bold text-xs">{r.name[0]}</div>
                      <div>
                        <p className="font-semibold text-text-dark text-sm">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.city} · {r.date}</p>
                      </div>
                    </div>
                    <div className="flex">{[...Array(r.rating)].map((_, j) => <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />)}</div>
                  </div>
                  <p className="text-sm text-text-mid leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-orange-50 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-text-dark mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {STATIC_FAQ.map((faq, i) => (
                <div key={i} className="border border-orange-100 rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-orange-50 transition-colors">
                    <span className="font-semibold text-text-dark text-sm">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-primary flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-text-mid leading-relaxed border-t border-orange-50 pt-3">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
            <h2 className="font-display text-2xl font-bold text-text-dark mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </>
  );
}
