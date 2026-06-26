import { Nav } from '@/components/marketing/Nav'
import { Hero } from '@/components/marketing/Hero'
import { HowItWorks } from '@/components/marketing/HowItWorks'
import { DualSided } from '@/components/marketing/DualSided'
import { Corridors } from '@/components/marketing/Corridors'
import { Trust } from '@/components/marketing/Trust'
import { Testimonials } from '@/components/marketing/Testimonials'
import { WaitlistCTA } from '@/components/marketing/WaitlistCTA'
import { Footer } from '@/components/marketing/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <DualSided />
        <Corridors />
        <Trust />
        <Testimonials />
        <WaitlistCTA />
      </main>
      <Footer />
    </>
  )
}
