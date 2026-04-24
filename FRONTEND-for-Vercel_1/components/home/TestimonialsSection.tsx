'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const testimonials = [
  { name: 'Rajesh Kumar', city: 'New Delhi', service: 'Vastu Check', rating: 5, text: 'Dr. PPS transformed our home completely. After his Vastu analysis, we experienced positive changes in our business and family harmony within 2 months.', textHi: 'डॉ. PPS ने हमारे घर को पूरी तरह बदल दिया। उनके वास्तु विश्लेषण के बाद, 2 महीने में हमारे व्यवसाय में सकारात्मक बदलाव आए।' },
  { name: 'Priya Sharma', city: 'Mumbai', service: 'Numerology Analysis', rating: 5, text: 'The numerology report was incredibly detailed. Dr. PPS identified issues I never knew existed and provided practical remedies that actually worked!', textHi: 'अंकशास्त्र रिपोर्ट अविश्वसनीय रूप से विस्तृत थी। डॉ. PPS ने ऐसी समस्याएं पहचानीं जो मुझे पता नहीं थीं।' },
  { name: 'Amit Patel', city: 'Ahmedabad', service: 'Smart Layout', rating: 5, text: 'Our new factory layout by Dr. PPS has shown remarkable improvements in productivity. The Vastu-compliant design truly makes a difference!', textHi: 'डॉ. PPS द्वारा हमारी नई फैक्ट्री का लेआउट उत्पादकता में उल्लेखनीय सुधार दिखाता है।' },
  { name: 'Sunita Reddy', city: 'Hyderabad', service: 'Mobile Numerology', rating: 5, text: 'Changed my mobile number as suggested. Within weeks, I noticed better communication, new opportunities, and overall positive energy in life!', textHi: 'सुझाए अनुसार मोबाइल नंबर बदला। कुछ हफ्तों में बेहतर संचार और नए अवसर मिले!' },
  { name: 'Vikram Singh', city: 'Jaipur', service: 'Book Appointment', rating: 5, text: 'Just ₹11 for WhatsApp consultation with an IVAF expert? Unbelievable value! Dr. PPS guided me on urgent Vastu issues immediately.', textHi: 'IVAF विशेषज्ञ के साथ WhatsApp परामर्श के लिए केवल ₹11? अविश्वसनीय मूल्य!' },
  { name: 'Meera Krishnan', city: 'Chennai', service: 'Vastu Consultancy', rating: 5, text: 'The full consultancy package was worth every rupee. Dr. PPS is knowledgeable, patient, and truly cares about helping you improve your life.', textHi: 'पूर्ण परामर्श पैकेज हर रुपये के लायक था। डॉ. PPS जानकार और वास्तव में सहायक हैं।' },
];

export default function TestimonialsSection() {
  const { lang } = useUIStore();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="font-accent text-primary text-sm tracking-widest uppercase">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-text-dark mt-2 mb-3">
            {lang === 'en' ? 'What Our Clients Say' : 'हमारे ग्राहक क्या कहते हैं'}
          </h2>
          <p className="text-text-light">{lang === 'en' ? '10,000+ happy clients across India' : 'पूरे भारत में 10,000+ खुश ग्राहक'}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-cream rounded-2xl p-6 border border-orange-100 hover:border-primary/30 hover:shadow-orange transition-all">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-text-mid text-sm leading-relaxed mb-4 italic">
                "{lang === 'hi' ? t.textHi : t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-saffron-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                <div>
                  <div className="font-semibold text-text-dark text-sm">{t.name}</div>
                  <div className="text-xs text-text-light">{t.city} • {t.service}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
