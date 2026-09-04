import { Link } from 'react-router-dom'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'

export default function Hero() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 16)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 16)
  }

  const transform = useMotionTemplate`translate3d(${mx}px, ${my}px, 0)`

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-violet-wash" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-gold-300">
                The World's Digital Asset Marketplace
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Quality Social Media <span className="text-gradient-gold">Accounts</span> for Sale
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                Verified, aged social profiles and secure VPN access. Explogs Marketplace gives
                marketers the tools they need to scale, backed by direct support and manual
                verification on every order.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                <Button size="lg" asChild>
                  <Link to="/shop">
                    Browse Listings
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#how-it-works">How It Works</a>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <p className="mt-7 flex items-center gap-2 text-sm text-white/40">
                <ShieldCheck className="h-4 w-4 text-gold-400" />
                Verified accounts &middot; Confirmed payments &middot; Direct delivery
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="relative">
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                mx.set(0)
                my.set(0)
              }}
              className="relative mx-auto aspect-square w-full max-w-md"
            >
              <motion.div style={{ transform }} className="animate-float">
                <div className="absolute -inset-6 rounded-3xl bg-gold-gradient opacity-20 blur-3xl" />
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold-500/20 bg-midnight-800 shadow-gold-lg">
                  <img
                    src="/assets/logo.png"
                    alt="Explogs Marketplace"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
