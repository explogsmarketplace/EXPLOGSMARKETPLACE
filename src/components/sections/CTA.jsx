import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'
import { waLink } from '@/config/site'

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-midnight-800/60 px-6 py-14 text-center sm:px-14">
            <div className="pointer-events-none absolute inset-0 bg-gold-gradient-soft" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to browse the <span className="text-gradient-gold">marketplace?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/55">
                Explore verified accounts and VPN access, or reach out directly if you need help
                choosing the right listing.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/shop">
                    Browse Listings
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="whatsapp" asChild>
                  <a href={waLink('Hi, I need help choosing a listing on Explogs Marketplace.')} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
