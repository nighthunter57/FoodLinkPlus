export interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  rating: number;
  distance: number;
  category: string;
  surpriseBags: SurpriseBag[];
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

export interface User {
  id: string;
  name: string;
  email: string;
  mealsSaved: number;
  co2Reduced: number;
  favorites: string[];
}

export interface CartItem {
  bagId: string;
  quantity: number;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Green Garden Bistro",
    image: "/images/bistro-food.jpg",
    logo: "/images/bistro-logo.jpg",
    rating: 4.5,
    distance: 0.3,
    category: "Meals",
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
    ]
  },
  {
    id: "2",
    name: "Sunrise Bakery",
    image: "/images/bakery-food.jpg",
    logo: "/images/bakery-logo.jpg",
    rating: 4.8,
    distance: 0.7,
    category: "Bread & pastries",
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
    ]
  },
  {
    id: "3",
    name: "Ocean Fresh Market",
    image: "/images/market-food.jpg",
    logo: "/images/market-logo.jpg",
    rating: 4.2,
    distance: 1.2,
    category: "Groceries",
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
    ]
  },
  {
    id: "4",
    name: "Petal & Bloom Florist",
    image: "/images/flowers.jpg",
    logo: "/images/florist-logo.jpg",
    rating: 4.6,
    distance: 0.9,
    category: "Flowers",
    surpriseBags: [
      {
        id: "bag-4",
        restaurantId: "4",
        title: "Fresh Flower Bundle",
        description: "Mixed seasonal flowers and small plants",
        originalPrice: 20.00,
        discountedPrice: 7.00,
        pickupStart: "3:00 PM",
        pickupEnd: "5:00 PM",
        stock: 1,
        category: "Flowers"
      }
    ]
  },
  {
    id: "5",
    name: "Mama's Kitchen",
    image: "/images/kitchen-food.jpg",
    logo: "/images/kitchen-logo.jpg",
    rating: 4.7,
    distance: 2.1,
    category: "Meals",
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
    ]
  }
];

export const mockUser: User = {
  id: "user-1",
  name: "Sarah Chen",
  email: "sarah.chen@email.com",
  mealsSaved: 47,
  co2Reduced: 23.5,
  favorites: ["1", "2", "5"]
};

export const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "meals", name: "Meals", icon: "🍲" },
  { id: "bread-pastries", name: "Bread & pastries", icon: "🥐" },
  { id: "groceries", name: "Groceries", icon: "🛒" },
  { id: "flowers", name: "Flowers", icon: "🌸" }
];