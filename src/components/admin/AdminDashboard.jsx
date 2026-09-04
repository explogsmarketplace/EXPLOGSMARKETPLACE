import { useEffect, useState } from 'react'
import { LogOut, Plus, ArrowUp, ArrowDown, Pencil, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { getListings, addListing, updateListing, toggleStock, deleteListing } from '@/lib/listingsStore'
import { getCategories, addCategory, updateCategory, deleteCategory, moveCategory } from '@/lib/categoriesStore'
import { getOrders, updateOrderStatus } from '@/lib/ordersStore'
import { uploadImage } from '@/lib/cloudinary'
import { formatPrice, cn } from '@/lib/utils'

const orderStatuses = ['New', 'Contacted', 'Fulfilled']

function CategoriesTab() {
  const [categories, setCategories] = useState([])
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh() {
    setCategories(await getCategories())
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setBusy(true)
    await addCategory(newName)
    setNewName('')
    await refresh()
    setBusy(false)
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditingName(cat.name)
    setError('')
  }

  async function saveEdit(id) {
    if (!editingName.trim()) return
    await updateCategory(id, { name: editingName })
    setEditingId(null)
    await refresh()
  }

  async function handleDelete(id) {
    setError('')
    try {
      await deleteCategory(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleMove(id, direction) {
    await moveCategory(id, direction)
    await refresh()
  }

  return (
    <>
      <section className="rounded-xl border border-white/10 bg-midnight-800/60">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white/80">Categories ({categories.length})</h2>
        </div>
        {error && <p className="border-b border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">{error}</p>}
        <div className="divide-y divide-white/5">
          {categories.map((cat, i) => (
            <div key={cat.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div className="flex flex-col">
                <button
                  onClick={() => handleMove(cat.id, 'up')}
                  disabled={i === 0}
                  className="text-white/40 hover:text-gold-300 disabled:opacity-20"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMove(cat.id, 'down')}
                  disabled={i === categories.length - 1}
                  className="text-white/40 hover:text-gold-300 disabled:opacity-20"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {editingId === cat.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-9" />
                  <Button size="sm" onClick={() => saveEdit(cat.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <p className="flex-1 text-sm font-medium text-white">{cat.name}</p>
                  <Button variant="ghost" size="sm" onClick={() => startEdit(cat)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-white/40">No categories yet.</p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-midnight-800/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/80">
          <Plus className="h-4 w-4" />
          Add New Category
        </h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Number Verifications"
            className="max-w-sm"
          />
          <Button type="submit" disabled={busy}>
            {busy ? 'Adding...' : 'Add Category'}
          </Button>
        </form>
      </section>
    </>
  )
}

const emptyForm = { name: '', description: '', categoryId: '', price: '', image: '', features: '' }

function ListingsTab() {
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function refresh() {
    const [l, c] = await Promise.all([getListings(), getCategories()])
    setListings(l)
    setCategories(c)
    setForm((f) => (f.categoryId ? f : { ...f, categoryId: c[0]?.id || '' }))
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleToggle(id) {
    await toggleStock(id)
    refresh()
  }

  async function handleDelete(id) {
    await deleteListing(id)
    if (editingId === id) resetForm()
    refresh()
  }

  function resetForm() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id || '' })
    setEditingId(null)
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({
      name: item.name,
      description: item.description,
      categoryId: item.categoryId || '',
      price: item.price ?? '',
      image: item.image || '',
      features: (item.features || []).join('\n'),
    })
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, image: url }))
    } catch (err) {
      alert(err.message)
    }
    setUploading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.description.trim() || !form.categoryId) return
    setSubmitting(true)
    const category = categories.find((c) => c.id === form.categoryId)
    const features = form.features
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)
    const payload = {
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      categoryName: category?.name || '',
      price: form.price === '' ? null : Number(form.price),
      image: form.image,
      features,
    }

    if (editingId) {
      await updateListing(editingId, payload)
    } else {
      await addListing({ ...payload, inStock: true })
    }

    resetForm()
    await refresh()
    setSubmitting(false)
  }

  const grouped = categories.map((cat) => ({
    category: cat,
    items: listings.filter((l) => l.categoryId === cat.id),
  }))
  const uncategorized = listings.filter((l) => !categories.some((c) => c.id === l.categoryId))

  return (
    <>
      <section className="rounded-xl border border-white/10 bg-midnight-800/60">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white/80">Listings ({listings.length})</h2>
        </div>
        <div className="divide-y divide-white/10">
          {grouped.map(
            ({ category, items }) =>
              items.length > 0 && (
                <div key={category.id}>
                  <p className="bg-midnight-900/50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-gold-400">
                    {category.name}
                  </p>
                  <div className="divide-y divide-white/5">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{item.name}</p>
                          <p className="truncate text-xs text-white/45">
                            {formatPrice(item.price) || 'No price set'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          <Switch checked={item.inStock} onCheckedChange={() => handleToggle(item.id)} />
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
          {uncategorized.length > 0 && (
            <div>
              <p className="bg-midnight-900/50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                Uncategorized
              </p>
              <div className="divide-y divide-white/5">
                {uncategorized.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="truncate text-xs text-white/45">{formatPrice(item.price) || 'No price set'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      <Switch checked={item.inStock} onCheckedChange={() => handleToggle(item.id)} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {listings.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-white/40">No listings yet.</p>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-midnight-800/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white/80">
            {editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? 'Edit Listing' : 'Add New Listing'}
          </h2>
          {editingId && (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-3.5 w-3.5" />
              Cancel Edit
            </Button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Premium Facebook Accounts"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="h-11 w-full rounded-lg border border-white/10 bg-midnight-700/50 px-4 text-sm text-white outline-none focus:border-gold-400/60"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="price">Price (₦)</Label>
            <Input
              id="price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-3">
              {form.image && (
                <img src={form.image} alt="Preview" className="h-11 w-11 rounded-lg border border-white/10 object-cover" />
              )}
              <label className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 text-sm text-white/50 hover:border-gold-500/30 hover:text-gold-300">
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : form.image ? 'Replace image' : 'Upload image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of the listing"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="features">What You Get (one per line, optional)</Label>
            <Textarea
              id="features"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder={'Aged 5+ years\nOriginal email access\nReady for immediate use'}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Listing'}
            </Button>
          </div>
        </form>
      </section>
    </>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])

  async function refresh() {
    setOrders(await getOrders())
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleStatusChange(id, status) {
    await updateOrderStatus(id, status)
    refresh()
  }

  function formatDate(createdAt) {
    if (!createdAt) return ''
    const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt)
    return date.toLocaleString()
  }

  return (
    <section className="rounded-xl border border-white/10 bg-midnight-800/60">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold text-white/80">Orders ({orders.length})</h2>
      </div>
      <div className="divide-y divide-white/5">
        {orders.map((order) => (
          <div key={order.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                {order.fullName} <span className="text-white/40">&middot; {order.listingName}</span>
              </p>
              <p className="mt-1 text-xs text-white/45">
                WhatsApp: {order.whatsapp}
                {order.email ? ` · ${order.email}` : ''}
                {formatPrice(order.price) ? ` · ${formatPrice(order.price)}` : ''}
              </p>
              {order.note && <p className="mt-1 text-xs text-white/35">Note: {order.note}</p>}
              <p className="mt-1 text-xs text-white/30">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              {orderStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(order.id, status)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                    order.status === status
                      ? 'border-gold-500/40 bg-gold-500/10 text-gold-300'
                      : 'border-white/10 text-white/45 hover:text-white/70',
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-white/40">No orders yet.</p>
        )}
      </div>
    </section>
  )
}

export default function AdminDashboard() {
  const { logout } = useAdminAuth()
  const [tab, setTab] = useState('categories')

  return (
    <div className="min-h-screen bg-midnight-950 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-midnight-900 px-4 py-4 sm:px-6">
        <div>
          <h1 className="font-display text-lg font-bold">Explogs Admin</h1>
          <p className="text-xs text-white/40">Manage categories, listings and orders</p>
        </div>
        <Button variant="subtle" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </header>

      <div className="border-b border-white/10 bg-midnight-900/60 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto py-3">
          {[
            { key: 'categories', label: 'Categories' },
            { key: 'listings', label: 'Listings' },
            { key: 'orders', label: 'Orders' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                tab === t.key ? 'bg-gold-500/10 text-gold-300' : 'text-white/50 hover:text-white/80',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'listings' && <ListingsTab />}
        {tab === 'orders' && <OrdersTab />}
      </main>
    </div>
  )
}
