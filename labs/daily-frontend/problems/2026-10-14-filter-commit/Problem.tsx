import { useState } from 'react'
import { createListingsApi } from './features/listingFilter/apis/createListingsApi'
import { ListingFilterPage } from './pages/ListingFilterPage'

export function Problem() {
  const [searchListings] = useState(createListingsApi)
  return <ListingFilterPage searchListings={searchListings} />
}
