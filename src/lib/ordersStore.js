import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db, requireFirebase } from '@/lib/firebase'

function ordersCol() {
  return collection(db, 'orders')
}

export async function getOrders() {
  if (!db) return []
  const snap = await getDocs(query(ordersCol(), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function addOrder(order) {
  requireFirebase()
  const docRef = await addDoc(ordersCol(), {
    status: 'New',
    ...order,
    createdAt: serverTimestamp(),
  })
  return { id: docRef.id, ...order }
}

export async function updateOrderStatus(id, status) {
  requireFirebase()
  await updateDoc(doc(db, 'orders', id), { status })
}
