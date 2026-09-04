import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, requireFirebase } from '@/lib/firebase'
import { listingsSeed } from '@/data/listings.seed'
import { getCategories } from '@/lib/categoriesStore'

let seedPromise = null

function idFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function listingsCol() {
  return collection(db, 'listings')
}

function fallbackListings() {
  return listingsSeed.map((item) => ({
    id: idFromName(item.name),
    ...item,
    categoryId: idFromName(item.category),
    categoryName: item.category,
  }))
}

async function seedIfEmpty() {
  if (!db) return
  if (seedPromise) return seedPromise
  seedPromise = (async () => {
    const snap = await getDocs(listingsCol())
    if (!snap.empty) return
    const categories = await getCategories()
    for (const item of listingsSeed) {
      const category = categories.find((c) => c.name === item.category)
      await addDoc(listingsCol(), {
        name: item.name,
        description: item.description,
        image: item.image,
        inStock: item.inStock,
        price: item.price,
        features: item.features || [],
        categoryId: category?.id || null,
        categoryName: category?.name || item.category,
        createdAt: serverTimestamp(),
      })
    }
  })()
  return seedPromise
}

function fromDoc(d) {
  return { id: d.id, ...d.data() }
}

export async function getListings() {
  if (!db) return fallbackListings()
  await seedIfEmpty()
  const snap = await getDocs(listingsCol())
  return snap.docs.map(fromDoc)
}

export async function getListingById(id) {
  if (!db) return fallbackListings().find((item) => item.id === id) || null
  const snap = await getDoc(doc(db, 'listings', id))
  return snap.exists() ? fromDoc(snap) : null
}

export async function addListing(listing) {
  requireFirebase()
  const docRef = await addDoc(listingsCol(), {
    inStock: true,
    features: [],
    ...listing,
    createdAt: serverTimestamp(),
  })
  return { id: docRef.id, ...listing }
}

export async function updateListing(id, data) {
  requireFirebase()
  await updateDoc(doc(db, 'listings', id), data)
}

export async function toggleStock(id) {
  requireFirebase()
  const current = await getListingById(id)
  if (!current) return null
  const inStock = !current.inStock
  await updateDoc(doc(db, 'listings', id), { inStock })
  return { ...current, inStock }
}

export async function deleteListing(id) {
  requireFirebase()
  await deleteDoc(doc(db, 'listings', id))
}
