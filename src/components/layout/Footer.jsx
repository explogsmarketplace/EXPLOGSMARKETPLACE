import { Link } from 'react-router-dom'
import { MessageCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { waLink } from '@/config/site'

export default function Footer() {
  return (
    <footer id="support" className="border-t border-white/5 bg-midnight-950/80">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/assets/logo.png" alt="Explogs Marketplace" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-display text-lg font-bold text-white">
                Explogs <span className="text-gradient-gold">Marketplace</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              A digital marketplace for verified social media and VPN accounts. Manual payment
              confirmed by our team, delivery handled directly over WhatsApp.
            </p>
            <Button variant="whatsapp" size="default" asChild className="mt-6">
              <a href={waLink('Hi, I need support with Explogs Marketplace.')} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" />
                Contact on WhatsApp
              </a>
            </Button>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gold-300">Marketplace</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link to="/shop" className="transition-colors hover:text-white">Browse Listings</Link></li>
              <li><a href="/#how-it-works" className="transition-colors hover:text-white">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gold-300">Company</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><a href="#support" className="transition-colors hover:text-white">Support</a></li>
              <li>
                <a href={waLink('Hi, I have a question about Explogs Marketplace.')} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            Verified accounts. Confirmed payments. Direct support.
          </p>
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Explogs Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
