import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Coffee, 
  Heart, 
  Sparkles, 
  Award, 
  Search, 
  ShoppingBag, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  X, 
  Utensils, 
  Smartphone, 
  Plus, 
  Minus, 
  Info, 
  Send, 
  MessageSquare,
  Flame,
  Check
} from 'lucide-react';
import { DISHES, REVIEWS, GALLERY_ITEMS } from './data';
import { Dish, Review, CartItem, Reservation, GalleryItem } from './types';

export default function App() {
  // Navigation & Category states
  const [activeTab, setActiveTab] = useState<'all' | 'south-indian' | 'north-indian' | 'beverages' | 'desserts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChefSpecials, setShowChefSpecials] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'dishes' | 'interiors' | 'family' | 'beverages' | 'specialties'>('all');

  // Customer reviews local state (allows writing memories)
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewSource, setNewReviewSource] = useState('Local Diner');
  const [newReviewSuccess, setNewReviewSuccess] = useState(false);

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartOrderOption, setCartOrderOption] = useState<'dine-in' | 'drive-through' | 'delivery' | 'takeaway'>('takeaway');
  const [cartSpecialNote, setCartSpecialNote] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'success'>('cart');
  const [lastOrderDetails, setLastOrderDetails] = useState<{ orderId: string; items: CartItem[]; total: number } | null>(null);

  // Table Reservation State
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('bansi_vihar_reservations');
    return saved ? JSON.parse(saved) : [];
  });
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('');
  const [resGuests, setResGuests] = useState(4);
  const [resNotes, setResNotes] = useState('');
  const [resSuccessInfo, setResSuccessInfo] = useState<{ code: string } | null>(null);

  // Active Review slideshow details
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Auto progression for reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviewsList.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [reviewsList.length]);

  // Is restaurant open calculator
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [patnaTime, setPatnaTime] = useState('');

  useEffect(() => {
    const checkRestaurantStatus = () => {
      const now = new Date();
      // UTC time offset for India (UTC+5.5)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + 3600000 * 5.5);
      
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      
      // Open between 8:00 AM (8h) and 11:00 PM (23h)
      const isOpen = hours >= 8 && hours < 23;
      setIsOpenNow(isOpen);
      
      const formattedTime = istTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      });
      setPatnaTime(formattedTime);
    };

    checkRestaurantStatus();
    const interval = setInterval(checkRestaurantStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sync reservations to local storage
  useEffect(() => {
    localStorage.setItem('bansi_vihar_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Handle Cart updates
  const addToCart = (dish: Dish) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      } else {
        return [...prevCart, { dish, quantity: 1 }];
      }
    });
    // Shake effect trigger or simple open
    setIsCartOpen(true);
  };

  const updateCartQuantity = (dishId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.dish.id === dishId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.dish.id !== dishId));
  };

  // Pricing Helpers
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.dish.price * item.quantity), 0);
  const taxGSTGst = Math.round(cartSubtotal * 0.05); // 5% GST
  const serviceCharge = cartOrderOption === 'delivery' ? 30 : 0; // Free for takeaway/dine-in
  const discountCoupon = cartSubtotal > 500 ? Math.round(cartSubtotal * 0.1) : 0; // 10% off above ₹500
  const cartTotal = cartSubtotal > 0 ? (cartSubtotal + (taxGSTGst * 2) + serviceCharge - discountCoupon) : 0;

  // Submit Order Mock API
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    const randomId = 'BV-' + Math.floor(100000 + Math.random() * 900000);
    setLastOrderDetails({
      orderId: randomId,
      items: [...cart],
      total: cartTotal
    });
    setCheckoutStep('success');
    setCart([]); // Clear cart
  };

  // Submit Table booking
  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resName || !resPhone || !resDate || !resTime) return;

    const reservationCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    const newRes: Reservation = {
      name: resName,
      phone: resPhone,
      email: resEmail,
      date: resDate,
      time: resTime,
      guests: resGuests,
      specialRequests: resNotes
    };

    setReservations((prev) => [newRes, ...prev]);
    setResSuccessInfo({ code: reservationCode });

    // Clear Form
    setResName('');
    setResPhone('');
    setResEmail('');
    setResDate('');
    setResTime('');
    setResNotes('');
  };

  const cancelReservation = (index: number) => {
    setReservations((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Review Memory
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewContent) return;

    const newRev: Review = {
      id: 'r_user_' + Date.now(),
      author: newReviewAuthor,
      stars: newReviewRating,
      date: 'Today',
      content: newReviewContent,
      verified: true,
      source: newReviewSource || 'Verified Patron'
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setNewReviewAuthor('');
    setNewReviewContent('');
    setNewReviewRating(5);
    setNewReviewSuccess(true);
    setActiveReviewIdx(0);

    setTimeout(() => setNewReviewSuccess(false), 5000);
  };

  // Filter dishes
  const filteredDishes = DISHES.filter((dish) => {
    const matchesTab = activeTab === 'all' || dish.category === activeTab;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecial = !showChefSpecials || (dish.tag !== undefined);
    
    return matchesTab && matchesSearch && matchesSpecial;
  });

  // Filter gallery items
  const filteredGallery = galleryFilter === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === galleryFilter);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1C1C] font-sans antialiased selection:bg-[#C89B3C] selection:text-white">
      
      {/* 1. STICKY TOP BRANDING HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F8F5EF] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-[#183A2E] flex items-center justify-center border border-[#C89B3C]">
                <span className="text-[#C89B3C] font-serif font-bold text-lg">B</span>
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-tight text-[#183A2E] group-hover:text-[#C89B3C] transition-colors leading-none">
                  Bansi Vihar
                </span>
                <span className="block text-[10px] tracking-widest text-[#C89B3C] uppercase font-semibold mt-0.5">
                  South Indian Legacy
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#1C1C1C]">
              <a href="#about" className="hover:text-[#C89B3C] transition-colors">Why Bansi Vihar</a>
              <a href="#menu" className="hover:text-[#C89B3C] transition-colors">Our Menu</a>
              <a href="#legacy" className="hover:text-[#C89B3C] transition-colors">Our Heritage</a>
              <a href="#reviews" className="hover:text-[#C89B3C] transition-colors">Memories</a>
              <a href="#gallery" className="hover:text-[#C89B3C] transition-colors">Gallery</a>
              <a href="#convenience" className="hover:text-[#C89B3C] transition-colors">Order Online</a>
              <a href="#address" className="hover:text-[#C89B3C] transition-colors">Location</a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Patna Status Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-full bg-[#FAFAF8] border border-[#F8F5EF] text-xs">
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                <span className="text-gray-600 font-medium">
                  {isOpenNow ? 'Open Now (Patna)' : 'Closed Now'}
                </span>
              </div>

              {/* Shopping Cart Button */}
              <button 
                id="cart-toggle-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-[#F8F5EF] text-[#183A2E] hover:bg-[#183A2E] hover:text-[#F8F5EF] transition-all cursor-pointer"
                title="View Order Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C89B3C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Table Booking CTA */}
              <a 
                href="#reserve"
                className="hidden sm:inline-flex items-center justify-center px-5 h-11 rounded-full bg-[#183A2E] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#C89B3C] hover:text-white transition-all shadow-sm"
              >
                Reserve Table
              </a>
            </div>

          </div>
        </div>
      </header>

      {/* 2. HERO HEADER SECTION */}
      <section className="relative overflow-hidden bg-[#183A2E] text-white py-16 lg:py-24">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 bg-black/60 opacity-90"></div>
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=1920" 
            alt="Cinematic Crispy Dosa banner" 
            className="w-full h-full object-cover grayscale-1/5"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Pre-title Heritage Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs uppercase tracking-widest font-semibold">
                <Award className="w-4.5 h-4.5 text-[#C89B3C]" />
                Patna's Food Pride since Generations
              </div>

              {/* Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Patna's Most Loved <span className="italic block mt-1 text-[#C89B3C]">South Indian</span> Restaurant
              </h1>

              {/* Subheadline */}
              <p className="text-[#F8F5EF]/90 text-base sm:text-lg max-w-lg leading-relaxed">
                Serving authentic South Indian delicacies, flavorful pure vegetarian cuisine, and memorable dining experiences in the heart of Patna since generations.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/15">
                    <Star className="w-5 h-5 fill-[#C89B3C] text-[#C89B3C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-sm leading-none">4.1 Rating</span>
                    <span className="text-[10px] text-white/60">On Google Maps</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/15">
                    <CheckCircle2 className="w-5 h-5 text-[#C89B3C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-sm leading-none">9,600+ Reviews</span>
                    <span className="text-[10px] text-white/60">Satisfied Guests</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="p-1.5 rounded-lg bg-white/15">
                    <MapPin className="w-5 h-5 text-[#C89B3C]" />
                  </div>
                  <div>
                    <span className="block font-bold text-sm leading-none">Fraser Road</span>
                    <span className="text-[10px] text-white/60">Dak Bunglow, Patna</span>
                  </div>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <a 
                  id="hero-menu-cta"
                  href="#menu" 
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#C89B3C] font-semibold text-white uppercase text-xs tracking-wider hover:bg-white hover:text-[#183A2E] transition-all shadow-md group"
                >
                  <Utensils className="w-4 h-4" />
                  Explore Full Menu
                </a>
                <a 
                  id="hero-reserve-cta"
                  href="#reserve" 
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 font-semibold text-white uppercase text-xs tracking-wider hover:bg-[#F8F5EF] hover:text-[#183A2E] transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#C89B3C]" />
                  Reserve a Table
                </a>
              </div>

              {/* Floating Quick Action Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="text-white/60 text-xs mr-1 font-medium">Dining Options:</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">🚗 Drive-Through available</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">🛵 Delivery Ready</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">🛍️ Takeaway</span>
              </div>
            </motion.div>

            {/* Right Interactive Highlights Column */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pl-8"
            >
              <div className="bg-[#183A2E]/80 backdrop-blur-md rounded-2xl p-6 border border-[#C89B3C]/30 space-y-6">
                <div className="pb-4 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <span className="block font-serif text-xl font-bold text-white">Live Kitchen Special</span>
                    <span className="text-xs text-[#C89B3C] font-semibold tracking-wide uppercase">Generosity of South Indian taste</span>
                  </div>
                  <Coffee className="w-6 h-6 text-[#C89B3C]" />
                </div>

                {/* Micro Dish Spotlight Card */}
                <div className="relative group overflow-hidden rounded-xl bg-black/30 border border-white/10 p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=300" 
                      alt="Paper Dosa close up" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-block text-[9px] font-bold bg-[#C89B3C] text-[#183A2E] px-2 py-0.5 rounded-full uppercase">Must Try</span>
                    <h3 className="font-serif font-bold text-base text-white">Legendary Paper Masala Dosa</h3>
                    <p className="text-xs text-white/70 line-clamp-2">Crisp outer crepe, rich slow spiced potatoes, savory steaming pure Indian sambar.</p>
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="text-sm font-bold text-[#C89B3C]">₹185</span>
                      <button 
                        onClick={() => addToCart(DISHES[0])}
                        className="text-[10px] font-bold uppercase tracking-wide bg-white text-[#183A2E] hover:bg-[#C89B3C] hover:text-white px-3 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        + Quick Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Immediate Dynamic Dial-in */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a 
                    href="tel:06122224804" 
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/50 border border-emerald-500/20 text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#C89B3C]" />
                    <span className="text-xs font-semibold">Call Now</span>
                  </a>
                  <a 
                    href="#address" 
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-700/30 hover:bg-amber-700/50 border border-amber-500/20 text-white transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-[#C89B3C]" />
                    <span className="text-xs font-semibold">Get Directions</span>
                  </a>
                </div>

                {/* Realtime operational warning banner */}
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex gap-3 text-xs text-white/80">
                  <Clock className="w-5 h-5 text-[#C89B3C] shrink-0" />
                  <div>
                    <span className="block font-semibold">Today's Hours: 8:00 AM – 11:00 PM</span>
                    <span className="opacity-75">Serving Breakfast, Lunch, and Festive Dinners in Patna.</span>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. WHY PEOPLE LOVE BANSI VIHAR SECTION */}
      <section id="about" className="py-20 bg-[#F8F5EF]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Centered Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase">The Heritage of Trust</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#183A2E]">
              Why Patna Generations Love Us
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Consistent preparation, traditional formulas, and uncompromising hygiene for over decades on Fraser Road.
            </p>
            <div className="w-16 h-1 bg-[#C89B3C] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Grid Layout of 6 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl border border-[#F8F5EF] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#183A2E]/5 flex items-center justify-center mb-6 group-hover:bg-[#183A2E] transition-all">
                <Sparkles className="w-6 h-6 text-[#C89B3C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#183A2E] mb-3">
                Authentic South Indian Recipes
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Prepared using secret family spice blends, original stone-grinding processes, and fresh ingredients imported from certified plantations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl border border-[#F8F5EF] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#183A2E]/5 flex items-center justify-center mb-6 group-hover:bg-[#183A2E] transition-all">
                <Award className="w-6 h-6 text-[#C89B3C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#183A2E] mb-3">
                Trusted by Thousands
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                With a sparkling 4.1 Rating and 9,600+ Google Reviews, we stand as one of Patna’s most recognized and celebrated culinary landmark.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl border border-[#F8F5EF] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#183A2E]/5 flex items-center justify-center mb-6 group-hover:bg-[#183A2E] transition-all">
                <Heart className="w-6 h-6 text-[#C89B3C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#183A2E] mb-3">
                Family-Friendly Ambience
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Spacious table layouts, welcoming stewards, safety-certified children chairs, and a serene, non-intrusive environment for beautiful family times.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-xl border border-[#F8F5EF] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#183A2E]/5 flex items-center justify-center mb-6 group-hover:bg-[#183A2E] transition-all">
                <Clock className="w-6 h-6 text-[#C89B3C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#183A2E] mb-3">
                Lightning Quick Service
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our high-performance kitchen line ensures your idli, crispy dosas, and fresh filter coffee reach your table steaming hot within moments.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-xl border border-[#F8F5EF] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#183A2E]/5 flex items-center justify-center mb-6 group-hover:bg-[#183A2E] transition-all">
                <CheckCircle2 className="w-6 h-6 text-[#C89B3C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#183A2E] mb-3">
                Pure Vegetarian Excellence
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                100% pure vegetarian. Zero compromise on hygiene. Dedicated utensils, fresh local farm veggies, and zero synthetic taste enhancers.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-xl border border-[#F8F5EF] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-lg bg-[#183A2E]/5 flex items-center justify-center mb-6 group-hover:bg-[#183A2E] transition-all">
                <MapPin className="w-6 h-6 text-[#C89B3C]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#183A2E] mb-3">
                Convenient Dining Options
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Whether you prefer comforting dine-in seating, contactless drive-through pickup, home delivery, or takeaway packaging, we have you covered.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SIGNATURE DISHES SHOWCASE & FILTER MENU */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase">Gastronomic Craft</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#183A2E]">
                Signature Dishes & Menu
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-xl">
                Explore local favorite vegetarian classics hand-curated by our legacy chefs. Tap on items to build your takeaway or dining sequence.
              </p>
            </div>

            {/* Chef Special Switched */}
            <div className="flex items-center gap-3">
              <label htmlFor="bestseller-filter" className="text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                🔥 Chef's Best Sellers Only
              </label>
              <button 
                id="bestseller-filter"
                onClick={() => setShowChefSpecials(!showChefSpecials)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${showChefSpecials ? 'bg-[#C89B3C]' : 'bg-gray-300'}`}
                aria-label="Filter best sellers only"
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showChefSpecials ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Category Tabs & Interactive search */}
          <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#F8F5EF] mb-10 space-y-4">
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Tabs list */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {[
                  { value: 'all', label: 'All Items' },
                  { value: 'south-indian', label: 'South Indian' },
                  { value: 'north-indian', label: 'North Indian' },
                  { value: 'beverages', label: 'Beverages' },
                  { value: 'desserts', label: 'Desserts' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as any)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer uppercase ${
                      activeTab === tab.value 
                        ? 'bg-[#183A2E] text-white shadow-xs' 
                        : 'bg-white text-gray-700 hover:bg-[#F8F5EF] border border-gray-200/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Live search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search dosa, idli, coffee, shake..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-sm pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Dishes Grid */}
          {filteredDishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredDishes.map((dish) => (
                  <motion.div
                    layout
                    key={dish.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-[#FAFAF8] rounded-2xl overflow-hidden border border-[#F8F5EF] hover:border-[#C89B3C]/30 shadow-xs hover:shadow-md transition-all flex flex-col h-full"
                  >
                    {/* Image space */}
                    <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-gray-100">
                      <img 
                        src={dish.image} 
                        alt={dish.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Floating tag */}
                      {dish.tag && (
                        <span className="absolute top-3 left-3 bg-[#183A2E] text-[#C89B3C] border border-[#C89B3C] text-[10px] tracking-widest font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                          {dish.tag}
                        </span>
                      )}

                      {/* Spice indicator */}
                      {dish.spicedLevel && (
                        <div className="absolute top-3 right-3 bg-red-600/95 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                          <Flame className="w-3 h-3 fill-white" />
                          <span>{dish.spicedLevel === 3 ? 'Spicy' : 'Classic'}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-serif font-bold text-lg text-[#183A2E] group-hover:text-[#C89B3C] transition-colors leading-tight">
                            {dish.name}
                          </h3>
                          <span className="font-serif font-bold text-[#C89B3C] text-lg select-all">
                            ₹{dish.price}
                          </span>
                        </div>

                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {dish.description}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold uppercase">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Pure Veg</span>
                        </div>

                        {/* Interactive cart add counter action */}
                        {cart.find((item) => item.dish.id === dish.id) ? (
                          <div className="flex items-center bg-[#183A2E] text-white rounded-full p-1 border border-[#C89B3C]">
                            <button 
                              onClick={() => updateCartQuantity(dish.id, -1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-transform cursor-pointer"
                              aria-label="Decrease item quantity"
                            >
                              <Minus className="w-3.5 h-3.5 text-white" />
                            </button>
                            <span className="px-3 text-xs font-bold leading-none select-none">
                              {cart.find((item) => item.dish.id === dish.id)?.quantity}
                            </span>
                            <button 
                              onClick={() => updateCartQuantity(dish.id, 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-transform cursor-pointer"
                              aria-label="Increase item quantity"
                            >
                              <Plus className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(dish)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#183A2E] text-[#183A2E] hover:bg-[#183A2E] hover:text-[#F8F5EF] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer group-hover:bg-[#183A2E] group-hover:text-white"
                          >
                            Add to Order
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16 bg-[#FAFAF8] rounded-2xl border border-[#F8F5EF] max-w-lg mx-auto">
              <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-[#183A2E] font-serif font-bold text-lg">No Dishes matched your criteria</p>
              <p className="text-gray-500 text-xs mt-1">Try modifying your search or picking another filter tab.</p>
              <button 
                onClick={() => { setActiveTab('all'); setSearchQuery(''); setShowChefSpecials(false); }}
                className="mt-4 px-4 py-2 bg-[#183A2E] text-white text-xs font-semibold rounded-full uppercase cursor-pointer hover:bg-[#C89B3C]"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* CTA below menu */}
          <div className="text-center mt-12">
            <p className="text-xs text-gray-500 italic mb-4">
              * GST at 5% applies. Order values above ₹500 unlock a flat 10% discount coupon automatically!
            </p>
            <button 
              onClick={() => {
                sessionStorage.setItem('full_menu_pdf', 'mock');
                alert('Downloading official menu card - Bansi Vihar Patna. (Mock action success)');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 font-medium text-xs text-[#1C1C1C] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Download Printable Menu (PDF)</span>
            </button>
          </div>

        </div>
      </section>

      {/* 5. STORY AND LEGACY SECTION */}
      <section id="legacy" className="py-20 bg-[#183A2E] text-white relative overflow-hidden">
        
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Columns with classy borders */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#C89B3C] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" 
                  alt="Patna Bansi Vihar interior heritage legacy" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Overlaid vintage badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#C89B3C] text-[#183A2E] p-6 rounded-xl border-2 border-white font-serif max-w-xs shadow-2xl hidden sm:block">
                <span className="block text-4xl font-bold leading-non">30+</span>
                <span className="block text-xs uppercase font-extrabold tracking-widest mt-1">Years of Consistency & Family Bonding in Patna</span>
              </div>
            </div>

            {/* Stories context column */}
            <div className="space-y-6 lg:pl-6">
              <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase block">Our Heritage Story</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                A Landmark Dining Experience on Fraser Road
              </h2>
              
              <div className="w-16 h-1 bg-[#C89B3C]"></div>

              <div className="space-y-4 text-[#F8F5EF]/90 text-sm sm:text-base leading-relaxed">
                <p>
                  For years, <strong className="text-white">Bansi Vihar</strong> has acted as the spiritual culinary sanctuary of South Indian flavors in Bihar. Established with a single motive—to introduce authentic, high-quality vegetarian delicacies to Patna—the restaurant has faithfully served generations of diners at our iconic campus bordering Fraser Road.
                </p>
                <p>
                  We are not just a business; Bansi Vihar is memory. From high school students sharing their first pocket money over a colossal paper dosa, to grandparents hosting quiet Sunday morning family assemblies, the dining tables have observed it all.
                </p>
                <p>
                  Our recipe for legacy is simple: hand-picked black lentils fermented over 12 strict hours, copper hot-plates calibrated precisely to deliver the absolute finest golden crunch, coconut chutney mixed afresh every 4 hours, and frothed chicory coffee poured with utmost devotion.
                </p>
              </div>

              {/* Founder quote */}
              <blockquote className="border-l-4 border-[#C89B3C] pl-4 py-2 italic text-sm text-[#F8F5EF]/85 bg-white/5 rounded-r-lg">
                "We don't cook for customers; we cook for family whom we have had the honor of welcoming back week after week, from generation to generation."
                <cite className="block text-xs font-semibold text-[#C89B3C] uppercase tracking-wider not-italic mt-2">— The Kitchen Masters, Bansi Vihar</cite>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS & MEMORY SHARING BOARD */}
      <section id="reviews" className="py-20 bg-[#F8F5EF]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase">Community Voice</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#183A2E]">
              Generations of Stories & Reviews
            </h2>
            <p className="text-gray-600 text-sm">
              We take pride in maintaining uncompromised quality. Here are sincere snippets of feedback from our actual guests.
            </p>
            <div className="w-16 h-1 bg-[#C89B3C] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Slideshow Carousel (8 cols) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-[#F8F5EF] shadow-xs relative">
              
              <div className="absolute top-6 right-6 text-yellow-500 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <span className="text-[#C89B3C] font-serif text-6xl block select-none leading-none -mt-4">“</span>

              <div className="min-h-[140px] flex items-center">
                <p className="text-gray-700 italic text-base sm:text-lg leading-relaxed font-serif">
                  {reviewsList[activeReviewIdx].content}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-[#183A2E] text-base">{reviewsList[activeReviewIdx].author}</span>
                  <span className="text-xs text-[#C89B3C] font-semibold">{reviewsList[activeReviewIdx].source}</span>
                </div>
                <span className="text-xs text-gray-400">{reviewsList[activeReviewIdx].date}</span>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {reviewsList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReviewIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      activeReviewIdx === i ? 'bg-[#183A2E] w-6' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Navigation Indicators */}
              <div className="flex items-center gap-2 absolute bottom-6 right-6">
                <button 
                  onClick={() => setActiveReviewIdx((prev) => (prev - 1 + reviewsList.length) % reviewsList.length)}
                  className="p-1.5 rounded-full bg-gray-50 border border-gray-100 text-[#183A2E] hover:bg-[#183A2E] hover:text-white transition-colors cursor-pointer"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveReviewIdx((prev) => (prev + 1) % reviewsList.length)}
                  className="p-1.5 rounded-full bg-gray-50 border border-gray-100 text-[#183A2E] hover:bg-[#183A2E] hover:text-white transition-colors cursor-pointer"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Right Share Memory Form (5 cols) */}
            <div className="lg:col-span-5 bg-[#183A2E] rounded-2xl p-6 sm:p-8 text-white border border-[#C89B3C]/20 shadow-xl">
              <h3 className="font-serif text-xl font-bold mb-2 text-[#C89B3C]">
                Share Your Bansi Vihar Memory
              </h3>
              <p className="text-xs text-[#F8F5EF]/80 mb-6">
                Loved our food? Leave your star rating and write down your favorite legacy menu highlight, we print special feedback on our offline menu boxes!
              </p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Author */}
                <div>
                  <label htmlFor="rev-author" className="block text-[10px] uppercase tracking-wider font-semibold opacity-75 mb-1.5">
                    Your Name (Patna Diner)
                  </label>
                  <input 
                    id="rev-author"
                    type="text" 
                    required
                    placeholder="Enter Rajesh, Kavita, etc." 
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 text-xs rounded-lg px-3 py-2.5"
                  />
                </div>

                {/* Star rating selector */}
                <div>
                  <label htmlFor="rev-rating" className="block text-[10px] uppercase tracking-wider font-semibold opacity-75 mb-1.5">
                    Rating (Stars)
                  </label>
                  <select 
                    id="rev-rating"
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-[#183A2E] text-white border border-white/20 text-xs rounded-lg px-3 py-2.5"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Good Trial)</option>
                  </select>
                </div>

                {/* Source tag */}
                <div>
                  <label htmlFor="rev-source" className="block text-[10px] uppercase tracking-wider font-semibold opacity-75 mb-1.5">
                    Diner Type
                  </label>
                  <input 
                    id="rev-source"
                    type="text" 
                    placeholder="e.g., Local Patna Guide, Weekend Family Diner" 
                    value={newReviewSource}
                    onChange={(e) => setNewReviewSource(e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 text-xs rounded-lg px-3 py-2.5"
                  />
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="rev-desc" className="block text-[10px] uppercase tracking-wider font-semibold opacity-75 mb-1.5">
                    Your Genuine Story
                  </label>
                  <textarea 
                    id="rev-desc"
                    required
                    rows={3}
                    placeholder="State your favorite dish highlight, the crispy dosa texture, cold filter coffee, or overall dining experience..." 
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    className="w-full bg-white/10 text-white border border-white/20 text-xs rounded-lg p-3"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#C89B3C] text-white text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-white hover:text-[#183A2E] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Publish Live Story
                </button>

                {newReviewSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-emerald-800/60 border border-emerald-500 rounded-lg text-xs text-center text-emerald-200 mt-2"
                  >
                    🎉 High stars added! Your authentic memory published instantly above. Thank you for supporting Patna’s local dining heritage!
                  </motion.div>
                )}

              </form>

            </div>

          </div>

          {/* Social Proof Stats Counter row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-gray-200 text-center">
            <div>
              <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-[#183A2E] leading-none">9,600+</span>
              <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold block mt-1">Verified Google Reviews</span>
            </div>
            <div>
              <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-[#183A2E] leading-none">3 Lakh+</span>
              <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold block mt-1">Crisp Dosas Served</span>
            </div>
            <div>
              <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-[#183A2E] leading-none">98.4%</span>
              <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold block mt-1">Diner Satification Rate</span>
            </div>
            <div>
              <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-[#183A2E] leading-none">1990s</span>
              <span className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold block mt-1">Serving the Taste Landmark</span>
            </div>
          </div>

        </div>
      </section>

      {/* 7. DINING GALLERY (Masonry Filterable Layout) */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase">The Visual Vibe</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#183A2E]">
              Dining Experience Gallery
            </h2>
            <p className="text-gray-600 text-sm">
              Take a visual tour around Bansi Vihar. Admire the high-end crisped specialties, family lounge spaces, frothed filter coffee, and custom service setup.
            </p>
            <div className="w-16 h-1 bg-[#C89B3C] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Gallery categories navigation pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { value: 'all', label: 'All Photos' },
              { value: 'dishes', label: 'Signature Dishes' },
              { value: 'interiors', label: 'Interiors / Ambience' },
              { value: 'family', label: 'Family Dining' },
              { value: 'beverages', label: 'Filter Coffee & Drinks' },
              { value: 'specialties', label: 'South Indian Specialties' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setGalleryFilter(tab.value as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase cursor-pointer ${
                  galleryFilter === tab.value 
                    ? 'bg-[#183A2E] text-white shadow-xs' 
                    : 'bg-[#FAFAF8] text-gray-600 hover:bg-[#F8F5EF] border border-[#F8F5EF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Masonry Items Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 cursor-pointer shadow-xs hover:shadow-lg transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Absolute subtle elegant hover overlay */}
                  <div className="absolute inset-0 bg-[#183A2E]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-[#C89B3C] text-[10px] uppercase font-bold tracking-widest block mb-1">
                      {item.category.replace('-', ' ')}
                    </span>
                    <h4 className="font-serif text-white font-bold text-lg leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-white/60 text-[10px] block mt-2 font-mono uppercase">
                      Bansi Vihar Patna
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 8. ONLINE ORDERING & USER CONVENIENCE MODAL / SPLIT */}
      <section id="convenience" className="py-20 bg-[#F8F5EF]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Pitch Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase">Pristine Convenience</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#183A2E] leading-tight">
                Fresh Vegetarian Wonders, Delivered to Your Terms
              </h2>
              <div className="w-16 h-1 bg-[#C89B3C]"></div>
              
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Enjoyed Bansi Vihar's spectacular South Indian specialties directly in our premium dining hall, or enjoy it from the comfort of your bedroom or vehicle!
              </p>

              {/* List of 4 dining modes */}
              <div className="space-y-4 pt-2">
                
                <div className="flex gap-4 p-4 rounded-xl bg-white border border-[#F8F5EF]">
                  <div className="w-10 h-10 rounded-full bg-[#183A2E]/5 text-[#C89B3C] flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5 text-[#C89B3C]" />
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-base text-[#183A2E]">Comfortable Dine-In</span>
                    <span className="text-gray-500 text-xs leading-relaxed block mt-0.5">
                      Stellar seating, peaceful acoustics, family tables, and instant waiter assistance.
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-white border border-[#F8F5EF]">
                  <div className="w-10 h-10 rounded-full bg-[#183A2E]/5 text-[#C89B3C] flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-[#C89B3C]" />
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-base text-[#183A2E]">Contactless Drive-Through / Pick-up</span>
                    <span className="text-gray-500 text-xs leading-relaxed block mt-0.5">
                      Order ahead, slide through Marwari Campus/Fraser Road, and our staff hands the crisp packet straight into your car.
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-xl bg-white border border-[#F8F5EF]">
                  <div className="w-10 h-10 rounded-full bg-[#183A2E]/5 text-[#C89B3C] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-[#C89B3C]" />
                  </div>
                  <div>
                    <span className="block font-serif font-bold text-base text-[#183A2E]">Instant Takeaway Packages</span>
                    <span className="text-gray-500 text-xs leading-relaxed block mt-0.5">
                      Steam-retention, biodegradable, triple-sealed boxes ensuring crisp dosas or hot sambar never leaks or loses texture.
                    </span>
                  </div>
                </div>

              </div>

              {/* Primary Call to Action */}
              <div className="pt-4">
                <a 
                  href="#menu"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#183A2E] text-[#F8F5EF] text-xs font-bold uppercase tracking-wider hover:bg-[#C89B3C] hover:text-white transition-all shadow-sm"
                >
                  <Utensils className="w-4 h-4" />
                  Order Your Favorite Meal
                </a>
              </div>

            </div>

            {/* Right Quick Interactive Simulator Mock / Booking list (7 cols) */}
            <div id="reserve" className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-10 border border-[#F8F5EF] shadow-lg">
              
              <div className="pb-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-[#C89B3C] text-[10px] uppercase font-bold tracking-widest block mb-0.5">Secure Booking</span>
                  <h3 className="font-serif text-2xl font-bold text-[#183A2E]">
                    Reserve a Legacy Table
                  </h3>
                </div>
                {reservations.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    ✓ {reservations.length} Active Bookings
                  </span>
                )}
              </div>

              {/* Form schema */}
              <form onSubmit={handleReserveSubmit} className="space-y-6 pt-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="res-name-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input 
                      id="res-name-input"
                      type="text" 
                      required 
                      placeholder="e.g., Harsha Vardhan"
                      value={resName} 
                      onChange={(e) => setResName(e.target.value)}
                      className="w-full bg-[#FAFAF8] text-sm px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="res-phone-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Phone Number (Patna) *
                    </label>
                    <input 
                      id="res-phone-input"
                      type="tel" 
                      required 
                      placeholder="e.g., +91 94311 XXXXX"
                      value={resPhone}
                      onChange={(e) => setResPhone(e.target.value)}
                      className="w-full bg-[#FAFAF8] text-sm px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Date */}
                  <div>
                    <label htmlFor="res-date-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Preferred Date *
                    </label>
                    <input 
                      id="res-date-input"
                      type="date" 
                      required 
                      value={resDate}
                      onChange={(e) => setResDate(e.target.value)}
                      className="w-full bg-[#FAFAF8] text-sm px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>

                  {/* Time slots */}
                  <div>
                    <label htmlFor="res-time-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Preferred Seating Time *
                    </label>
                    <select 
                      id="res-time-input"
                      required
                      value={resTime}
                      onChange={(e) => setResTime(e.target.value)}
                      className="w-full bg-[#FAFAF8] text-sm px-4 py-3 rounded-xl border border-gray-200 text-gray-700"
                    >
                      <option value="">Select a slot</option>
                      <option value="08:30 AM">08:30 AM (South Indian Breakfast)</option>
                      <option value="11:30 AM">11:30 AM (Pre-Lunch)</option>
                      <option value="01:30 PM">01:30 PM (Peak Lunch Hours)</option>
                      <option value="04:30 PM">04:30 PM (High Tea & Filter Coffee)</option>
                      <option value="07:30 PM">07:30 PM (Early Dinner Series)</option>
                      <option value="09:00 PM">09:00 PM (Peak Dinner Hour)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Number of guests */}
                  <div>
                    <label htmlFor="res-guests-input" className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Total Family Size / Guests
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-[#FAFAF8] p-1">
                      <button 
                        type="button"
                        onClick={() => setResGuests(Math.max(1, resGuests - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-[#F8F5EF] cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="flex-grow text-center text-sm font-bold text-[#183A2E]">
                        {resGuests} {resGuests === 1 ? 'Guest' : 'Guests'}
                      </span>
                      <button 
                        type="button"
                        onClick={() => setResGuests(resGuests + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg hover:bg-[#F8F5EF] cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Mail */}
                  <div>
                    <label htmlFor="res-email-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Email address (Optional)
                    </label>
                    <input 
                      id="res-email-input"
                      type="email" 
                      placeholder="e.g., user@patna.com" 
                      value={resEmail}
                      onChange={(e) => setResEmail(e.target.value)}
                      className="w-full bg-[#FAFAF8] text-sm px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                </div>

                {/* Special directions */}
                <div>
                  <label htmlFor="res-notes-input" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Special Seating Requests (e.g., Seniors soft sofa chairs, Baby high-chair needed...)
                  </label>
                  <textarea 
                    id="res-notes-input"
                    rows={2}
                    placeholder="We take pride in accommodating individual medical or childhood dining arrangements."
                    value={resNotes}
                    onChange={(e) => setResNotes(e.target.value)}
                    className="w-full bg-[#FAFAF8] text-sm px-4 py-3 rounded-xl border border-gray-200"
                  />
                </div>

                {/* Submit card */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#183A2E] text-white hover:bg-[#C89B3C] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Confirm Table Reservation Code
                </button>

                {resSuccessInfo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 mt-4"
                  >
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>Table Reservation Confirmed!</span>
                    </div>
                    <p className="text-gray-600 text-xs">
                      Your premium table at Bansi Vihar Fraser Road is locked. Please share code <strong className="text-[#183A2E] text-sm">{resSuccessInfo.code}</strong> at the front desk when arriving.
                    </p>
                    <div className="p-3 bg-white rounded-lg border border-emerald-100 text-[11px] text-gray-600 font-mono">
                      • Code: {resSuccessInfo.code} <br />
                      • Guests: {resGuests} | Time: {resTime} <br />
                      • Contact Support: 0612 222 4804
                    </div>
                  </motion.div>
                )}

              </form>

              {/* Local Storage Saved Bookings list */}
              {reservations.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Your Booked Seats ({reservations.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2.5 pr-2">
                    {reservations.map((res, index) => (
                      <div key={index} className="p-3 bg-[#FAFAF8] rounded-xl border border-[#F8F5EF] flex items-center justify-between text-xs gap-4">
                        <div>
                          <strong className="text-[#183A2E]">{res.name}</strong> 
                          <span className="text-gray-500"> ({res.guests} seats) • </span>
                          <span className="text-[#C89B3C] font-semibold">{res.time} on {res.date}</span>
                        </div>
                        <button 
                          onClick={() => cancelReservation(index)}
                          className="text-red-500 hover:text-red-700 font-bold uppercase text-[10px] tracking-wide cursor-pointer flex items-center gap-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 9. DETAILED MAP & VENUE LOCATION */}
      <section id="address" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase">Visit Bansi Vihar</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#183A2E]">
              Directions & Venue Hours
            </h2>
            <p className="text-gray-600 text-sm">
              Bordering the Marwari Campus on Fraser Road, directly opposite landmark buildings near Dak Bunglow, Patna.
            </p>
            <div className="w-16 h-1 bg-[#C89B3C] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Location Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#183A2E] rounded-2xl p-8 text-white border border-[#C89B3C]/20 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Brand Title */}
                <div>
                  <span className="text-[#C89B3C] text-[10px] font-bold tracking-widest uppercase block mb-1">Our Patna Landmark</span>
                  <h3 className="font-serif text-2xl font-bold mb-1">Bansi Vihar Restaurant</h3>
                  <p className="text-white/60 text-xs">Serving culinary perfection in Patna central since generations.</p>
                </div>

                <div className="w-12 h-0.5 bg-[#C89B3C]"></div>

                {/* Details list */}
                <div className="space-y-4 text-sm">
                  
                  <div className="flex gap-3.5">
                    <MapPin className="w-5 h-5 text-[#C89B3C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Postal Address:</strong>
                      <span className="text-white/80 block mt-1 leading-relaxed text-xs sm:text-sm">
                        Marwari Campus Chauraha, Fraser Road,<br />
                        Near Bank of India, Dak Bunglow,<br />
                        Patna, Bihar 800001
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <Phone className="w-5 h-5 text-[#C89B3C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Telephone Support:</strong>
                      <a href="tel:06122224804" className="text-white hover:text-[#C89B3C] transition-colors mt-1 block">
                        0612 222 4804
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3.5">
                    <Clock className="w-5 h-5 text-[#C89B3C] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white">Operating Hours:</strong>
                      <span className="text-white/80 block mt-1 text-xs">
                        Open Daily (Monday – Sunday)<br />
                        08:00 AM – 11:00 PM <br />
                        (Breakfast, Lunch, Snacks, Dinner)
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Immediate Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-white/10">
                <a 
                  href="tel:06122224804"
                  className="flex-grow flex items-center justify-center gap-2 p-3 bg-[#C89B3C] text-[#183A2E] hover:bg-white hover:text-[#183A2E] text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Call Restaurant
                </a>
                <a 
                  id="google-maps-redirect"
                  href="https://maps.google.com/?q=Bansi+Vihar+Restaurant+Fraser+Road+Patna" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-grow flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-white/20"
                >
                  <MapPin className="w-4 h-4 text-[#C89B3C]" />
                  Get Directions
                </a>
              </div>

            </div>

            {/* Right Map Visualizer Mock (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAFAF8] rounded-2xl border border-gray-200 overflow-hidden relative min-h-[350px] flex flex-col justify-between">
              
              {/* Premium styled schematic map canvas element */}
              <div className="absolute inset-0 bg-[#EFEFEF] flex flex-col items-center justify-center p-6 text-center z-0">
                
                {/* Visual compass/grid decoration */}
                <div className="w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center opacity-30 animate-pulse absolute top-10 right-10">
                  <span className="text-[10px] font-bold">N</span>
                </div>

                <div className="relative p-6 bg-white rounded-2xl shadow-xl max-w-sm border border-gray-100 z-10 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#183A2E] flex items-center justify-center border border-[#C89B3C] mx-auto shadow-md">
                    <span className="text-[#C89B3C] font-serif font-bold text-base">BV</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#183A2E]">Bansi Vihar Patna</h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Located precisely near Bank of India office & Marwari Campus, Fraser Road, Patna, Bihar.
                    </p>
                  </div>
                  
                  {/* Surrounding Landmark indicators */}
                  <div className="pt-2 text-[10px] text-gray-400 font-mono flex flex-wrap justify-center gap-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">📍 Dak Bunglow Crossing (150m)</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">📍 Patna Junction (900m)</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">📍 Gandhi Maidan (1.2km)</span>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=Bansi+Vihar+Restaurant+Fraser+Road+Patna"
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-2.5 bg-[#183A2E] text-white hover:bg-[#C89B3C] text-[10px] font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Open Live in Google Maps
                  </a>
                </div>

                {/* Grid backdrop overlay for map look */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-0 opacity-15 pointer-events-none">
                  {[...Array(72)].map((_, i) => (
                    <div key={i} className="border-t border-l border-gray-400"></div>
                  ))}
                </div>

              </div>

              {/* Bottom Patna landmarks banner */}
              <div className="relative z-10 bg-white/90 backdrop-blur-md p-4 border-t border-gray-200 mt-auto flex items-center gap-4 text-xs">
                <Info className="w-5 h-5 text-[#C89B3C] shrink-0" />
                <p className="text-gray-600">
                  <strong>Parking:</strong> Free street side parking and dedicated drive-through valet assistants available daily from 12:00 PM to 10:00 PM.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 10. FINAL CONVERSION BANNER */}
      <section className="relative py-24 bg-[#183A2E] text-white text-center overflow-hidden">
        {/* Backdrop images */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=1920" 
            alt="Warm coffee background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="text-[#C89B3C] font-semibold text-xs tracking-widest uppercase block">Family Hospitality Since Generations</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Experience Authentic South Indian Flavors Today
          </h2>
          <p className="text-[#F8F5EF]/90 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of happy guests who make Bansi Vihar their forever dining choice. Visit our Fraser Road restaurant or place a speedy custom takeaway order above.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a 
              href="#reserve" 
              className="w-full sm:w-auto px-8 py-4 bg-[#C89B3C] hover:bg-white hover:text-[#183A2E] text-white font-semibold text-xs uppercase tracking-widest rounded-full transition-all shadow-md cursor-pointer"
            >
              Reserve Your Table
            </a>
            <a 
              href="#menu" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-[#F8F5EF] hover:text-[#183A2E] font-semibold text-xs uppercase tracking-widest rounded-full transition-all border border-white/20 cursor-pointer text-white"
            >
              View Menu & Order
            </a>
          </div>
        </div>
      </section>

      {/* 11. DETAILED FOOTER SECTION */}
      <footer className="bg-[#121212] text-white pt-16 pb-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* Column 1: Intro */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#183A2E] flex items-center justify-center border border-[#C89B3C]">
                  <span className="text-[#C89B3C] font-serif font-bold text-sm">B</span>
                </div>
                <span className="font-serif text-xl font-bold text-white">Bansi Vihar</span>
              </div>
              
              <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                One of Patna's oldest and most trusted pure vegetarian South Indian landmarks, bringing generations together over hot sambar and iconic coffee on Fraser Road.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-yellow-500 flex gap-0.5 text-xs">⭐⭐⭐⭐⭐</span>
                <span className="text-[10px] text-white/50">4.1 Rating (9,600+ Reviews)</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">
                Explore Links
              </h4>
              <ul className="space-y-2.5 text-xs text-white/65">
                <li><a href="#about" className="hover:text-white transition-colors">Why Bansi Vihar</a></li>
                <li><a href="#menu" className="hover:text-white transition-colors">Our Gastronomic Menu</a></li>
                <li><a href="#legacy" className="hover:text-white transition-colors">Family Legacy Story</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Diner Memories</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Dining Gallery</a></li>
                <li><a href="#reserve" className="hover:text-white transition-colors">Reserve Table Seatings</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">
                Contact Desk
              </h4>
              <ul className="space-y-3 text-xs text-white/65">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C89B3C] shrink-0 mt-0.5" />
                  <span>
                    Marwari Campus, Fraser Road,<br />
                    Near Bank of India, Dak Bunglow,<br />
                    Patna, Bihar 800001
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C89B3C] shrink-0" />
                  <a href="tel:06122224804" className="hover:text-white transition-colors">0612 222 4804</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#C89B3C] shrink-0" />
                  <span>Daily 08:00 AM – 11:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter/Connect */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C89B3C] mb-4">
                Patna Community
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Stay updated on festive discounts, regional South Indian harvest menus, and seasonal mango lassi days. We never spam.
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="bg-white/10 text-xs px-3 py-2 rounded-lg text-white placeholder-white/40 focus:ring-1 focus:ring-[#C89B3C] border-none shrink w-full"
                />
                <button 
                  onClick={() => alert("Successfully joined the Bansi Vihar Patna newsletter list!")}
                  className="px-3 bg-[#C89B3C] text-black text-xs font-bold rounded-lg cursor-pointer hover:bg-white"
                >
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Social Icons & Schema markup block */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/40">
            <p>© 2026 Bansi Vihar Restaurant, Patna. All rights reserved. Managed with deep respect for local culinary heritage.</p>
            <div className="flex gap-4">
              <a href="https://maps.google.com/?q=Bansi+Vihar+Restaurant+Fraser+Road+Patna" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Patna Maps</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Dining</a>
            </div>
          </div>

          {/* Local Schema for Search crawling accessibility */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Bansi Vihar Restaurant",
            "image": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800",
            "@id": "https://ais-bansi-vihar-patna.run.app",
            "url": "https://ais-bansi-vihar-patna.run.app",
            "telephone": "06122224804",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Marwari Campus Chauraha, Fraser Road, Near Bank of India, Dak Bunglow",
              "addressLocality": "Patna",
              "addressRegion": "Bihar",
              "postalCode": "800001",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 25.6111,
              "longitude": 85.1376
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "08:00",
              "closes": "23:00"
            },
            "servesCuisine": [
              "South Indian",
              "Pure Vegetarian",
              "North Indian"
            ]
          })}} />

        </div>
      </footer>

      {/* 12. WHATSAPP FLOATING SPEED ACTION BUTTON */}
      <a 
        href="https://wa.me/9106122224804?text=Hello%20Bansi%20Vihar%20Patna!%20I'd%20like%20to%20order%20some%20family%20dosas%20and%20Filter%20Coffee."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-6 z-35 p-3.5 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all text-xs uppercase font-extrabold tracking-wider flex items-center gap-2 group cursor-pointer"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 text-white" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap leading-none hidden sm:inline-block">
          Order via WhatsApp
        </span>
      </a>

      {/* 13. DOCK HOT ACTIONS BAR (For High Mobile Conversions) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 flex items-stretch h-16 shadow-2xl overflow-hidden">
        
        {/* Menu View Button */}
        <a 
          id="hot-action-menu"
          href="#menu" 
          className="flex-grow flex flex-col items-center justify-center gap-1 hover:bg-[#FAFAF8] text-[#183A2E] text-center"
        >
          <Utensils className="w-5 h-5 text-[#C89B3C]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Dosa Menu</span>
        </a>

        {/* Call Restaurant Now Button */}
        <a 
          id="hot-action-phone"
          href="tel:06122224804" 
          className="flex-grow flex flex-col items-center justify-center gap-1 hover:bg-[#FAFAF8] text-[#183A2E] border-x border-gray-100 text-center"
        >
          <Phone className="w-5 h-5 text-[#C89B3C]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Call Patna</span>
        </a>

        {/* Reserve Seat Button */}
        <a 
          id="hot-action-reserve"
          href="#reserve" 
          className="flex-grow flex flex-col items-center justify-center gap-1 hover:bg-[#FAFAF8] text-[#183A2E] text-center"
        >
          <Calendar className="w-5 h-5 text-[#C89B3C]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Book Seat</span>
        </a>

        {/* Cart Trigger Badge */}
        <button 
          id="hot-action-cart"
          onClick={() => setIsCartOpen(true)}
          className="flex-grow flex flex-col items-center justify-center gap-1 hover:bg-[#183A2E] hover:text-white text-[#183A2E] border-l border-gray-100 relative text-center"
        >
          <ShoppingBag className="w-5 h-5 text-[#C89B3C]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Order Cart</span>
          {cart.length > 0 && (
            <span className="absolute top-2 right-6 bg-[#C89B3C] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-90">
              {cart.reduce((s, d) => s + d.quantity, 0)}
            </span>
          )}
        </button>

      </div>

      {/* 14. INTERACTIVE ORDERING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            {/* Backdrop click to close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                
                {/* Header */}
                <div className="p-6 bg-[#183A2E] text-white flex items-center justify-between border-b border-[#C89B3C]/30 shrink-0">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#C89B3C]" />
                    <div>
                      <h3 className="font-serif font-bold text-lg leading-tight">Your Order Cart</h3>
                      <span className="text-[10px] text-[#F8F5EF]/75">Preparing authentic South Indian dining delights</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors pointer-events-auto cursor-pointer"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content */}
                {checkoutStep === 'cart' ? (
                  <>
                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                      
                      {cart.length > 0 ? (
                        <>
                          {/* List of Cart Items */}
                          <div className="space-y-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Selected Delicacies</span>
                            {cart.map((item) => (
                              <div 
                                key={item.dish.id} 
                                className="flex gap-4 p-3 bg-[#FAFAF8] rounded-xl border border-gray-100 items-start justify-between"
                              >
                                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                                  <img 
                                    src={item.dish.image} 
                                    alt={item.dish.name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>

                                <div className="flex-grow space-y-1">
                                  <h4 className="font-serif font-bold text-sm text-[#183A2E] leading-none">{item.dish.name}</h4>
                                  <span className="text-[10px] text-[#C89B3C] font-semibold">₹{item.dish.price} each</span>
                                  
                                  {/* Item quantity controllers */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <button 
                                      onClick={() => updateCartQuantity(item.dish.id, -1)}
                                      className="p-1 rounded-sm bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                      <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateCartQuantity(item.dish.id, 1)}
                                      className="p-1 rounded-sm bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                                    >
                                      <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="block font-serif font-bold text-sm text-[#1C1C1C]">₹{item.dish.price * item.quantity}</span>
                                  <button 
                                    onClick={() => removeFromCart(item.dish.id)}
                                    className="text-[10px] text-red-500 hover:text-red-700 underline mt-2 inline-block cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Dining Convenience Selector */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Dining Preferences</span>
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                { key: 'takeaway', label: 'Takeaway', icon: '🛍️' },
                                { key: 'dine-in', label: 'Dine-In pre-cook', icon: '🍽️' },
                                { key: 'drive-through', label: 'Drive-Through', icon: '🚗' },
                                { key: 'delivery', label: 'Delivery', icon: '🛵' }
                              ].map((option) => (
                                <button
                                  key={option.key}
                                  type="button"
                                  onClick={() => setCartOrderOption(option.key as any)}
                                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                                    cartOrderOption === option.key 
                                      ? 'bg-[#183A2E]/5 border-[#C89B3C] text-[#183A2E] ring-1 ring-[#C89B3C]' 
                                      : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                                  }`}
                                >
                                  <span className="block text-lg mb-1">{option.icon}</span>
                                  <span className="block text-[9px] font-bold uppercase leading-none truncate">{option.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Extra Customization Kitchen Notes */}
                          <div>
                            <label htmlFor="cart-special-note-input" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Culinary Customization (e.g. "make dosa extra crispy", "no onion garlic please")
                            </label>
                            <input 
                              id="cart-special-note-input"
                              type="text" 
                              placeholder="Type requests for the head chef..." 
                              value={cartSpecialNote}
                              onChange={(e) => setCartSpecialNote(e.target.value)}
                              className="w-full bg-[#FAFAF8] text-xs px-3.5 py-2.5 rounded-lg border border-gray-200"
                            />
                          </div>

                          {/* Pricing Details Breakdown */}
                          <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#F8F5EF] space-y-2.5 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span className="font-bold text-[#1C1C1C]">₹{cartSubtotal}</span>
                            </div>

                            <div className="flex justify-between">
                              <span>SGST (2.5%)</span>
                              <span>₹{taxGSTGst}</span>
                            </div>

                            <div className="flex justify-between">
                              <span>CGST (2.5%)</span>
                              <span>₹{taxGSTGst}</span>
                            </div>

                            {serviceCharge > 0 && (
                              <div className="flex justify-between text-[#183A2E] font-semibold">
                                <span>Patna Delivery Rider Fuel Charge</span>
                                <span>₹{serviceCharge}</span>
                              </div>
                            )}

                            {discountCoupon > 0 ? (
                              <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                                <span>✨ Legacy 10% Off Applied (&gt;₹500)</span>
                                <span>-₹{discountCoupon}</span>
                              </div>
                            ) : (
                              <div className="text-[10px] text-gray-400 italic">
                                * Tip: Add items worth ₹{501 - cartSubtotal} more to unlock 10% flat discount!
                              </div>
                            )}

                            <div className="border-t border-gray-200 pt-3 flex justify-between text-sm text-[#183A2E] font-serif font-black">
                              <span>Estimated Bill Total</span>
                              <span className="text-[#C89B3C] text-base font-sans">₹{cartTotal}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-20 px-4">
                          <ShoppingBag className="w-12 h-12 text-[#C89B3C]/40 mx-auto mb-4" />
                          <h4 className="font-serif font-bold text-[#183A2E] text-base mb-1">Your Cart is Empty</h4>
                          <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
                            Browse Bansi Vihar's menu and tap "+ Add to Order" on items to construct your dynamic delivery, takeaway, or dine-in prep list.
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Footer confirmation */}
                    {cart.length > 0 && (
                      <div className="p-6 border-t border-gray-100 shrink-0 space-y-3">
                        <button 
                          onClick={handleCheckoutSubmit}
                          className="w-full py-4 rounded-full bg-[#183A2E] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#C89B3C] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#C89B3C]" />
                          Submit Order / Secure Prep
                        </button>

                        <a 
                          href={`https://wa.me/9106122224804?text=Hello%20Bansi%20Vihar%20Patna!%20I'd%20like%20to%20place%20an%20order%20of%20items%3A%20${cart.map(item => `${item.dish.name}%20(x${item.quantity})`).join('%20%2C%20')}%20via%20${cartOrderOption}.%20Total%3A%20${cartTotal}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3.5 rounded-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          Complete Instantly on WhatsApp
                        </a>

                        <p className="text-[10px] text-gray-400 text-center">
                          Secured with Bansi Vihar Patna local family dining safety rules.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  // Success State
                  <div className="flex-grow p-6 flex flex-col justify-between overflow-y-auto">
                    
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow">
                        <Check className="w-8 h-8 text-emerald-600" />
                      </div>
                      
                      <h4 className="font-serif text-2xl font-bold text-[#183A2E]">
                        Savoury Order Placed!
                      </h4>

                      <p className="text-gray-600 text-xs leading-relaxed max-w-sm mx-auto">
                        Your Order Code is <strong className="text-[#183A2E] text-sm select-all">{lastOrderDetails?.orderId}</strong>. The kitchen has begun fermenting and preparing your South Indian delights instantly.
                      </p>

                      {/* Receipt design */}
                      <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#F8F5EF] text-left text-xs font-mono space-y-2 max-w-xs mx-auto">
                        <div className="border-b border-dashed border-gray-300 pb-2 text-[10px] text-gray-500">
                          BANSI VIHAR PATNA • FRASER RD
                        </div>
                        <div className="text-[11px] text-gray-600">
                          • Code: {lastOrderDetails?.orderId} <br />
                          • Type: {cartOrderOption.toUpperCase()} <br />
                          • Status: PENDING / PREPARING
                        </div>
                        
                        <div className="border-t border-b border-dashed border-gray-300 py-1 space-y-1 my-2">
                          {lastOrderDetails?.items.map(item => (
                            <div key={item.dish.id} className="flex justify-between text-[11px]">
                              <span>{item.dish.name.substring(0, 15)}.. x{item.quantity}</span>
                              <span>₹{item.dish.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {cartSpecialNote && (
                          <div className="text-[10px] italic text-amber-800">
                            * Custom: "{cartSpecialNote}"
                          </div>
                        )}

                        <div className="flex justify-between font-bold text-[#183A2E] text-[12px] pt-1">
                          <span>TOTAL EST.</span>
                          <span>₹{lastOrderDetails?.total}</span>
                        </div>
                      </div>

                    </div>

                    <div className="space-y-3">
                      {/* Return actions */}
                      <button
                        onClick={() => {
                          setCheckoutStep('cart');
                          setIsCartOpen(false);
                          setCartSpecialNote('');
                        }}
                        className="w-full py-3.5 bg-[#183A2E] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#C89B3C] cursor-pointer"
                      >
                        Keep Browsing Menu
                      </button>

                      <a 
                        href={`https://wa.me/9106122224804?text=Hello%20Bansi%20Vihar%20Patna!%20I%20have%20an%20order%20registered%20with%20Code%20${lastOrderDetails?.orderId}.%20Please%20verify%20delivery%2Fpickup%20time.`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 text-[#183A2E] hover:text-[#C89B3C] text-[11px] font-bold uppercase tracking-widest text-center block"
                      >
                        Get Real-time Delivery Estimate
                      </a>
                    </div>

                  </div>
                )}

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
