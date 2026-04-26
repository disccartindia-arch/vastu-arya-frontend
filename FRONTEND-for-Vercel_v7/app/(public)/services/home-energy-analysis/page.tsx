import ServicePageTemplate from '../../../../components/services/ServicePageTemplate';
export default function Page() {
  return <ServicePageTemplate
    icon="🏠" badge="Most Popular" title="Home Energy Vastu Analysis" duration="60 minutes"
    subtitle="Comprehensive energy audit of your home using advanced Vastu Shastra principles by Dr. PPS Tomar"
    originalPrice={3999} price={2499}
    description="A complete Vastu energy analysis of your entire home by IVAF certified Dr. Pranveer Pratap Singh Tomar. This service includes analysis of all eight directions, entry points, room placements, colour energy, element balance, and non-demolition remedies. Receive a detailed written report with actionable remedies you can implement yourself."
    benefits={['Complete 8-direction energy analysis','Room-by-room Vastu audit','No demolition remedies only','Written report included','Bedroom kitchen toilet analysis','Entry door main gate Vastu','Colour and element recommendations','30-day follow-up support']}
    process={[{{'step':'1','title':'Book & Share Details','desc':'Book your session and share floor plan photos and current challenges.'}},{{'step':'2','title':'Deep Vastu Analysis','desc':'Dr. PPS Tomar analyses every zone and energy flow in your home.'}},{{'step':'3','title':'Video Consultation','desc':'60-minute video/phone call explaining findings and remedies.'}},{{'step':'4','title':'Written Report','desc':'Receive a detailed written report with prioritised remedies within 48 hours.'}}]}
    faqs={[{{'q':'Do I need demolition?','a':'No. Dr. PPS Tomar specialises in non-demolition remedies using Vastu products, colours and rearrangements.'}},{{'q':'Can I do this for a rented home?','a':'Yes. Vastu analysis and most remedies work equally well in rented homes.'}},{{'q':'What about irregular-shaped plots?','a':'Irregular shapes are covered in the analysis with specific remedies provided.'}},{{'q':'How soon will I see results?','a':'Most families notice positive changes within 21-40 days of implementing remedies.'}}]}
  />;
}
