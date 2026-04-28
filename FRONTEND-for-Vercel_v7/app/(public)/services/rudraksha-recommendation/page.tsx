'use client';
import ServicePageTemplate from '../../../../components/services/ServicePageTemplate';
export default function Page() {
  return <ServicePageTemplate
    icon="🌰" badge="Vedic Guidance" title="Rudraksha Recommendation Session" duration="30 minutes"
    subtitle="Personalised Rudraksha selection based on your horoscope and life goals by Dr. PPS Tomar"
    originalPrice={1999} price={1199}
    description="Rudraksha beads are among the most powerful Vedic spiritual tools — but effectiveness depends on choosing the right Mukhi. Dr. PPS Tomar analyses your birth chart, running dasha and specific challenges to recommend the ideal Rudraksha(s), with wearing guidelines, activation mantras, and care instructions."
    benefits={['Horoscope-based Mukhi selection','Single or combination recommendation','Correct wearing day and ritual','Activation mantra provided','Care and storage instructions','Multi-Rudraksha combinations','Mala vs pendant guidance','Authenticity verification tips']}
    process={[{'step':'1','title':'Book & Share Details','desc':'Book session and share date, time and place of birth and challenges.'},{'step':'2','title':'Chart Analysis','desc':'Dr. PPS Tomar analyses your chart and planetary periods.'},{'step':'3','title':'Recommendation Call','desc':'30-minute consultation with Rudraksha prescription and mantras.'},{'step':'4','title':'Sourcing Guidance','desc':'Advice on authentic sources with authenticity tests.'}]}
    faqs={[{'q':'How do I know if a Rudraksha is genuine?','a':'Dr. PPS Tomar provides authenticity tests and recommends X-ray certified sources.'},{'q':'Can I wear multiple Rudrakshas?','a':'Yes — combinations are often recommended for comprehensive planetary support.'},{'q':'Can anyone wear Rudraksha?','a':'Most Rudrakshas are safe for everyone. Specific Mukhis require chart analysis.'},{'q':'Does wearing Rudraksha require restrictions?','a':'Specific guidelines vary by Mukhi. Dr. PPS Tomar provides personalised instructions.'}]}
  />;
}
