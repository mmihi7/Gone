import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color spectrum for discount percentages
export function getDiscountColor(percentage: number): string {
  // Cold to hot color spectrum
  if (percentage >= 70) return 'bg-red-500 hover:bg-red-600'; // Hot (70%+)
  if (percentage >= 60) return 'bg-orange-500 hover:bg-orange-600'; // Very warm (60-69%)
  if (percentage >= 50) return 'bg-yellow-500 hover:bg-yellow-600'; // Warm (50-59%)
  if (percentage >= 40) return 'bg-green-500 hover:bg-green-600'; // Neutral (40-49%)
  return 'bg-blue-500 hover:bg-blue-600'; // Cold (below 40%)
}

// Text color for price display based on discount
export function getPriceColor(percentage: number): string {
  if (percentage >= 70) return 'text-red-500'; 
  if (percentage >= 60) return 'text-orange-500';
  if (percentage >= 50) return 'text-yellow-400';
  if (percentage >= 40) return 'text-green-500';
  return 'text-blue-400';
}
