import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

const categoriesCol = collection(db, 'categories')
const listingsCol = collection(db, 'listings')

const DEFAULT_CATEGORIES = ['Social Media', 'VPN', 'Other']

let seedPromise = null

async function seedIfEmpty() {
  if (seedPromise) return seedPromise
  seedPromise = (async () => {
    const snap = await getDocs(categoriesCol)
    if (!snap.empty) return
    for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
      await addDoc(categoriesCol, {
        name: DEFAULT_CATEGORIES[i],
        order: i,
        createdAt: serverTimestamp(),
      })
    }
  })()
  return seedPromise
}

export async function getCategories() {
  await seedIfEmpty()
  const snap = await getDocs(query(categoriesCol, orderBy('order', 'asc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addCategory(name) {
  const existing = await getCategories()
  const nextOrder = existing.length ? Math.max(...existing.map((c) => c.order ?? 0)) + 1 : 0
  const docRef = await addDoc(categoriesCol, {
    name: name.trim(),
    order: nextOrder,
    createdAt: serverTimestamp(),
  })
  return { id: docRef.id, name: name.trim(), order: nextOrder }
}

export async function updateCategory(id, { name }) {
  await updateDoc(doc(db, 'categories', id), { name: name.trim() })

  // Keep the denormalized category name on listings in sync so Shop/homepage
  // filtering and display don't go stale after a rename.
  const affected = await getDocs(query(listingsCol, where('categoryId', '==', id)))
  if (!affected.empty) {
    const batch = writeBatch(db)
    affected.docs.forEach((d) => batch.update(d.ref, { categoryName: name.trim() }))
    await batch.commit()
  }
}

export async function countListingsInCategory(id) {
  const snap = await getDocs(query(listingsCol, where('categoryId', '==', id)))
  return snap.size
}

export async function deleteCategory(id) {
  const count = await countListingsInCategory(id)
  if (count > 0) {
    throw new Error(
      `This category has ${count} listing${count === 1 ? '' : 's'} under it. Move or delete ${count === 1 ? 'it' : 'them'} first.`,
    )
  }
  await deleteDoc(doc(db, 'categories', id))
}

export async function moveCategory(id, direction) {
  const list = await getCategories()
  const index = list.findIndex((c) => c.id === id)
  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || swapIndex < 0 || swapIndex >= list.length) return

  const a = list[index]
  const b = list[swapIndex]
  const batch = writeBatch(db)
  batch.update(doc(db, 'categories', a.id), { order: b.order })
  batch.update(doc(db, 'categories', b.id), { order: a.order })
  await batch.commit()
}
