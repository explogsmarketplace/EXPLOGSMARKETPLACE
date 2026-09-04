import { useEffect, useMemo, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Reveal from '@/components/Reveal'
import ListingCard from '@/components/ListingCard'
import { getListings } from '@/lib/listingsStore'
import { getCategories } from '@/lib/categoriesStore'
import { cn } from '@/lib/utils'

export default function Shop() {
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    getListings().then(setListings)
    getCategories().then(setCategories)
  }, [])

  const tabs = useMemo(() => ['All', ...categories.map((c) => c.name)], [categories])

  const filtered = useMemo(() => {
    if (activeTab === 'All') return listings
    return listings.filter((l) => l.categoryName === activeTab)
  }, [listings, activeTab])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Full <span className="text-gradient-gold">Catalogue</span>
              </h1>
              <p className="mt-4 text-white/55">
                Every verified account and VPN listing available right now, filtered by category.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]',
                    activeTab === tab
                      ? 'border-transparent bg-gold-gradient text-midnight-950 shadow-gold'
                      : 'border-white/10 text-white/60 hover:border-gold-500/30 hover:text-gold-300',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 0.06}>
                <ListingCard listing={item} />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-16 text-center text-sm text-white/40">
              No listings in this category right now.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
