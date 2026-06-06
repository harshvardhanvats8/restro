export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'south-indian' | 'north-indian' | 'beverages' | 'desserts' | 'all';
  tag?: string; // e.g., "Best Seller", "Chef's Special", "Authentic"
  spicedLevel?: 1 | 2 | 3;
  isVegetarian: boolean;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  stars: number;
  date: string;
  content: string;
  verified: boolean;
  source: string; // e.g., "Google Review", "Local Guide"
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  customization?: string;
}

export interface Reservation {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'dishes' | 'interiors' | 'family' | 'beverages' | 'specialties';
  image: string;
}
