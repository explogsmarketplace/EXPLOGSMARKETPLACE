export const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '2348022559002'

export function waLink(message) {
  const base = `https://wa.me/${whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

const rawBanks = [
  {
    name: import.meta.env.VITE_BANK_1_NAME,
    accountName: import.meta.env.VITE_BANK_1_ACCOUNT_NAME,
    accountNumber: import.meta.env.VITE_BANK_1_ACCOUNT_NUMBER,
  },
  {
    name: import.meta.env.VITE_BANK_2_NAME,
    accountName: import.meta.env.VITE_BANK_2_ACCOUNT_NAME,
    accountNumber: import.meta.env.VITE_BANK_2_ACCOUNT_NUMBER,
  },
]

export const banks = rawBanks.filter((b) => b.name && b.accountNumber)

if (banks.length === 0) {
  banks.push({
    name: 'Your Bank Name',
    accountName: 'Explogs Marketplace',
    accountNumber: '0000000000',
  })
}

export const bank = banks[0]

export const admin = {
  email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@explogs.com',
  password: import.meta.env.VITE_ADMIN_PASSWORD || 'change-me',
}

export const site = {
  name: 'Explogs Marketplace',
  tagline: 'Verified social media and digital accounts, delivered directly.',
}
