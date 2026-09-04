import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Reveal from '@/components/Reveal'
import ListingCard from '@/components/ListingCard'
import { getListings } from '@/lib/listingsStore'

export default function Listings() {
  const [listings, setListings] = useState([])

  useEffect(() => {
    getListings().then(setListings)
  }, [])

  const preview = listings.slice(0, 6)

  return (
    <section id="listings" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Trending <span className="text-gradient-gold">Assets</span>
            </h2>
            <p className="mt-4 text-white/55">
              Hand picked, verified digital accounts and services ready for deployment.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.08}>
              <ListingCard listing={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop">
                View All Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
