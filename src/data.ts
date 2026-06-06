import { Dish, Review, GalleryItem } from './types';

export const DISHES: Dish[] = [
  {
    id: '1',
    name: 'Paper Masala Dosa',
    description: 'Generously long, paper-thin, golden crispy rice-and-lentil crepe rolled with an aromatic, spiced potato-and-onion mash. Served with fresh coconut chutney, tomato-chilli chutney, and piping-hot vegetable sambar.',
    price: 185,
    category: 'south-indian',
    tag: 'Classic Legend',
    spicedLevel: 1,
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Paneer Masala Dosa',
    description: 'Crispy butter dosa loaded with a rich stuffing of grated cottage cheese, finely chopped coriander, and regional spices. A premium variation that merges soft paneer with a traditional crisp shell.',
    price: 210,
    category: 'south-indian',
    tag: 'Chef Choice',
    spicedLevel: 2,
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Rava Dosa',
    description: 'An ultra-crisp, lacy crepe prepared from semolina, rice flour, and house spices. Sprinkled liberally with crushed black pepper, toasted cumin, fresh ginger, and whole cashews.',
    price: 195,
    category: 'south-indian',
    tag: 'Authentic Touch',
    spicedLevel: 1,
    isVegetarian: true,
    import ravaDosa from '../assets/images/rava_dosa_premium_1780767624668.png';
  },
  {
    id: '4',
    name: 'Idli Vada Sambar Duo',
    description: 'The golden standard of comfort: Two soft as clouds steamed rice cakes paired with two crispy, savory lentil donuts. Includes our signatures: pure coconut chutney and slow-simmered regional sambar.',
    price: 135,
    category: 'south-indian',
    tag: 'Always Fresh',
    spicedLevel: 1,
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Uttapam (Onion & Tomato)',
    description: 'Thick, fluffy, savory griddle cakes made from fermented batter, generously topped with caramelized red onions, juicy vine tomatoes, fresh curry leaves, and green chillies.',
    price: 165,
    category: 'south-indian',
    tag: 'Fluffy Delight',
    spicedLevel: 1,
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Chole Bhature',
    description: 'A stellar North Indian specialty! Two massive, puffed-up, deep-fried leavened breads accompanied by a hearty, slow-cooked chickpeas curry rich with authentic Punjabi spices and pickled onions.',
    price: 195,
    category: 'north-indian',
    tag: 'Local Favorite',
    spicedLevel: 2,
    isVegetarian: true,
    import choleBhature from '../assets/images/chole_bhature_premium_1780767639364.png';
  },
  {
    id: '7',
    name: 'Pav Bhaji',
    description: 'Spiced vegetable mash, slowly cooked on a flat tawa with loads of premium butter and special spice blends. Served with two incredibly soft buns, toasted with fresh butter, chopped onions, and coriander.',
    price: 175,
    category: 'north-indian',
    tag: 'Sizzling Butter',
    spicedLevel: 2,
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    name: 'Veg Fried Rice',
    description: 'Perfectly-styled long grain basmati rice tossed with finely shredded spring onions, carrots, bell peppers, crunchy cabbage, and a dash of light soy sauce and premium oriental herbs.',
    price: 185,
    category: 'north-indian',
    tag: 'Quick Wok',
    spicedLevel: 1,
    isVegetarian: true,
    import vegFriedRice from '../assets/images/veg_fried_rice_premium_1780767653338.png';
  },
  {
    id: '9',
    name: 'Traditional Filter Coffee',
    description: 'An iconic South Indian brew, crafted by dripping hot water slowly through chicory-infused ground coffee beans, frothed perfectly from a distance with warm, creamy whole milk.',
    price: 80,
    category: 'beverages',
    tag: 'Aroma Peak',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    name: 'Royal Rasmalai (2 Pcs)',
    description: 'Soft, spongy cottage cheese discs soaked in sweetened, thickened milk delicately flavored with green cardamom, saffron strands, and garnished with premium slivered pistachios.',
    price: 110,
    category: 'desserts',
    tag: 'Royal Finish',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '11',
    name: 'Classic Vanilla Shake',
    description: 'Creamy, thick dairy shake made with cold-churned premium Madagascar vanilla bean ice cream and farm-fresh chilled milk, finished with whipped cream.',
    price: 140,
    category: 'beverages',
    tag: 'Cold Refreshment',
    isVegetarian: true,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800'
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Rajesh Kumar Mehta',
    stars: 5,
    date: 'May 14, 2026',
    content: "The Paper Masala Dosa here is truly a work of art. Exceptionally crispy, dry, and flavorful. The sambar has that perfect authentic tang. Bansi Vihar is a family legacy place in Patna that has maintained its taste for decades.",
    verified: true,
    source: 'Google Local Guide (Level 6)'
  },
  {
    id: 'r2',
    author: 'Anjali Sharma',
    stars: 5,
    date: 'April 29, 2026',
    content: 'We visited Fraser Road near Dak Bunglow for family shopping and dined here. Pure vegetarian standard at its best! Splendid service, child-friendly environment, and clean hygiene. Their Filter Coffee is a mandatory conclusion to the meal!',
    verified: true,
    source: 'Verified Diner'
  },
  {
    id: 'r3',
    author: 'Siddharth Sinha',
    stars: 5,
    date: 'April 02, 2026',
    content: 'Unmatched speed. Even during rush hours, the dosas are served piping hot in minutes. Outstanding family vibes and very pocket-friendly for the stellar quality they offer.',
    verified: true,
    source: ' Patna Foodies Guild'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Signature Paper Masala Dosa',
    category: 'dishes',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'g2',
    title: 'Lively Family Dining Area',
    category: 'interiors',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'g3',
    title: 'Warm Table Layout',
    category: 'interiors',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'g4',
    title: 'Generations Sharing Meals',
    category: 'family',
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'g5',
    title: 'Steaming Traditional Filter Coffee',
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'g6',
    title: 'Golden Crispy Vada and Soft Idli',
    category: 'specialties',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800'
  }
];
