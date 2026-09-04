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
import { db } from '@/lib/firebase'
import { listingsSeed } from '@/data/listings.seed'
import { getCategories } from '@/lib/categoriesStore'

const listingsCol = collection(db, 'listings')

let seedPromise = null

async function seedIfEmpty() {
  if (seedPromise) return seedPromise
  seedPromise = (async () => {
    const snap = await getDocs(listingsCol)
    if (!snap.empty) return
    const categories = await getCategories()
    for (const item of listingsSeed) {
      const category = categories.find((c) => c.name === item.category)
      await addDoc(listingsCol, {
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
  await seedIfEmpty()
  const snap = await getDocs(listingsCol)
  return snap.docs.map(fromDoc)
}

export async function getListingById(id) {
  const snap = await getDoc(doc(db, 'listings', id))
  return snap.exists() ? fromDoc(snap) : null
}

export async function addListing(listing) {
  const docRef = await addDoc(listingsCol, {
    inStock: true,
    features: [],
    ...listing,
    createdAt: serverTimestamp(),
  })
  return { id: docRef.id, ...listing }
}

export async function updateListing(id, data) {
  await updateDoc(doc(db, 'listings', id), data)
}

export async function toggleStock(id) {
  const current = await getListingById(id)
  if (!current) return null
  const inStock = !current.inStock
  await updateDoc(doc(db, 'listings', id), { inStock })
  return { ...current, inStock }
}

export async function deleteListing(id) {
  await deleteDoc(doc(db, 'listings', id))
}
