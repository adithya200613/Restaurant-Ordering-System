-- ============================================================
--  RESTAURANT ORDERING SYSTEM - DATABASE SCHEMA & SAMPLE DATA
--  DBMS Project | Only SQL (simulate with JSON in frontend)
-- ============================================================

-- ─────────────────────────────────────────
-- STEP 1: CREATE TABLES
-- ─────────────────────────────────────────

-- Table 1: Categories (e.g. Starters, Main Course, Drinks)
CREATE TABLE categories (
    category_id   INT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(100)  NOT NULL,
    description   VARCHAR(255),
    icon          VARCHAR(50)                    -- emoji icon for UI
);

-- Table 2: Menu Items
CREATE TABLE menu_items (
    item_id       INT PRIMARY KEY AUTO_INCREMENT,
    category_id   INT           NOT NULL,
    name          VARCHAR(150)  NOT NULL,
    description   VARCHAR(300),
    price         DECIMAL(8,2)  NOT NULL,
    image_url     VARCHAR(300),
    is_veg        BOOLEAN       DEFAULT TRUE,
    is_available  BOOLEAN       DEFAULT TRUE,
    rating        DECIMAL(2,1)  DEFAULT 4.0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Table 3: Orders
CREATE TABLE orders (
    order_id      INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(150)  NOT NULL,
    table_number  INT,
    order_time    DATETIME      DEFAULT CURRENT_TIMESTAMP,
    status        ENUM('pending','preparing','ready','delivered') DEFAULT 'pending',
    total_amount  DECIMAL(10,2) DEFAULT 0.00
);

-- Table 4: Order Items (items inside each order)
CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id      INT           NOT NULL,
    item_id       INT           NOT NULL,
    quantity      INT           NOT NULL DEFAULT 1,
    unit_price    DECIMAL(8,2)  NOT NULL,
    subtotal      DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id)  REFERENCES menu_items(item_id)
);


-- ─────────────────────────────────────────
-- STEP 2: INSERT SAMPLE DATA
-- ─────────────────────────────────────────

-- Categories
INSERT INTO categories (name, description, icon) VALUES
('Starters',     'Light bites to kick off your meal',    '🥗'),
('Main Course',  'Hearty and filling main dishes',        '🍛'),
('Burgers',      'Juicy flame-grilled burgers',           '🍔'),
('Pizza',        'Wood-fired artisan pizzas',             '🍕'),
('Pasta',        'Classic Italian pasta dishes',          '🍝'),
('Desserts',     'Sweet treats to end your meal',         '🍰'),
('Drinks',       'Fresh beverages and mocktails',         '🥤');

-- Menu Items
INSERT INTO menu_items (category_id, name, description, price, is_veg, rating) VALUES
-- Starters
(1, 'Crispy Spring Rolls',  'Golden fried rolls filled with spiced veggies',      3.99,  TRUE,  4.5),
(1, 'Chicken Wings',        'Tangy buffalo sauce wings with blue cheese dip',     6.49,  FALSE, 4.7),
(1, 'Garlic Bread',         'Toasted baguette with herb garlic butter',           2.99,  TRUE,  4.3),
(1, 'Soup of the Day',      'Chef\'s fresh daily soup with crusty bread',         4.49,  TRUE,  4.2),
(1, 'Paneer Tikka',         'Marinated cottage cheese grilled to perfection',     5.99,  TRUE,  4.6),

-- Main Course
(2, 'Butter Chicken',       'Tender chicken in rich creamy tomato gravy',         11.99, FALSE, 4.8),
(2, 'Paneer Butter Masala', 'Cottage cheese cubes in luscious butter gravy',      10.49, TRUE,  4.7),
(2, 'Lamb Biryani',         'Slow-cooked spiced lamb with fragrant basmati rice', 13.99, FALSE, 4.9),
(2, 'Veg Fried Rice',       'Wok-tossed rice with colorful fresh vegetables',     8.49,  TRUE,  4.3),
(2, 'Fish & Chips',         'Beer-battered cod fillet with crispy golden chips',  12.99, FALSE, 4.5),

-- Burgers
(3, 'Classic Beef Burger',  'Beef patty, cheddar, lettuce, tomato, pickles',      9.49,  FALSE, 4.6),
(3, 'Veggie Burger',        'Spiced chickpea patty with avocado and salsa',       8.49,  TRUE,  4.4),
(3, 'BBQ Bacon Burger',     'Smoky BBQ sauce, crispy bacon, caramelized onion',   10.99, FALSE, 4.8),
(3, 'Mushroom Swiss Burger','Portobello mushroom, Swiss cheese, truffle aioli',   9.99,  TRUE,  4.5),

-- Pizza
(4, 'Margherita',           'Fresh tomato sauce, mozzarella, basil',              10.99, TRUE,  4.6),
(4, 'Pepperoni',            'Loaded with spicy pepperoni and mozzarella',         12.99, FALSE, 4.8),
(4, 'BBQ Chicken Pizza',    'BBQ sauce, grilled chicken, red onion, cilantro',    13.49, FALSE, 4.7),
(4, 'Garden Veggie Pizza',  'Bell peppers, olives, mushrooms, cherry tomatoes',   11.49, TRUE,  4.4),

-- Pasta
(5, 'Spaghetti Bolognese',  'Classic meat sauce with rich tomato and herbs',      11.49, FALSE, 4.7),
(5, 'Penne Arrabbiata',     'Spicy tomato sauce with garlic and fresh chili',     9.49,  TRUE,  4.5),
(5, 'Creamy Alfredo',       'Fettuccine in rich Parmesan cream sauce',            10.99, TRUE,  4.6),
(5, 'Seafood Linguine',     'Prawns, mussels & calamari in white wine sauce',     14.99, FALSE, 4.8),

-- Desserts
(6, 'Chocolate Lava Cake',  'Warm chocolate cake with molten center & ice cream', 6.49,  TRUE,  4.9),
(6, 'Mango Kulfi',          'Indian frozen dessert with pistachios & rose',       4.99,  TRUE,  4.7),
(6, 'Tiramisu',             'Classic Italian coffee dessert with mascarpone',     5.99,  TRUE,  4.8),
(6, 'Cheesecake Slice',     'New York style cheesecake with berry coulis',        5.49,  TRUE,  4.6),

-- Drinks
(7, 'Mango Lassi',          'Thick chilled yogurt drink with ripe Alphonso mango',3.99,  TRUE,  4.8),
(7, 'Virgin Mojito',        'Fresh lime, mint, soda — perfectly refreshing',      3.49,  TRUE,  4.6),
(7, 'Cold Coffee',          'Blended ice coffee with whipped cream',              3.99,  TRUE,  4.5),
(7, 'Fresh Orange Juice',   'Squeezed to order, pure & pulpy',                   3.49,  TRUE,  4.4),
(7, 'Masala Chai',          'Spiced Indian tea brewed with ginger & cardamom',    2.49,  TRUE,  4.7);


-- ─────────────────────────────────────────
-- STEP 3: USEFUL SQL QUERIES
-- ─────────────────────────────────────────

-- Q1: View full menu with category names
SELECT
    c.name          AS category,
    m.item_id,
    m.name          AS item_name,
    m.price,
    m.is_veg,
    m.rating
FROM menu_items m
JOIN categories c ON m.category_id = c.category_id
WHERE m.is_available = TRUE
ORDER BY c.category_id, m.name;

-- Q2: Search food items by name (keyword search)
SELECT item_id, name, description, price
FROM menu_items
WHERE name LIKE '%chicken%'
   OR description LIKE '%chicken%';

-- Q3: Filter only vegetarian items
SELECT name, price, rating
FROM menu_items
WHERE is_veg = TRUE AND is_available = TRUE
ORDER BY rating DESC;

-- Q4: Get items by category
SELECT m.name, m.price, m.description
FROM menu_items m
JOIN categories c ON m.category_id = c.category_id
WHERE c.name = 'Pizza';

-- Q5: Insert a new order
INSERT INTO orders (customer_name, table_number, status)
VALUES ('Rahul Sharma', 5, 'pending');

-- Q6: Add items to an order (order_id = 1)
INSERT INTO order_items (order_id, item_id, quantity, unit_price) VALUES
(1, 6,  2, 11.99),   -- 2x Butter Chicken
(1, 15, 1, 10.99),   -- 1x Margherita Pizza
(1, 27, 2,  3.99);   -- 2x Mango Lassi

-- Q7: View all items in a specific order
SELECT
    o.customer_name,
    o.table_number,
    m.name          AS item,
    oi.quantity,
    oi.unit_price,
    oi.subtotal
FROM order_items oi
JOIN orders     o ON oi.order_id = o.order_id
JOIN menu_items m ON oi.item_id  = m.item_id
WHERE oi.order_id = 1;

-- Q8: Update order total
UPDATE orders
SET total_amount = (
    SELECT SUM(subtotal) FROM order_items WHERE order_id = 1
)
WHERE order_id = 1;

-- Q9: Get top rated items
SELECT name, price, rating
FROM menu_items
WHERE is_available = TRUE
ORDER BY rating DESC
LIMIT 5;

-- Q10: Revenue report per category
SELECT
    c.name          AS category,
    COUNT(oi.order_item_id) AS total_orders,
    SUM(oi.subtotal)        AS total_revenue
FROM order_items oi
JOIN menu_items  m ON oi.item_id      = m.item_id
JOIN categories  c ON m.category_id  = c.category_id
GROUP BY c.name
ORDER BY total_revenue DESC;
