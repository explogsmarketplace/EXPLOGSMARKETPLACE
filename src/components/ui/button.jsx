import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
  {
    variants: {
      variant: {
        primary:
          'bg-gold-gradient bg-[length:200%_200%] text-midnight-950 shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[position:100%_0%] active:translate-y-0',
        outline:
          'border border-gold-500/40 text-gold-200 hover:border-gold-400 hover:bg-gold-500/10 hover:-translate-y-0.5 hover:scale-[1.02]',
        ghost: 'text-white/80 hover:text-white hover:bg-white/5',
        whatsapp:
          'bg-[#25D366] text-midnight-950 hover:brightness-110 hover:-translate-y-0.5 hover:scale-[1.02] shadow-[0_8px_30px_-8px_rgba(37,211,102,0.5)]',
        subtle: 'bg-midnight-700/60 text-white/90 hover:bg-midnight-600/70 border border-white/5',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }
