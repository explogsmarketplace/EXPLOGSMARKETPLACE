import { cn } from '@/lib/utils'

export function Badge({ className, variant = 'gold', children, ...props }) {
  const variants = {
    gold: 'bg-gold-500/10 text-gold-300 border-gold-500/30',
    violet: 'bg-violet/10 text-violet-soft border-violet/30',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    muted: 'bg-white/5 text-white/60 border-white/10',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
