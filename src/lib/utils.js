import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  if (price === undefined || price === null || price === '') return null
  const num = Number(price)
  if (Number.isNaN(num)) return null
  return `₦${num.toLocaleString('en-NG')}`
}
