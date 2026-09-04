import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Check, CheckCircle2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getListingById } from '@/lib/listingsStore'
import { addOrder } from '@/lib/ordersStore'
import { formatPrice, cn } from '@/lib/utils'
import { banks, waLink } from '@/config/site'
import Reveal from '@/components/Reveal'

function CopyableField({ label, value }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable, ignore
    }
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="font-medium text-white/85">{value}</p>
      </div>
      {label === 'Account Number' && (
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
            copied
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-white/10 text-white/50 hover:border-gold-500/30 hover:text-gold-300',
          )}
          aria-label="Copy account number"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}

export default function Order() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(undefined)
  const [form, setForm] = useState({ fullName: '', whatsapp: '', email: '', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    getListingById(slug).then(setListing)
  }, [slug])

  useEffect(() => {
    if (listing === null) navigate('/shop', { replace: true })
  }, [listing, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fullName.trim() || !form.whatsapp.trim()) return
    setSubmitting(true)
    await addOrder({
      listingId: listing.id,
      listingName: listing.name,
      price: listing.price,
      ...form,
    })
    setSubmitting(false)
    setSubmitted(true)
  }

  if (!listing) {
    return <div className="flex min-h-screen items-center justify-center text-white/40">Loading...</div>
  }

  const price = formatPrice(listing.price)

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight px-5">
        <Reveal>
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-midnight-800 p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2 className="h-7 w-7 text-emerald-300" />
            </div>
            <h1 className="mt-5 font-display text-xl font-bold text-white">Order Received</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              We have received your order for <span className="text-white/80">{listing.name}</span>.
              Once your payment is confirmed, your details will be delivered on WhatsApp.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="whatsapp" asChild>
                <a
                  href={waLink(`Hi, I just placed an order for ${listing.name} and sent payment. Please confirm.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Notify Us on WhatsApp
                </a>
              </Button>
              <Button variant="subtle" asChild>
                <Link to="/shop">Back to Shop</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <Link
            to={`/shop/${listing.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-gold-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/5 bg-midnight-800/60 p-5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <img src={listing.image} alt={listing.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{listing.name}</p>
              <p className="text-xs text-white/45">{listing.categoryName}</p>
            </div>
            {price && <p className="shrink-0 text-lg font-bold text-gradient-gold">{price}</p>}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-white/5 bg-midnight-800/60 p-6">
          <h2 className="text-sm font-semibold text-white/80">Your Details</h2>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input
              id="whatsapp"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="e.g. 08012345678"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Anything else we should know"
            />
          </div>

          <div className="rounded-xl border border-gold-500/20 bg-midnight-900/60 p-5">
            <h3 className="text-sm font-semibold text-gold-300">Pay to Bank</h3>
            <p className="mt-1.5 text-xs text-white/45">
              Send payment to either account below, then submit this form.
            </p>
            <div className="mt-4 space-y-4">
              {banks.map((b) => (
                <div key={b.accountNumber} className="space-y-2.5 rounded-lg bg-midnight-800/60 p-4 text-sm">
                  <CopyableField label="Bank" value={b.name} />
                  <CopyableField label="Account Name" value={b.accountName} />
                  <CopyableField label="Account Number" value={b.accountNumber} />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? 'Submitting...' : 'I Have Paid, Notify Seller'}
          </Button>
        </form>
        </Reveal>
      </div>
    </div>
  )
}
