// FoodLink+ Data Models - Complete specification

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  rating: number;
  distance: number;
  category: string;
  address: string;
  lat: number;
  lng: number;
  isVerified: boolean;
  isPopular: boolean;
  surpriseBags: SurpriseBag[]; // Keep compatibility with existing cart
  donations: Donation[];
}

export interface SurpriseBag {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  pickupStart: string;
  pickupEnd: string;
  stock: number;
  category: string;
  dietary?: string[];
}

export interface DonationItem {
  id: string;
  name: string;
  qtyAvailable: number;
  discountedPrice?: number;
}

export interface Donation {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  photoUrl: string;
  items: DonationItem[];
  totalPortions: number;
  remainingPortions: number;
  expiry: string; // ISO datetime
  pickupWindowStart: string;
  pickupWindowEnd: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  tags: string[]; // dietary tags
  createdAt: string;
}

export interface ReservationItem {
  itemId: string;
  qty: number;
}

export interface Reservation {
  reservationId: string;
  donationId: string;
  userId: string;
  itemsReserved: ReservationItem[];
  qtyTotal: number;
  pickupTime: string; // ISO
  status: 'reserved' | 'collected' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'restaurant';
  preferences: {
    dietary: string[];
    budget: 'low' | 'medium' | 'high';
    portionSize: 'small' | 'medium' | 'large';
  };
  walletBalance: number;
  privacyFlag: boolean;
  mealsSaved: number;
  co2Reduced: number;
  favorites: string[];
  createdAt: string;
}

export interface Rating {
  ratingId: string;
  restaurantId: string;
  userId: string;
  reservationId: string;
  score: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface CartItem {
  bagId: string;
  quantity: number;
}

// Mock data following the brief's seed data requirements
export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Rice & Co.",
    image: "/images/kitchen-food.jpg",
    logo: "/images/kitchen-logo.jpg",
    rating: 4.5,
    distance: 0.8,
    category: "Asian",
    address: "123 Main St, Houston, TX",
    lat: 29.7604,
    lng: -95.3698,
    isVerified: true,
    isPopular: false,
    surpriseBags: [
      {
        id: "bag-1",
        restaurantId: "1",
        title: "Surprise Bag",
        description: "Fresh salads, wraps, and seasonal dishes",
        originalPrice: 18.00,
        discountedPrice: 6.00,
        pickupStart: "12:00 PM",
        pickupEnd: "2:15 PM",
        stock: 2,
        category: "Meals",
        dietary: ["Vegetarian options"]
      }
    ],
    donations: [
      {
        id: "donation-1",
        restaurantId: "1",
        title: "10 Chicken Rice Bowls",
        description: "Fresh rice bowls with grilled chicken, vegetables, and sauce",
        photoUrl: "/images/kitchen-food.jpg",
        items: [
          { id: "item-1", name: "Chicken Rice Bowl", qtyAvailable: 8, discountedPrice: 1.00 },
          { id: "item-2", name: "Vegetarian Rice Bowl", qtyAvailable: 2, discountedPrice: 1.00 }
        ],
        totalPortions: 10,
        remainingPortions: 10,
        expiry: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        pickupWindowStart: "5:00 PM",
        pickupWindowEnd: "7:00 PM",
        location: {
          address: "123 Main St, Houston, TX",
          lat: 29.7604,
          lng: -95.3698
        },
        tags: ["vegetarian-options"],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "2",
    name: "Bao House",
    image: "/images/bakery-food.jpg",
    logo: "/images/bakery-logo.jpg",
    rating: 4.7,
    distance: 1.2,
    category: "Asian",
    address: "456 Oak Ave, Houston, TX",
    lat: 29.7505,
    lng: -95.3605,
    isVerified: false,
    isPopular: true,
    surpriseBags: [
      {
        id: "bag-2",
        restaurantId: "2",
        title: "Pastry Surprise",
        description: "Fresh croissants, muffins, and artisan breads",
        originalPrice: 15.00,
        discountedPrice: 5.00,
        pickupStart: "4:00 PM",
        pickupEnd: "6:00 PM",
        stock: 5,
        category: "Bread & pastries"
      }
    ],
    donations: [
      {
        id: "donation-2",
        restaurantId: "2",
        title: "6 Pork Buns",
        description: "Steamed pork buns with traditional filling",
        photoUrl: "/images/bakery-food.jpg",
        items: [
          { id: "item-3", name: "Pork Bun", qtyAvailable: 6, discountedPrice: 1.50 }
        ],
        totalPortions: 6,
        remainingPortions: 6,
        expiry: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours (urgent)
        pickupWindowStart: "3:00 PM",
        pickupWindowEnd: "4:30 PM",
        location: {
          address: "456 Oak Ave, Houston, TX",
          lat: 29.7505,
          lng: -95.3605
        },
        tags: [],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "3",
    name: "Green Garden",
    image: "/images/bistro-food.jpg",
    logo: "/images/bistro-logo.jpg",
    rating: 4.3,
    distance: 0.5,
    category: "Healthy",
    address: "789 Green St, Houston, TX",
    lat: 29.7704,
    lng: -95.3798,
    isVerified: true,
    isPopular: false,
    surpriseBags: [
      {
        id: "bag-3",
        restaurantId: "3",
        title: "Fresh Produce Mix",
        description: "Seasonal vegetables, fruits, and pantry items",
        originalPrice: 25.00,
        discountedPrice: 8.00,
        pickupStart: "5:00 PM",
        pickupEnd: "7:00 PM",
        stock: 3,
        category: "Groceries"
      }
    ],
    donations: [
      {
        id: "donation-3",
        restaurantId: "3",
        title: "12 Veg Salads",
        description: "Fresh vegetarian salads with seasonal ingredients",
        photoUrl: "/images/bistro-food.jpg",
        items: [
          { id: "item-4", name: "Garden Salad", qtyAvailable: 8, discountedPrice: 2.00 },
          { id: "item-5", name: "Caesar Salad", qtyAvailable: 4, discountedPrice: 2.50 }
        ],
        totalPortions: 12,
        remainingPortions: 12,
        expiry: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // tomorrow evening
        pickupWindowStart: "6:00 PM",
        pickupWindowEnd: "8:00 PM",
        location: {
          address: "789 Green St, Houston, TX",
          lat: 29.7704,
          lng: -95.3798
        },
        tags: ["vegetarian", "vegan", "gluten-free"],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "4",
    name: "Late Bites",
    image: "/images/market-food.jpg",
    logo: "/images/market-logo.jpg",
    rating: 4.1,
    distance: 2.1,
    category: "Sandwiches",
    address: "321 Night Ave, Houston, TX",
    lat: 29.7404,
    lng: -95.3898,
    isVerified: false,
    isPopular: false,
    surpriseBags: [],
    donations: [
      {
        id: "donation-4",
        restaurantId: "4",
        title: "20 Sandwiches",
        description: "Assorted deli sandwiches",
        photoUrl: "/images/market-food.jpg",
        items: [
          { id: "item-6", name: "Turkey Sandwich", qtyAvailable: 10, discountedPrice: 3.00 },
          { id: "item-7", name: "Veggie Sandwich", qtyAvailable: 10, discountedPrice: 2.50 }
        ],
        totalPortions: 20,
        remainingPortions: 15, // some unclaimed for fallback demo
        expiry: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // tonight 10 PM
        pickupWindowStart: "8:00 PM",
        pickupWindowEnd: "10:00 PM",
        location: {
          address: "321 Night Ave, Houston, TX",
          lat: 29.7404,
          lng: -95.3898
        },
        tags: ["vegetarian-options"],
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "5",
    name: "Campus Kitchen",
    image: "/images/flowers.jpg",
    logo: "/images/florist-logo.jpg",
    rating: 4.6,
    distance: 1.8,
    category: "Family Meals",
    address: "555 University Dr, Houston, TX",
    lat: 29.7304,
    lng: -95.3598,
    isVerified: true,
    isPopular: true,
    surpriseBags: [
      {
        id: "bag-5",
        restaurantId: "5",
        title: "Homestyle Meals",
        description: "Comfort food, soups, and hearty portions",
        originalPrice: 22.00,
        discountedPrice: 7.50,
        pickupStart: "11:30 AM",
        pickupEnd: "1:30 PM",
        stock: 4,
        category: "Meals"
      }
    ],
    donations: [
      {
        id: "donation-5",
        restaurantId: "5",
        title: "8 Family Meals",
        description: "Large family-style portions for 3-4 people each",
        photoUrl: "/images/flowers.jpg",
        items: [
          { id: "item-8", name: "Family Pasta", qtyAvailable: 4, discountedPrice: 8.00 },
          { id: "item-9", name: "Family Curry", qtyAvailable: 4, discountedPrice: 9.00 }
        ],
        totalPortions: 8,
        remainingPortions: 8,
        expiry: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours
        pickupWindowStart: "4:00 PM",
        pickupWindowEnd: "6:00 PM",
        location: {
          address: "555 University Dr, Houston, TX",
          lat: 29.7304,
          lng: -95.3598
        },
        tags: ["halal", "vegetarian-options"],
        createdAt: new Date().toISOString()
      }
    ]
  }
];

// Demo users per specification
export const mockUsers: User[] = [
  {
    id: "user-1",
    userId: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1234567890",
    role: "user",
    preferences: {
      dietary: ["vegetarian"],
      budget: "medium",
      portionSize: "medium"
    },
    walletBalance: 25.00,
    privacyFlag: false,
    mealsSaved: 47,
    co2Reduced: 23.5,
    favorites: ["1", "2", "5"],
    createdAt: new Date().toISOString()
  },
  {
    id: "user-2",
    userId: "user-2",
    name: "John Doe",
    email: "john@email.com",
    role: "user",
    preferences: {
      dietary: [],
      budget: "low",
      portionSize: "large"
    },
    walletBalance: 10.00,
    privacyFlag: true, // privacy flag example
    mealsSaved: 12,
    co2Reduced: 6.8,
    favorites: ["3"],
    createdAt: new Date().toISOString()
  },
  {
    id: "restaurant-1",
    userId: "restaurant-1",
    name: "Rice & Co. Manager",
    email: "manager@riceco.com",
    role: "restaurant",
    preferences: {
      dietary: [],
      budget: "medium",
      portionSize: "medium"
    },
    walletBalance: 0,
    privacyFlag: false,
    mealsSaved: 0,
    co2Reduced: 0,
    favorites: [],
    createdAt: new Date().toISOString()
  }
];

export const mockUser = mockUsers[0]; // Keep compatibility

// Helper function to get all donations
export const getAllDonations = (): Donation[] => {
  return mockRestaurants.flatMap(restaurant => restaurant.donations);
};

// Helper function to get donation by id
export const getDonationById = (id: string): Donation | undefined => {
  return getAllDonations().find(donation => donation.id === id);
};

// Helper function to get restaurant by id
export const getRestaurantById = (id: string): Restaurant | undefined => {
  return mockRestaurants.find(restaurant => restaurant.id === id);
};

// Dietary filter options
export const dietaryFilters = [
  "vegetarian",
  "vegan", 
  "halal",
  "kosher",
  "gluten-free",
  "nut-free"
];

// Categories for filtering
export const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "asian", name: "Asian", icon: "🍜" },
  { id: "healthy", name: "Healthy", icon: "🥗" },
  { id: "sandwiches", name: "Sandwiches", icon: "🥪" },
  { id: "family-meals", name: "Family Meals", icon: "🍝" }
];