import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateConfirmationCode(): string {
  // Generate a random 8-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLength = 8
  let code = ''
  
  // Add current timestamp to make it unique
  const timestamp = new Date().getTime().toString(36).toUpperCase()
  
  // Generate random characters
  for (let i = 0; i < codeLength - 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  // Add last 4 characters of timestamp to ensure uniqueness
  code += timestamp.slice(-4)
  
  // Format the code with a hyphen in the middle
  return `${code.slice(0, 4)}-${code.slice(4)}`
}
