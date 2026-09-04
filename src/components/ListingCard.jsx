import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

export default function ListingCard({ listing }) {
  const price = formatPrice(listing.price)

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/40 hover:shadow-gold-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/5">
        <img
          src={listing.image}
          alt={listing.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <Badge variant={listing.inStock ? 'success' : 'muted'}>
            {listing.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="violet" className="mb-3 w-fit">
          {listing.categoryName}
        </Badge>
        <h3 className="text-lg font-semibold text-white">{listing.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/50">{listing.description}</p>
        {price && <p className="mt-4 text-lg font-bold text-gradient-gold">{price}</p>}
        <Button
          variant="subtle"
          className="mt-6 w-full justify-between group-hover:border-gold-500/30"
          asChild
        >
          <Link to={`/shop/${listing.id}`}>
            View Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
