import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, CheckCircle2, CreditCard, ShieldCheck, PackageCheck } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'
import { getListingById } from '@/lib/listingsStore'
import { formatPrice } from '@/lib/utils'
import { waLink } from '@/config/site'

const steps = [
  { icon: CreditCard, title: 'Pay', desc: 'Send payment to the bank account shown at checkout.' },
  { icon: ShieldCheck, title: 'Confirm', desc: 'We verify your payment and confirm the order.' },
  { icon: PackageCheck, title: 'Receive', desc: 'Login details are delivered to you on WhatsApp.' },
]

export default function ListingDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(undefined)

  useEffect(() => {
    getListingById(slug).then(setListing)
  }, [slug])

  useEffect(() => {
    if (listing === null) navigate('/shop', { replace: true })
  }, [listing, navigate])

  if (!listing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-40 text-center text-white/40">Loading...</div>
      </div>
    )
  }

  const price = formatPrice(listing.price)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-gold-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            <Reveal delay={0.05}>
              <div className="mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-3xl border border-gold-500/20 bg-midnight-800 shadow-gold-lg lg:mx-0">
                <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.1}>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="violet">{listing.categoryName}</Badge>
                  <Badge variant={listing.inStock ? 'success' : 'muted'}>
                    {listing.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                  {listing.name}
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-4 max-w-xl text-white/55">{listing.description}</p>
              </Reveal>

              {price && (
                <Reveal delay={0.25}>
                  <p className="mt-6 text-3xl font-bold text-gradient-gold">{price}</p>
                </Reveal>
              )}

              <Reveal delay={0.3}>
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                  <Button size="lg" disabled={!listing.inStock} asChild={listing.inStock}>
                    {listing.inStock ? (
                      <Link to={`/order/${listing.id}`}>Buy Now</Link>
                    ) : (
                      <span>Out of Stock</span>
                    )}
                  </Button>
                  <Button size="lg" variant="whatsapp" asChild>
                    <a
                      href={waLink(`Hi, I'm interested in ${listing.name}. Is it available?`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>

          {listing.features?.length > 0 && (
            <Reveal delay={0.1} className="mt-16">
              <div className="rounded-2xl border border-white/5 bg-midnight-800/40 p-8">
                <h2 className="text-lg font-semibold text-white">What You Get</h2>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {listing.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )}

          <div className="mt-16">
            <Reveal>
              <h2 className="text-center text-lg font-semibold text-white">How Delivery Works</h2>
            </Reveal>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.1}>
                  <div className="flex flex-col items-center rounded-xl2 border border-white/5 bg-midnight-800/40 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/30 hover:shadow-gold">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/10">
                      <s.icon className="h-5 w-5 text-gold-300" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/50">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
