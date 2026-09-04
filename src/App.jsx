import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Shop from '@/pages/Shop'
import ListingDetail from '@/pages/ListingDetail'
import Order from '@/pages/Order'
import AdminPage from '@/pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:slug" element={<ListingDetail />} />
      <Route path="/order/:slug" element={<Order />} />
      <Route path="/explogs-admin" element={<AdminPage />} />
    </Routes>
  )
}
