import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { admin } from '@/config/site'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [error, setError] = useState('')

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  const login = useCallback(async (email, password) => {
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (err) {
      // First-ever login: bootstrap the admin account in Firebase Auth,
      // but only for the configured admin email — never for arbitrary input.
      if (err.code === 'auth/user-not-found' && email === admin.email) {
        try {
          await createUserWithEmailAndPassword(auth, email, password)
          return true
        } catch (bootstrapErr) {
          setError(bootstrapErr.message || 'Could not create admin account.')
          return false
        }
      }
      setError('Incorrect email or password.')
      return false
    }
  }, [])

  const logout = useCallback(() => signOut(auth), [])

  return (
    <AdminAuthContext.Provider value={{ isAuthed: !!user, authReady: user !== undefined, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
