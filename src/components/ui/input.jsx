import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-lg border border-white/10 bg-midnight-700/50 px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/40 disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-24 w-full rounded-lg border border-white/10 bg-midnight-700/50 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-gold-400/60 focus:ring-1 focus:ring-gold-400/40 disabled:opacity-50',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export { Input, Textarea }
