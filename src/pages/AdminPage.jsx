import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'

function AdminGate() {
  const { isAuthed, authReady } = useAdminAuth()

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight text-white/40">
        Loading...
      </div>
    )
  }

  return isAuthed ? <AdminDashboard /> : <AdminLogin />
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminGate />
    </AdminAuthProvider>
  )
}
