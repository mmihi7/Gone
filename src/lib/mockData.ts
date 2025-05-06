export interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  timeLeftSeconds: number;
  imgUrl: string;
  imageUrls?: string[];  // New optional field for multiple images
  watching: number;
  claimed: number;
  upvotes: number;
  downvotes: number;
  verified: boolean;
  inventory: number;
  expiryDate?: Date;
  category?: 'Electronics' | 'Food' | 'Wearables' | 'Audio' | 'Groceries';
  isDamaged?: boolean;
  collectionLocation?: string;
  collectionTimeLimit?: number; // Hours
  vendorId?: string;
  terms?: string; // Deal collection terms
  comments?: string[];
}

export const getDiscountTier = (percentage: number): 'red' | 'orange' | 'green' => {
  if (percentage >= 65) return 'red';
  if (percentage >= 55) return 'orange';
  return 'green';
};

// Currency conversion rate (1 USD = 128.5 KSh)
const USD_TO_KSH_RATE = 128.5;

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Premium Wireless Noise-Cancelling Headphones',
    description: 'Experience crystal-clear audio with these premium wireless headphones featuring active noise cancellation and 30-hour battery life.',
    originalPrice: 299.99 * USD_TO_KSH_RATE,
    discountPrice: 89.99 * USD_TO_KSH_RATE,
    discountPercentage: 70,
    timeLeftSeconds: 263,
    imgUrl: "/mockImages/photo-1505740420928-5e560c06d30e.avif",
    watching: 1243,
    claimed: 486,
    upvotes: 89,
    downvotes: 12,
    verified: true,
    inventory: 142,
    collectionLocation: "Westlands, Nairobi",
    collectionTimeLimit: 48
  },
  {
    id: '2',
    title: 'Smart Fitness Watch with Heart Rate Monitor',
    description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS, and water-resistance up to 50m.',
    originalPrice: 199.99 * USD_TO_KSH_RATE,
    discountPrice: 79.99 * USD_TO_KSH_RATE,
    discountPercentage: 60,
    timeLeftSeconds: 541,
    imgUrl: "/mockImages/photo-1523275335684-37898b6baf30.avif",
    watching: 895,
    claimed: 327,
    upvotes: 62,
    downvotes: 8,
    verified: true,
    inventory: 87,
    collectionLocation: "Kilimani, Nairobi",
    collectionTimeLimit: 48
  },
  {
    id: '3',
    title: 'Ultra HD 4K Smart TV - 55"',
    description: 'Transform your home entertainment with this 55" 4K smart TV featuring HDR, built-in streaming apps, and voice control.',
    originalPrice: 799.99 * USD_TO_KSH_RATE,
    discountPrice: 349.99 * USD_TO_KSH_RATE,
    discountPercentage: 56,
    timeLeftSeconds: 1249,
    imgUrl: "/mockImages/photo-1678874941590-c5025f1b24a5.avif",
    watching: 2134,
    claimed: 952,
    upvotes: 145,
    downvotes: 23,
    verified: true,
    inventory: 36,
    collectionLocation: "Lavington, Nairobi",
    collectionTimeLimit: 48
  },
  {
    id: '4',
    title: 'Professional Espresso Coffee Machine',
    description: 'Brew barista-quality coffee at home with this professional-grade espresso machine with milk frother and customizable settings.',
    originalPrice: 499.99 * USD_TO_KSH_RATE,
    discountPrice: 279.99 * USD_TO_KSH_RATE,
    discountPercentage: 44,
    timeLeftSeconds: 3672,
    imgUrl: "/mockImages/photo-1461988279488-1dac181a78f9.avif",
    watching: 754,
    claimed: 198,
    upvotes: 57,
    downvotes: 14,
    verified: false,
    inventory: 62,
    collectionLocation: "Karen, Nairobi",
    collectionTimeLimit: 48
  },
  {
    id: '5',
    title: 'Waterproof Bluetooth Portable Speaker',
    description: 'Take your music anywhere with this waterproof portable speaker featuring 24-hour battery life and deep bass performance.',
    originalPrice: 129.99 * USD_TO_KSH_RATE,
    discountPrice: 49.99 * USD_TO_KSH_RATE,
    discountPercentage: 62,
    timeLeftSeconds: 892,
    imgUrl: "/mockImages/photo-1608043152269-423dbba4e7e1.avif",
    watching: 1876,
    claimed: 693,
    upvotes: 104,
    downvotes: 17,
    verified: true,
    inventory: 95,
    collectionLocation: "Westlands, Nairobi",
    collectionTimeLimit: 48
  },
  {
    id: '6',
    title: 'Fresh Fruits Combo Pack - Limited Time Offer',
    description: 'A selection of fresh seasonal fruits including mangoes, pineapples, and passion fruits. Perfect for a healthy snack or breakfast.',
    originalPrice: 15.99 * USD_TO_KSH_RATE,
    discountPrice: 6.99 * USD_TO_KSH_RATE,
    discountPercentage: 56,
    timeLeftSeconds: 178,
    imgUrl: "/mockImages/photo-1619566636858-adf3ef46400b.avif",
    watching: 437,
    claimed: 156,
    upvotes: 73,
    downvotes: 5,
    verified: true,
    inventory: 25,
    category: 'Food',
    expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    collectionLocation: "City Market, Nairobi",
    collectionTimeLimit: 24 // 24 hours for food
  }
];

export const isDealValid = (deal: Deal): boolean => {
  // Base discount requirement
  const baseDiscount = 35;
  
  // Food item special rules
  if (deal.category === 'Food' && deal.expiryDate) {
    const daysToExpiry = Math.ceil(
      (deal.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysToExpiry <= 14 && deal.discountPercentage < 65) return false;
    if (daysToExpiry <= 30 && deal.discountPercentage < 55) return false;
  }
  
  // Damaged product rules
  if (deal.isDamaged && deal.discountPercentage < 45) return false;
  
  return deal.discountPercentage >= baseDiscount;
};

export const getVerificationStatus = (deal: Deal) => {
  const upvoteThreshold = 60;
  
  if (deal.upvotes >= upvoteThreshold) {
    if (deal.upvotes >= 100) return "🔥 This is the MOJO!";
    if (deal.upvotes >= 80) return "⭐ Wow, this is a deal!";
    return "✓ Verified Deal";
  }
  
  return null;
};

export const getCollectionTimeLimit = (deal: Deal): number => {
  // Food items should be collected within 24 hours
  return deal.category === 'Food' ? 24 : 48;
};