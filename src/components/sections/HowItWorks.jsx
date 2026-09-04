import { MousePointerClick, Landmark, PackageCheck } from 'lucide-react'
import Reveal from '@/components/Reveal'

const steps = [
  {
    icon: MousePointerClick,
    step: 'Step 1',
    title: 'Browse & Select',
    desc: 'Explore the marketplace and choose the accounts or VPN access that fit your needs.',
  },
  {
    icon: Landmark,
    step: 'Step 2',
    title: 'Pay to Bank',
    desc: 'Send payment directly to our bank account. Bank details are shown at checkout once you select a listing.',
  },
  {
    icon: PackageCheck,
    step: 'Step 3',
    title: 'Receive Delivery',
    desc: 'Once payment is confirmed, login details are delivered directly to you on WhatsApp.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-white/5 bg-midnight-900/40 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">Process</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              Three Steps to Purchase
            </h2>
            <p className="mt-4 text-white/55">
              A straightforward, manual process. No payment gateway, no customer accounts, just direct confirmation.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <div className="relative flex h-full flex-col items-center rounded-xl2 border border-white/5 bg-midnight-800/40 p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/30 hover:bg-midnight-800/70 hover:shadow-gold">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10">
                  <s.icon className="h-6 w-6 text-gold-300" />
                </div>
                <span className="mt-5 text-xs font-semibold uppercase tracking-widest text-gold-400">{s.step}</span>
                <h3 className="mt-2 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
