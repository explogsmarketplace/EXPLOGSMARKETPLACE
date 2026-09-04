import { Zap, ShieldCheck, MessageCircle, BadgeCheck } from 'lucide-react'
import Reveal from '@/components/Reveal'

const items = [
  { icon: Zap, title: 'Instant Delivery', desc: 'Receive details right after payment is confirmed.' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: 'Manual bank transfer, confirmed before delivery.' },
  { icon: MessageCircle, title: '24/7 WhatsApp Support', desc: 'Real support, no bots, no wait queues.' },
  { icon: BadgeCheck, title: 'Verified Accounts', desc: 'Every listing checked before it goes live.' },
]

export default function TrustStrip() {
  return (
    <section className="border-y border-white/5 bg-midnight-900/50">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold-500/25 bg-gold-500/10">
                  <item.icon className="h-5 w-5 text-gold-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 hidden text-xs text-white/45 sm:block">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
