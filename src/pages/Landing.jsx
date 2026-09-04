import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import TrustStrip from '@/components/sections/TrustStrip'
import Listings from '@/components/sections/Listings'
import HowItWorks from '@/components/sections/HowItWorks'
import CTA from '@/components/sections/CTA'

export default function Landing() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Listings />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
