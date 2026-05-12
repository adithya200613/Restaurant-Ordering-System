// ============================================================
//  data.js — Simulated Database (mirrors the SQL schema)
//  This replaces a real backend/SQL engine in the browser.
// ============================================================

const DB = {

  categories: [
    { category_id: 1, name: "Starters",    icon: "🥗" },
    { category_id: 2, name: "Main Course", icon: "🍛" },
    { category_id: 3, name: "Burgers",     icon: "🍔" },
    { category_id: 4, name: "Pizza",       icon: "🍕" },
    { category_id: 5, name: "Pasta",       icon: "🍝" },
    { category_id: 6, name: "Desserts",    icon: "🍰" },
    { category_id: 7, name: "Drinks",      icon: "🥤" },
  ],

  menu_items: [
    // ── Starters ───────────────────────────────────────────
    { item_id: 1,  category_id: 1, name: "Crispy Spring Rolls",    description: "Golden fried rolls filled with spiced veggies",         price: 3.99,  is_veg: true,  rating: 4.5, emoji: "🥢" },
    { item_id: 2,  category_id: 1, name: "Chicken Wings",          description: "Tangy buffalo sauce wings with blue cheese dip",         price: 6.49,  is_veg: false, rating: 4.7, emoji: "🍗" },
    { item_id: 3,  category_id: 1, name: "Garlic Bread",           description: "Toasted baguette with herb garlic butter",               price: 2.99,  is_veg: true,  rating: 4.3, emoji: "🥖" },
    { item_id: 4,  category_id: 1, name: "Soup of the Day",        description: "Chef's fresh daily soup served with crusty bread",       price: 4.49,  is_veg: true,  rating: 4.2, emoji: "🍲" },
    { item_id: 5,  category_id: 1, name: "Paneer Tikka",           description: "Marinated cottage cheese grilled to perfection",         price: 5.99,  is_veg: true,  rating: 4.6, emoji: "🫕" },
    // ── Main Course ────────────────────────────────────────
    { item_id: 6,  category_id: 2, name: "Butter Chicken",         description: "Tender chicken in rich creamy tomato gravy",             price: 11.99, is_veg: false, rating: 4.8, emoji: "🍛" },
    { item_id: 7,  category_id: 2, name: "Paneer Butter Masala",   description: "Cottage cheese cubes in luscious butter gravy",          price: 10.49, is_veg: true,  rating: 4.7, emoji: "🍛" },
    { item_id: 8,  category_id: 2, name: "Lamb Biryani",           description: "Slow-cooked spiced lamb with fragrant basmati rice",     price: 13.99, is_veg: false, rating: 4.9, emoji: "🫙" },
    { item_id: 9,  category_id: 2, name: "Veg Fried Rice",         description: "Wok-tossed rice with colorful fresh vegetables",         price: 8.49,  is_veg: true,  rating: 4.3, emoji: "🍚" },
    { item_id: 10, category_id: 2, name: "Fish & Chips",           description: "Beer-battered cod fillet with crispy golden chips",      price: 12.99, is_veg: false, rating: 4.5, emoji: "🐟" },
    // ── Burgers ────────────────────────────────────────────
    { item_id: 11, category_id: 3, name: "Classic Beef Burger",    description: "Beef patty, cheddar, lettuce, tomato & pickles",         price: 9.49,  is_veg: false, rating: 4.6, emoji: "🍔" },
    { item_id: 12, category_id: 3, name: "Veggie Burger",          description: "Spiced chickpea patty with avocado & salsa",             price: 8.49,  is_veg: true,  rating: 4.4, emoji: "🥗" },
    { item_id: 13, category_id: 3, name: "BBQ Bacon Burger",       description: "Smoky BBQ sauce, crispy bacon, caramelized onion",       price: 10.99, is_veg: false, rating: 4.8, emoji: "🥓" },
    { item_id: 14, category_id: 3, name: "Mushroom Swiss Burger",  description: "Portobello mushroom, Swiss cheese, truffle aioli",       price: 9.99,  is_veg: true,  rating: 4.5, emoji: "🍄" },
    // ── Pizza ──────────────────────────────────────────────
    { item_id: 15, category_id: 4, name: "Margherita",             description: "Fresh tomato sauce, mozzarella & fresh basil",           price: 10.99, is_veg: true,  rating: 4.6, emoji: "🍕" },
    { item_id: 16, category_id: 4, name: "Pepperoni",              description: "Loaded with spicy pepperoni and mozzarella",             price: 12.99, is_veg: false, rating: 4.8, emoji: "🍕" },
    { item_id: 17, category_id: 4, name: "BBQ Chicken Pizza",      description: "BBQ sauce, grilled chicken, red onion & cilantro",       price: 13.49, is_veg: false, rating: 4.7, emoji: "🍕" },
    { item_id: 18, category_id: 4, name: "Garden Veggie Pizza",    description: "Bell peppers, olives, mushrooms & cherry tomatoes",      price: 11.49, is_veg: true,  rating: 4.4, emoji: "🍕" },
    // ── Pasta ──────────────────────────────────────────────
    { item_id: 19, category_id: 5, name: "Spaghetti Bolognese",    description: "Classic meat sauce with rich tomato and herbs",          price: 11.49, is_veg: false, rating: 4.7, emoji: "🍝" },
    { item_id: 20, category_id: 5, name: "Penne Arrabbiata",       description: "Spicy tomato sauce with garlic and fresh chili",         price: 9.49,  is_veg: true,  rating: 4.5, emoji: "🍝" },
    { item_id: 21, category_id: 5, name: "Creamy Alfredo",         description: "Fettuccine in rich Parmesan cream sauce",                price: 10.99, is_veg: true,  rating: 4.6, emoji: "🍝" },
    { item_id: 22, category_id: 5, name: "Seafood Linguine",       description: "Prawns, mussels & calamari in white wine sauce",         price: 14.99, is_veg: false, rating: 4.8, emoji: "🦐" },
    // ── Desserts ───────────────────────────────────────────
    { item_id: 23, category_id: 6, name: "Chocolate Lava Cake",    description: "Warm chocolate cake with molten center & ice cream",     price: 6.49,  is_veg: true,  rating: 4.9, emoji: "🍫" },
    { item_id: 24, category_id: 6, name: "Mango Kulfi",            description: "Indian frozen dessert with pistachios & rose",           price: 4.99,  is_veg: true,  rating: 4.7, emoji: "🥭" },
    { item_id: 25, category_id: 6, name: "Tiramisu",               description: "Classic Italian coffee dessert with mascarpone",         price: 5.99,  is_veg: true,  rating: 4.8, emoji: "☕" },
    { item_id: 26, category_id: 6, name: "Cheesecake Slice",       description: "New York style cheesecake with berry coulis",            price: 5.49,  is_veg: true,  rating: 4.6, emoji: "🍰" },
    // ── Drinks ─────────────────────────────────────────────
    { item_id: 27, category_id: 7, name: "Mango Lassi",            description: "Thick chilled yogurt drink with ripe Alphonso mango",    price: 3.99,  is_veg: true,  rating: 4.8, emoji: "🥭" },
    { item_id: 28, category_id: 7, name: "Virgin Mojito",          description: "Fresh lime, mint & soda — perfectly refreshing",         price: 3.49,  is_veg: true,  rating: 4.6, emoji: "🍹" },
    { item_id: 29, category_id: 7, name: "Cold Coffee",            description: "Blended ice coffee with whipped cream",                  price: 3.99,  is_veg: true,  rating: 4.5, emoji: "☕" },
    { item_id: 30, category_id: 7, name: "Fresh Orange Juice",     description: "Squeezed to order, pure & pulpy",                       price: 3.49,  is_veg: true,  rating: 4.4, emoji: "🍊" },
    { item_id: 31, category_id: 7, name: "Masala Chai",            description: "Spiced Indian tea brewed with ginger & cardamom",       price: 2.49,  is_veg: true,  rating: 4.7, emoji: "🍵" },
  ],

  // ── SQL-like query functions ──────────────────────────────

  /** SELECT * FROM menu_items WHERE name LIKE '%q%' OR description LIKE '%q%' */
  searchItems(query) {
    const q = query.toLowerCase().trim();
    if (!q) return this.menu_items;
    return this.menu_items.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  },

  /** SELECT * FROM menu_items WHERE category_id = id */
  getByCategory(categoryId) {
    if (categoryId === 0) return this.menu_items;       // 0 = ALL
    return this.menu_items.filter(i => i.category_id === categoryId);
  },

  /** SELECT * FROM menu_items WHERE is_veg = flag */
  filterVeg(vegOnly) {
    if (!vegOnly) return this.menu_items;
    return this.menu_items.filter(i => i.is_veg);
  },

  /** Combined filter: category + search + veg */
  query({ categoryId = 0, search = "", vegOnly = false } = {}) {
    return this.menu_items.filter(item => {
      const matchCat  = categoryId === 0 || item.category_id === categoryId;
      const matchQ    = !search || item.name.toLowerCase().includes(search.toLowerCase())
                                || item.description.toLowerCase().includes(search.toLowerCase());
      const matchVeg  = !vegOnly || item.is_veg;
      return matchCat && matchQ && matchVeg;
    });
  },

  getCategoryById(id)  { return this.categories.find(c => c.category_id === id); },
  getItemById(id)      { return this.menu_items.find(i => i.item_id === id);      },
};
